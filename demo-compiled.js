(function() {
  var __create = Object.create ? Object.create : function(prototype) {
    return {'__proto__': prototype};
  };
  var __imul = Math.imul ? Math.imul : function(a, b) {
    return (a * (b >>> 16) << 16) + a * (b & 65535) | 0;
  };

  function assert(truth) {
    if (!truth) {
      throw Error('Assertion failed');
    }
  }

  // TODO(ryan): If we want things to look smooth on Retina displays we should
  // set canvas.width to devicePixelRatio * sizeUsedInCSS. But doing so makes
  // things laggy on a Macbook Air. So let's improve performance before we do
  // that.
  function getCanvas(container, className, canvasSize) {
    var canvas = container.getElementsByClassName(className)[0];
    canvas.width = canvasSize * Browser.devicePixelRatio() | 0;
    canvas.height = canvasSize * Browser.devicePixelRatio() | 0;
    canvas.style.width = canvasSize.toString() + 'px';
    canvas.style.height = canvasSize.toString() + 'px';
    return canvas;
  }

  // Builds a Voronoi generator and displays an error on the page if we can't
  // (likely because this browser doesn't support WebGL).
  function createVoronoiGenerator(outputCanvas, options) {
    var voronoi = null;

    try {
      voronoi = new Voronoi(outputCanvas, options);
    }

    catch (temp) {
      // Failed to initialize Web-GL. Display error.
      document.getElementById('demo-page').style.display = 'none';
      document.getElementById('webgl-error').style.display = null;

      throw temp;
    }

    return voronoi;
  }

  function initializePaintDemo(container, antialiasingFactor) {
    var inputCanvas = getCanvas(container, 'input-canvas', 256);
    var outputCanvas = getCanvas(container, 'output-canvas', 256);
    var opts = new Voronoi.Options();
    opts.antialiasingFactor = antialiasingFactor;
    var voronooi = createVoronoiGenerator(outputCanvas, opts);

    // A CanvasDrawController handles user draw-actions on the input canvas
    // Whenever the user draws, we re-render the voronoi diagram for the input
    new CanvasDrawController(inputCanvas, outputCanvas, function() {
      voronooi.setSeedsFromCanvas(inputCanvas);
      voronooi.computeVoronoi();
      voronooi.drawToOutputCanvas();
    });
  }

  function initializeFishDemo(container, antialiasingFactor) {
    var inputCanvas = getCanvas(container, 'input-canvas', 256);
    var outputCanvas = getCanvas(container, 'output-canvas', 256);
    var opts = new Voronoi.Options();
    opts.wrap = true;
    opts.antialiasingFactor = antialiasingFactor;
    var voronoi = createVoronoiGenerator(outputCanvas, opts);
    new FishGameController(inputCanvas, outputCanvas, function() {
      voronoi.setSeedsFromCanvas(inputCanvas);
      voronoi.computeVoronoi();
      voronoi.drawToOutputCanvas();
    });
  }

  function initializePhotoDemo(container, antialiasingFactor) {
    var inputCanvas = getCanvas(container, 'input-canvas', 256);
    var outputCanvas = getCanvas(container, 'output-canvas', 256);
    var opts = new Voronoi.Options();
    opts.antialiasingFactor = antialiasingFactor;
    var voronoi = createVoronoiGenerator(outputCanvas, opts);
    new PhotoDemoController(inputCanvas, outputCanvas, function(photoController) {
      voronoi.setSeedsFromCanvas(photoController.seedCanvas());
      voronoi.computeVoronoi();
      voronoi.drawToOutputCanvas();
    });
  }

  function initializeDistanceDemo(container, antialiasingFactor) {
    var inputCanvas = getCanvas(container, 'input-canvas', 256);
    var outputCanvas = getCanvas(container, 'output-canvas', 256);
    var opts = new Voronoi.Options();
    opts.wrap = true;
    opts.antialiasingFactor = antialiasingFactor;
    var voronoi = createVoronoiGenerator(outputCanvas, opts);
    new FishGameController(inputCanvas, outputCanvas, function() {
      voronoi.setSeedsFromCanvas(inputCanvas);
      voronoi.computeVoronoi();
      voronoi.drawDistanceFieldToOutputCanvas();
    });
  }

  function initializeThresholdDemo(container, antialiasingFactor) {
    var inputCanvas = getCanvas(container, 'input-canvas', 256);
    var outputCanvas = getCanvas(container, 'output-canvas', 256);
    var opts = new Voronoi.Options();
    opts.wrap = true;
    opts.antialiasingFactor = antialiasingFactor;
    opts.minSeedDistanceThreshold = 15;
    var voronoi = createVoronoiGenerator(outputCanvas, opts);
    new FishGameController(inputCanvas, outputCanvas, function() {
      voronoi.setSeedsFromCanvas(inputCanvas);
      voronoi.computeVoronoi();
      voronoi.drawToOutputCanvas();
    });
  }

  function main() {
    window.onload = function() {
      var antialiasingFactor = 1;

      try {
        var antialiasingFactorParam = Browser.getQueryVariable('antialiasingFactor');

        if (antialiasingFactorParam != null) {
          antialiasingFactor = parseInt(antialiasingFactorParam, 10);
        }
      }

      catch (e) {
      }

      initializePaintDemo(document.getElementById('paint-demo-container'), antialiasingFactor);
      initializeFishDemo(document.getElementById('fish-demo-container'), antialiasingFactor);
      initializePhotoDemo(document.getElementById('photo-demo-container'), antialiasingFactor);
      initializeDistanceDemo(document.getElementById('distance-demo-container'), antialiasingFactor);
      initializeThresholdDemo(document.getElementById('threshold-demo-container'), antialiasingFactor);
    };
  }

  function fmod(a, b) {
    return a - b * Math.floor(a / b);
  }

  function getWebGLExtension(gl, name) {
    var ext = gl.getExtension(name);

    if (ext === null) {
      throw new Error('Unsupported WebGL extension with name ' + name);
    }

    return ext;
  }

  // See here to understand how this works:
  // http://www.skorks.com/2010/10/write-a-function-to-determine-if-a-number-is-a-power-of-2/
  function isPowerOfTwo(number) {
    return number != 0 && (number & number - 1) == 0;
  }

  // onDraw will be called whenever the user draws something in the canvas.
  // Useful since we want to re-compute the Voronoi diagram of the canvas
  // every time the user draws.
  function CanvasDrawController(inputCanvas, outputCanvas, onDraw) {
    var self = this;
    self._inputCanvas = null;
    self._outputCanvas = null;
    self._ctx = null;
    self._onDraw = null;
    self._inputCanvas = inputCanvas;
    self._outputCanvas = outputCanvas;
    self._onDraw = onDraw;
    self._inputCanvas.style.backgroundColor = 'white';
    self._ctx = in_HTMLCanvasElement.getContext2D(self._inputCanvas);
    self._ctx.scale(Browser.devicePixelRatio(), Browser.devicePixelRatio());
    var isMouseDown = false;

    for (var i = 0, list = [self._inputCanvas, self._outputCanvas], count = in_List.count(list); i < count; i = i + 1 | 0) {
      var canvas = in_List.get(list, i);
      in_HTMLElement.addEventListener4(canvas, 'mousemove', function(e) {
        if (isMouseDown && (e.target == self._inputCanvas || e.target == self._outputCanvas)) {
          self._changeColorAndDraw(in_HTMLMouseEvent.location(e));
        }
      });
    }

    in_HTMLDocument.addEventListener4(document, 'mousedown', function(e) {
      if (e.target == self._inputCanvas || e.target == self._outputCanvas) {
        isMouseDown = true;
        self._changeColorAndDraw(in_HTMLMouseEvent.location(e));
      }
    });
    in_HTMLDocument.addEventListener4(document, 'mouseup', function(e) {
      isMouseDown = false;
    });
    in_HTMLDocument.addEventListener4(document, 'mouseleave', function(e) {
      isMouseDown = false;
    });
    var canvasRect = self._inputCanvas.getBoundingClientRect();
    self._changeColorAndDraw(new Vector(canvasRect.width / 2 | 0, canvasRect.height / 2 | 0));
  }

  CanvasDrawController.prototype._changeColorAndDraw = function(point) {
    var canvasRect = this._inputCanvas.getBoundingClientRect();

    if (point.x > 0 && point.y > 0 && point.x < canvasRect.width && point.y < canvasRect.height) {
      var color = new Color(0.5 + Math.random() * 0.4, 0.2, 0.3 + Math.random() * 0.5, 1);
      this._ctx.beginPath();
      this._ctx.rect(point.x - CanvasDrawController.dotRadius | 0, point.y - CanvasDrawController.dotRadius | 0, __imul(CanvasDrawController.dotRadius, 2), __imul(CanvasDrawController.dotRadius, 2));
      in_CanvasRenderingContext2D.setFillStyle(this._ctx, color.toCSS());
      this._ctx.fill();

      if (this._onDraw != null) {
        this._onDraw();
      }
    }
  };

  function FishGameController(inputCanvas, outputCanvas, onDraw) {
    var self = this;
    self._inputCanvas = null;
    self._outputCanvas = null;
    self._ctx = null;
    self._onDraw = null;
    self._numPads = 12;
    self._pads = [];
    self._speeds = [];
    self._fish = null;
    self._inputCanvas = inputCanvas;
    self._outputCanvas = outputCanvas;
    self._onDraw = onDraw;
    self._ctx = in_HTMLCanvasElement.getContext2D(self._inputCanvas);
    self._ctx.scale(Browser.devicePixelRatio(), Browser.devicePixelRatio());
    var canvasRect = self._inputCanvas.getBoundingClientRect();

    for (var i = 1, count = self._numPads; i < count; i = i + 1 | 0) {
      self._pads.push(new Square(new Vector(Math.random() * canvasRect.width, Math.random() * canvasRect.height)));
      in_List.get(self._pads, in_List.count(self._pads) - 1 | 0).color = in_List.get(waterColors, i % in_List.count(waterColors) | 0);
      self._speeds.push(15 + Math.random() * 8);
    }

    self._fish = new Square(new Vector(Math.random() * canvasRect.width, Math.random() * canvasRect.height));
    self._fish.color = Color.fromHex(16771345);

    for (var i1 = 0, list = [self._inputCanvas, self._outputCanvas], count1 = in_List.count(list); i1 < count1; i1 = i1 + 1 | 0) {
      var canvas = in_List.get(list, i1);
      in_HTMLElement.addEventListener4(canvas, 'mousemove', function(e) {
        self._fish.center = in_HTMLMouseEvent.location(e);
      });
    }

    self._startRenderLoop();
  }

  FishGameController.prototype._startRenderLoop = function() {
    var self = this;
    Browser.renderWhileElementOnScreen(self._inputCanvas, function(elapsedMs) {
      self._render(elapsedMs);
    });
  };

  FishGameController.prototype._render = function(timeElapsedMs) {
    var elapsedSeconds = timeElapsedMs / 1000;
    var canvasRect = this._inputCanvas.getBoundingClientRect();
    this._ctx.clearRect(0, 0, canvasRect.width, canvasRect.height);

    for (var i = 1, count1 = in_List.count(this._pads); i < count1; i = i + 1 | 0) {
      var pad = in_List.get(this._pads, i);
      pad.center.x += in_List.get(this._speeds, i) * elapsedSeconds;
      pad.center.y -= in_List.get(this._speeds, i) * elapsedSeconds;

      // Walk through the other pads and make sure that we're not too close
      // to any of them.
      for (var j = 1, count = in_List.count(this._pads); j < count; j = j + 1 | 0) {
        if (i != j && pad.center.distanceTo(in_List.get(this._pads, j).center) < 40) {
          pad.center.addUpdate(pad.center.subtract(in_List.get(this._pads, j).center).normalize().multiply1(elapsedSeconds).multiply1(5));
        }
      }

      pad.center.remainderUpdate(new Vector(canvasRect.width, canvasRect.height));
    }

    for (var i1 = 0, list = this._pads, count2 = in_List.count(list); i1 < count2; i1 = i1 + 1 | 0) {
      var pad1 = in_List.get(list, i1);
      pad1.render(this._ctx);
    }

    this._fish.render(this._ctx);

    if (this._onDraw != null) {
      this._onDraw();
    }
  };

  function SeedSpiralMouseBehavior(controller) {
    this._controller = null;
    this._relativeSeedLocations = [];
    this._dragContext = null;
    this._handle = new Vector(0, 0);
    this._center = new Vector(0, 0);
    this._lastKnownMouse = new Vector(0, 0);
    this._controller = controller;
    var canvasElementRect = this._controller.inputCanvas.getBoundingClientRect();
    var canvasElementSize = new Vector(canvasElementRect.width, canvasElementRect.height);
    this._center = new Vector(canvasElementSize.x / 2, canvasElementSize.y / 2);

    // Position the handle above the center
    this._handle = this._center.clone();
    this._handle.y -= SeedSpiralMouseBehavior.initialCenterHandleDistance;

    for (var radiusIndex = 0; radiusIndex < 20; radiusIndex = radiusIndex + 1 | 0) {
      // Need more and more points as we get further out
      var numPoints = 10;

      // Radius gets bigger as we get further out
      var radius = __imul(radiusIndex, radiusIndex);

      for (var i = 0; i < numPoints; i++) {
        var x = radius * Math.cos(i / numPoints * in_Math.PI() * 2);
        var y = radius * Math.sin(i / numPoints * in_Math.PI() * 2);
        x += Math.random() * 30 - 15;
        y += Math.random() * 30 - 15;
        this._relativeSeedLocations.push(new Vector(x, y));
      }
    }

    this._render();
  }

  SeedSpiralMouseBehavior.prototype._render = function() {
    // Clear the controller so we can start drawing
    this._controller.clearSeedCanvas();

    // Draw the new seeds via the controller
    var angle = this._handle.subtract(this._center).toAngleRad();

    for (var i = 0, list = this._relativeSeedLocations, count = in_List.count(list); i < count; i = i + 1 | 0) {
      var seedLocation = in_List.get(list, i);
      var location = seedLocation.clone();

      // Scale according to how far handle is from center
      location.multiplyUpdate1(Math.max(this._center.distanceTo(this._handle) / SeedSpiralMouseBehavior.initialCenterHandleDistance * 2, 0.5));

      // Rotate by the angle between _center and _handle
      location = location.rotated(angle);

      // Move according to where the center is
      location.addUpdate(this._center);
      this._drawIfOnCanvas(location);
    }

    this._drawHandleAndCenter();
    this._controller.onDraw(this._controller);
  };

  SeedSpiralMouseBehavior.prototype._drawHandleAndCenter = function() {
    var ctx = this._controller.inputContext;
    var canvasHandle = this._handle;
    var canvasCenter = this._center;

    // Draw line between the center and anchor
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(canvasHandle.x | 0, canvasHandle.y | 0);
    ctx.lineTo(canvasCenter.x | 0, canvasCenter.y | 0);
    in_CanvasRenderingContext2D.setStrokeStyle(ctx, '#A5A3A3');
    ctx.stroke();

    // Figure out hover state
    var normalColor = '#46C9FF';
    var hoverColor = '#ACE7FF';
    var downColor = '#0F86B7';
    var centerColor = normalColor;
    var handleColor = normalColor;

    if (this._lastKnownMouse.distanceTo(this._handle) < (SeedSpiralMouseBehavior.handleRadius + SeedSpiralMouseBehavior.clickBlur | 0)) {
      handleColor = this._dragContext != null ? downColor : hoverColor;
    }

    else if (this._lastKnownMouse.distanceTo(this._center) < (SeedSpiralMouseBehavior.centerRadius + SeedSpiralMouseBehavior.clickBlur | 0)) {
      centerColor = this._dragContext != null ? downColor : hoverColor;
    }

    // Draw the center
    ctx.beginPath();
    ctx.arc(canvasCenter.x, canvasCenter.y, SeedSpiralMouseBehavior.centerRadius, 0, in_Math.PI() * 2);
    in_CanvasRenderingContext2D.setFillStyle(ctx, '#FFF');
    ctx.fill();
    ctx.lineWidth = 2;
    in_CanvasRenderingContext2D.setStrokeStyle(ctx, centerColor);
    ctx.stroke();
    var topLeft = canvasHandle.subtract1(SeedSpiralMouseBehavior.handleRadius);
    ctx.beginPath();
    ctx.rect(topLeft.x, topLeft.y, __imul(SeedSpiralMouseBehavior.handleRadius, 2), __imul(SeedSpiralMouseBehavior.handleRadius, 2));
    in_CanvasRenderingContext2D.setFillStyle(ctx, '#FFF');
    ctx.fill();
    ctx.lineWidth = 2;
    in_CanvasRenderingContext2D.setStrokeStyle(ctx, handleColor);
    ctx.stroke();
  };

  SeedSpiralMouseBehavior.prototype._onMove = function(e) {
    switch (this._dragContext.type) {
      case SeedSpiralMouseBehavior.DragType.CENTER: {
        // Move both handle and center
        var handleRelativeToCenter = this._handle.subtract(this._center);
        this._center = new Vector(e.offsetX, e.offsetY);
        this._handle = this._center.add(handleRelativeToCenter);
        break;
      }

      case SeedSpiralMouseBehavior.DragType.HANDLE: {
        // Move just the handle
        this._handle = new Vector(e.offsetX, e.offsetY);
        break;
      }
    }

    this._render();
  };

  SeedSpiralMouseBehavior.prototype.down = function(e) {
    this._lastKnownMouse = new Vector(e.offsetX, e.offsetY);
    var mouseDown = new Vector(e.offsetX, e.offsetY);

    if (this._handle.distanceTo(mouseDown) < this._center.distanceTo(mouseDown)) {
      this._dragContext = new SeedSpiralMouseBehavior.DragContext(SeedSpiralMouseBehavior.DragType.HANDLE);
    }

    else {
      this._dragContext = new SeedSpiralMouseBehavior.DragContext(SeedSpiralMouseBehavior.DragType.CENTER);
    }

    e.stopPropagation();
    this._onMove(e);
  };

  SeedSpiralMouseBehavior.prototype.move = function(e) {
    this._lastKnownMouse = new Vector(e.offsetX, e.offsetY);

    if (this._dragContext != null) {
      this._onMove(e);
    }

    else {
      // Just re-draw handle and center since their hover state
      // might have changed
      this._drawHandleAndCenter();
    }

    e.stopPropagation();
  };

  SeedSpiralMouseBehavior.prototype.up = function(e) {
    this._controller.drawAtPoint(in_HTMLMouseEvent.location(e));
    this._dragContext = null;
    this._lastKnownMouse = new Vector(e.offsetX, e.offsetY);
    this._drawHandleAndCenter();
    e.stopPropagation();
  };

  SeedSpiralMouseBehavior.prototype._drawIfOnCanvas = function(point) {
    var maxWidth = this._controller.inputCanvas.getBoundingClientRect().width;

    if (point.x > 0 && point.y > 0 && point.x < maxWidth && point.y < maxWidth) {
      this._controller.drawAtPoint(point);
    }
  };

  SeedSpiralMouseBehavior.DragType = {
    CENTER: 0,
    HANDLE: 1
  };

  SeedSpiralMouseBehavior.DragContext = function(type) {
    this.type = type;
  };

  function PhotoDemoController(inputCanvas_, outputCanvas_, onDraw_) {
    var self = this;
    self.inputCanvas = null;
    self.outputCanvas = null;
    self.inputContext = null;
    self._seedCanvas = null;
    self._seedCtx = null;
    self.sourceImg = null;
    self.sourcePattern = null;
    self._isMouseDown = false;
    self.onDraw = null;
    self._mouseBehaviors = [];
    self.inputCanvas = inputCanvas_;
    self.outputCanvas = outputCanvas_;
    self.onDraw = onDraw_;
    self.inputContext = in_HTMLCanvasElement.getContext2D(self.inputCanvas);
    self.inputContext.scale(Browser.devicePixelRatio(), Browser.devicePixelRatio());
    self._seedCanvas = document.createElement('canvas');
    self._seedCtx = in_HTMLCanvasElement.getContext2D(self._seedCanvas);
    self._seedCanvas.width = self.inputCanvas.width;
    self._seedCanvas.height = self.inputCanvas.height;
    self.sourceImg = document.getElementById('eye');
    var patternCanvas = document.createElement('canvas');
    patternCanvas.width = self._seedCanvas.width;
    patternCanvas.height = self._seedCanvas.height;
    in_HTMLCanvasElement.getContext2D(patternCanvas).drawImage(self.sourceImg, 0, 0, self.sourceImg.naturalWidth, self.sourceImg.naturalHeight, 0, 0, patternCanvas.width, patternCanvas.height);
    self.sourcePattern = self._seedCtx.createPattern(patternCanvas, 'repeat');

    for (var i = 0, list = [self.inputCanvas, self.outputCanvas], count = in_List.count(list); i < count; i = i + 1 | 0) {
      var canvas = in_List.get(list, i);
      in_HTMLElement.addEventListener4(canvas, 'mousedown', function(e) {
        for (var i = 0, list = self._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
          var behavior = in_List.get(list, i);
          behavior.down(e);
        }
      });
      in_HTMLElement.addEventListener4(canvas, 'mousemove', function(e) {
        for (var i = 0, list = self._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
          var behavior = in_List.get(list, i);
          behavior.move(e);
        }
      });
      in_HTMLElement.addEventListener4(canvas, 'mouseup', function(e) {
        for (var i = 0, list = self._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
          var behavior = in_List.get(list, i);
          behavior.up(e);
        }
      });
    }

    self._mouseBehaviors = [new SeedSpiralMouseBehavior(self)];
  }

  PhotoDemoController.prototype.seedCanvas = function() {
    return this._seedCanvas;
  };

  PhotoDemoController.prototype._drawAtPoint1 = function(ctx, point, fillStyle, size) {
    in_CanvasRenderingContext2D.setFillStyle(ctx, fillStyle);
    this._drawAtPoint3(ctx, point, size);
  };

  PhotoDemoController.prototype._drawAtPoint3 = function(ctx, point, size) {
    ctx.beginPath();
    ctx.rect(point.x | 0, point.y | 0, size, size);
    ctx.fill();
  };

  PhotoDemoController.prototype.clearSeedCanvas = function() {
    var rect = this.inputCanvas.getBoundingClientRect();
    this.inputContext.clearRect(0, 0, rect.width, rect.height);
    this._seedCtx.clearRect(0, 0, this._seedCanvas.width, this._seedCanvas.height);
  };

  PhotoDemoController.prototype.drawAtPoint = function(point) {
    this._drawAtPoint1(this.inputContext, point, 'rgba(255, 255, 255, 0.7)', 2);
    in_CanvasRenderingContext2D.setFillStyle1(this._seedCtx, this.sourcePattern);
    this._seedCtx.beginPath();
    this._seedCtx.rect(point.x * Browser.devicePixelRatio() | 0, point.y * Browser.devicePixelRatio() | 0, 1, 1);
    this._seedCtx.fill();
  };

  var Browser = {};

  // This is a function so that we can easily stub it out
  Browser.devicePixelRatio = function() {
    return 2;
    return window.devicePixelRatio;
  };

  // Returns the value of a query parameter in the URL of the current page.
  // For example, if we are at www.rykap.com?thing=blah then
  // getQueryVariable("thing") will return "blah".
  Browser.getQueryVariable = function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i = i + 1 | 0) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return pair[1];
      }
    }

    return null;
  };

  Browser.isElementInViewport = function(element) {
    var rect = element.getBoundingClientRect();
    return rect.bottom >= 0 && rect.right >= 0 && rect.top <= window.innerHeight && rect.left <= window.innerWidth;
  };

  Browser.renderWhileElementOnScreen = function(element, render) {
    var lastFrame = null;
    var renderFunc = function() {
      if (Browser.isElementInViewport(element)) {
        var now = new Date();
        var timeElapsedMs = lastFrame == null ? 1 / 30 : in_Date.toMilliseconds(now) - in_Date.toMilliseconds(lastFrame);
        render(timeElapsedMs);
        lastFrame = now;
      }

      requestAnimationFrame(renderFunc);
    };
    requestAnimationFrame(renderFunc);
  };

  function Color(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  Color.prototype.toCSS = function() {
    return 'rgba(' + (this.r * 255 | 0).toString() + ', ' + (this.g * 255 | 0).toString() + ', ' + (this.b * 255 | 0).toString() + ', ' + this.a.toString() + ')';
  };

  Color.fromHex = function(number) {
    return new Color((number >> 16 & 255) / 255 | 0, (number >> 8 & 255) / 255, (number & 255) / 255, 1);
  };

  function Square(center) {
    this.center = center;
    this.size = 2;
    this.color = new Color(0, 0, 1, 1);
  }

  Square.prototype.render = function(ctx) {
    ctx.beginPath();
    ctx.rect(this.center.x - (this.size / 2 | 0) | 0, this.center.y - (this.size / 2 | 0) | 0, this.size, this.size);
    in_CanvasRenderingContext2D.setFillStyle(ctx, this.color.toCSS());
    ctx.fill();
    ctx.closePath();
  };

  function Vector(x, y) {
    this.x = 0;
    this.y = 0;
    this.x = x;
    this.y = y;
  }

  Vector.prototype.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  };

  Vector.prototype.subtract = function(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  };

  Vector.prototype.subtract1 = function(d) {
    return new Vector(this.x - d, this.y - d);
  };

  Vector.prototype.multiply1 = function(d) {
    return new Vector(this.x * d, this.y * d);
  };

  Vector.prototype.divide1 = function(d) {
    return new Vector(this.x / d, this.y / d);
  };

  Vector.prototype.addUpdate = function(v) {
    this.x += v.x;
    this.y += v.y;
  };

  Vector.prototype.remainderUpdate = function(v) {
    this.x = fmod(this.x, v.x);
    this.y = fmod(this.y, v.y);
  };

  Vector.prototype.multiplyUpdate1 = function(d) {
    this.x *= d;
    this.y *= d;
  };

  // TODO(ryan): Rename this to something that makes it clear that
  // it doesn't edit `self`
  Vector.prototype.rotated = function(angleRad) {
    return new Vector(this.x * Math.cos(angleRad) - this.y * Math.sin(angleRad), this.y * Math.cos(angleRad) + this.x * Math.sin(angleRad));
  };

  // Returns as unit vector
  Vector.prototype.normalize = function() {
    return this.divide1(this.length());
  };

  // Returns the angle of this vector in radians
  Vector.prototype.toAngleRad = function() {
    return Math.atan2(this.y, this.x);
  };

  Vector.prototype.distanceTo = function(v) {
    return this.subtract(v).length();
  };

  Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector.prototype.clone = function() {
    return new Vector(this.x, this.y);
  };

  function Voronoi(canvas, options) {
    this._options = null;
    this._wham = null;
    this._canvasSize = 0;
    this._prepJumpFloodData = null;
    this._jumpFlood = null;
    this._drawJumpFloodData = null;
    this._drawDistanceField = null;
    this._renderTexture = null;
    this._quadBuffer = null;
    this._sourceTexture = null;
    this._destTexture = null;
    this._seedInputTexture = null;
    this._tempOutputTexture = null;
    this._framebuffer = null;
    this._simulationStepper = null;
    this._outputCanvas = null;

    if (canvas.width != canvas.height) {
      throw new Error('Voronoi canvas parameter must be square. Size is (' + canvas.width.toString() + ', ' + canvas.height.toString() + ')');
    }

    if (!isPowerOfTwo(canvas.width)) {
      throw new Error('Voronoi canvas size must be a power of two. Size is ' + canvas.width.toString());
    }

    this._options = options;
    this._canvasSize = canvas.width;
    this._outputCanvas = canvas;
    this._wham = new Wham(canvas);

    if (this._wham.ctx == null) {
      throw new Error('Failed to initialize Wham');
    }

    this._wham.ctx.disable(this._wham.ctx.DEPTH_TEST);
    var ctx = this._wham.ctx;
    getWebGLExtension(ctx, 'OES_texture_float');
    ctx.disable(ctx.DEPTH_TEST);
    this._jumpFlood = new Wham.Program(this._wham.ctx, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_JUMP_FLOOD);
    this._prepJumpFloodData = new Wham.Program(this._wham.ctx, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_PREP_FOR_JFA);
    this._renderTexture = new Wham.Program(this._wham.ctx, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_RENDER_TEXTURE);
    this._drawJumpFloodData = new Wham.Program(this._wham.ctx, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_DRAW_JUMP_FLOOD_DATA);
    this._drawDistanceField = new Wham.Program(this._wham.ctx, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_DRAW_DISTANCE_FIELD);
    this._quadBuffer = new Wham.Buffer(ctx);
    this._quadBuffer.update1(Wham.QUAD2, ctx.STATIC_DRAW);
    var opts = new Wham.TextureOptions(ctx, ctx.RGBA, ctx.REPEAT, ctx.NEAREST, ctx.FLOAT);
    this._sourceTexture = new Wham.Texture(ctx, opts);
    this._sourceTexture.clear(this._gridSize(), this._gridSize());
    this._destTexture = new Wham.Texture(ctx, opts);
    this._destTexture.clear(this._gridSize(), this._gridSize());
    opts = new Wham.TextureOptions(ctx, ctx.RGBA, ctx.REPEAT, ctx.LINEAR, ctx.UNSIGNED_BYTE);
    this._tempOutputTexture = new Wham.Texture(ctx, opts);
    this._tempOutputTexture.clear(this._gridSize(), this._gridSize());
    opts = new Wham.TextureOptions(ctx, ctx.RGBA, ctx.REPEAT, ctx.NEAREST, ctx.UNSIGNED_BYTE);
    this._seedInputTexture = new Wham.Texture(ctx, opts);
    this._seedInputTexture.clear(this._canvasSize, this._canvasSize);
    this._framebuffer = Wham.Framebuffer.create(ctx);
  }

  Voronoi.prototype._gridSize = function() {
    return __imul(this._canvasSize, this._options.antialiasingFactor);
  };

  Voronoi.prototype._checkFramebufferCompletion = function() {
    if (!RELEASE) {
      var ctx = this._wham.ctx;
      var check = ctx.checkFramebufferStatus(ctx.FRAMEBUFFER);

      if (check != ctx.FRAMEBUFFER_COMPLETE) {
        throw new Error('Framebuffer completion issue');
      }
    }
  };

  Voronoi.prototype.setSeedsFromCanvas = function(inputCanvas) {
    this._framebuffer.attach(this._sourceTexture);
    this._checkFramebufferCompletion();

    // Create a texture for the canvas. Bind it to texture position 0.
    this._seedInputTexture.set1(inputCanvas);
    this._seedInputTexture.bind2(0);
    this._wham.ctx.viewport(0, 0, this._gridSize(), this._gridSize());
    this._prepJumpFloodData.use().attrib1('quad', this._quadBuffer, 2).uniform1('iSeedInputTexture', 0).uniform4('iGridSize', new Float32Array([this._gridSize(), this._gridSize()])).uniform4('iBackgroundColor', new Float32Array([0, 0, 0, 0])).draw(this._wham.ctx.TRIANGLE_STRIP, 4);
  };

  Voronoi.prototype.drawToOutputCanvas = function() {
    // First draw _destTexture into _tempOutputTexture
    this._framebuffer.attach(this._tempOutputTexture);
    this._checkFramebufferCompletion();
    this._destTexture.bind2(0);
    this._wham.ctx.viewport(0, 0, this._gridSize(), this._gridSize());
    this._drawJumpFloodData.use().attrib1('quad', this._quadBuffer, 2).uniform1('iCellGridTexture', 0).uniform4('iCanvasSize', new Float32Array([this._gridSize(), this._gridSize()])).uniform4('iGridSize', new Float32Array([this._gridSize(), this._gridSize()])).uniform1('iRelease', RELEASE ? 1 : 0).uniform1('iAntialiasingFactor', this._options.antialiasingFactor).uniform2('iMinSeedDistanceThreshold', this._options.minSeedDistanceThreshold * Browser.devicePixelRatio()).draw(this._wham.ctx.TRIANGLE_STRIP, 4);
    this._drawTempTexture();
  };

  Voronoi.prototype.drawDistanceFieldToOutputCanvas = function() {
    // First draw _destTexture into _tempOutputTexture
    this._framebuffer.attach(this._tempOutputTexture);
    this._checkFramebufferCompletion();
    this._destTexture.bind2(0);
    this._wham.ctx.viewport(0, 0, this._gridSize(), this._gridSize());
    this._drawDistanceField.use().attrib1('quad', this._quadBuffer, 2).uniform1('iCellGridTexture', 0).uniform4('iCanvasSize', new Float32Array([this._gridSize(), this._gridSize()])).uniform4('iGridSize', new Float32Array([this._gridSize(), this._gridSize()])).uniform1('iRelease', RELEASE ? 1 : 0).uniform1('iAntialiasingFactor', this._options.antialiasingFactor).draw(this._wham.ctx.TRIANGLE_STRIP, 4);
    this._drawTempTexture();
  };

  // We draw into _tempTexture at a higher resolution than we want on screen
  // and then scale down _tempTexture to antialias
  Voronoi.prototype._drawTempTexture = function() {
    this._wham.defaultFramebuffer.bind();
    this._checkFramebufferCompletion();
    this._tempOutputTexture.bind2(0);
    this._wham.ctx.viewport(0, 0, this._outputCanvas.width, this._outputCanvas.height);
    this._renderTexture.use().attrib1('quad', this._quadBuffer, 2).uniform1('iTexture', 0).uniform4('iResolution', new Float32Array([this._outputCanvas.width, this._outputCanvas.height])).draw(this._wham.ctx.TRIANGLE_STRIP, 4);
  };

  // Useful if you want to compute Voronoi in one step.
  Voronoi.prototype.computeVoronoi = function() {
    var stepSize = this._gridSize() / 2 | 0;

    while (stepSize >= 1) {
      this._runJumpFloodStep(stepSize);
      stepSize = stepSize / 2 | 0;
    }

    this._runJumpFloodStep(2);
    this._runJumpFloodStep(1);
  };

  Voronoi.prototype._runJumpFloodStep = function(stepSize) {
    // The current simulation state is always in _sourceTexture
    // and we draw onto _destTexture. So...
    //
    // 1. Bind the _destTexture onto the framebuffer so that
    //    we'll draw onto it.
    //
    // 2. Bind _sourceTexture texture to index 0. This is
    //    passed to the shader by setting the
    //    cellGridTexture uniform below.
    //
    this._framebuffer.attach(this._destTexture);

    if (!RELEASE) {
      var gl = this._wham.ctx;
      var check = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

      if (check != gl.FRAMEBUFFER_COMPLETE) {
        throw new Error('Framebuffer completion issue');
      }
    }

    this._sourceTexture.bind2(0);
    this._wham.ctx.viewport(0, 0, this._gridSize(), this._gridSize());
    this._jumpFlood.use().attrib1('quad', this._quadBuffer, 2).uniform1('iCellGridTexture', 0).uniform1('iStepSize', stepSize).uniform4('iCellGridSize', new Float32Array([this._gridSize(), this._gridSize()])).uniform1('iUseTorusDistanceForSeeds', this._options.wrap ? 1 : 0).draw(this._wham.ctx.TRIANGLE_STRIP, 4);
    this._swapBuffers();
  };

  Voronoi.prototype._swapBuffers = function() {
    // Swap the source and destination textures
    var tmp = this._sourceTexture;
    this._sourceTexture = this._destTexture;
    this._destTexture = tmp;
  };

  Voronoi.Options = function() {
    this.wrap = false;
    this.antialiasingFactor = 1;
    this.minSeedDistanceThreshold = -1;
  };

  function Wham(canvas) {
    this.ctx = null;
    this.defaultFramebuffer = null;
    this.ctx = in_HTMLCanvasElement.getContextWebGL1(canvas);
    this.defaultFramebuffer = Wham.Framebuffer.getDefault(this.ctx);
  }

  Wham.Program = function(ctx, vertexShaderSource, fragmentShaderSource) {
    this._ctx = null;
    this._program = null;
    this._uniformLocationByName = in_StringMap.$new();
    this._attribLocationByName = in_StringMap.$new();
    this._ctx = ctx;
    this._program = this._ctx.createProgram();
    this._ctx.attachShader(this._program, this._makeShader(this._ctx.VERTEX_SHADER, vertexShaderSource));
    this._ctx.attachShader(this._program, this._makeShader(this._ctx.FRAGMENT_SHADER, fragmentShaderSource));
    this._ctx.linkProgram(this._program);

    if (!this._ctx.getProgramParameter(this._program, this._ctx.LINK_STATUS)) {
      throw new Error(this._ctx.getProgramInfoLog(this._program));
    }
  };

  Wham.Program.prototype._makeShader = function(shaderType, source) {
    var shader = this._ctx.createShader(shaderType);
    this._ctx.shaderSource(shader, source);
    this._ctx.compileShader(shader);

    if (!this._ctx.getShaderParameter(shader, this._ctx.COMPILE_STATUS)) {
      console.error(this._ctx.getShaderInfoLog(shader));

      throw new Error('Failed to create shader');
    }

    return shader;
  };

  Wham.Program.prototype.use = function() {
    this._ctx.useProgram(this._program);
    return this;
  };

  Wham.Program.prototype.uniform1 = function(name, value) {
    var location = this._uniformLocation(name);
    this._ctx.uniform1i(location, value);
    return this;
  };

  Wham.Program.prototype.uniform2 = function(name, value) {
    var location = this._uniformLocation(name);
    this._ctx.uniform1f(location, value);
    return this;
  };

  Wham.Program.prototype.uniform4 = function(name, value) {
    var location = this._uniformLocation(name);

    if (value.length == 2) {
      this._ctx.uniform2fv(location, value);
    }

    else if (value.length == 3) {
      this._ctx.uniform3fv(location, value);
    }

    else if (value.length == 4) {
      this._ctx.uniform4fv(location, value);
    }

    else {
      throw new Error('Invalid size of value: ' + value.length.toString());
    }

    return this;
  };

  Wham.Program.prototype.attrib1 = function(name, value, size) {
    return this.attrib2(name, value, size, 0);
  };

  Wham.Program.prototype.attrib2 = function(name, value, size, stride) {
    var location = this._attribLocation(name);
    value.bind();
    this._ctx.enableVertexAttribArray(location);
    this._ctx.vertexAttribPointer(location, size, this._ctx.FLOAT, false, stride, 0);
    return this;
  };

  Wham.Program.prototype.draw = function(mode, count) {
    this._ctx.drawArrays(mode, 0, count);

    if (!RELEASE) {
      if (this._ctx.getError() != this._ctx.NO_ERROR) {
        throw new Error('WebGL Rendering error');
      }
    }
  };

  Wham.Program.prototype._attribLocation = function(name) {
    if (!(name in this._attribLocationByName)) {
      this._attribLocationByName[name] = this._ctx.getAttribLocation(this._program, name);
    }

    return in_StringMap.get1(this._attribLocationByName, name);
  };

  Wham.Program.prototype._uniformLocation = function(name) {
    if (!(name in this._uniformLocationByName)) {
      this._uniformLocationByName[name] = this._ctx.getUniformLocation(this._program, name);
    }

    return in_StringMap.get1(this._uniformLocationByName, name);
  };

  Wham.Buffer = function(ctx) {
    this._ctx = null;
    this._buffer = null;
    this._target = 0;
    this._size = -1;
    this._ctx = ctx;
    this._buffer = this._ctx.createBuffer();
    this._target = this._ctx.ARRAY_BUFFER;
  };

  Wham.Buffer.prototype.bind = function() {
    this._ctx.bindBuffer(this._target, this._buffer);
  };

  Wham.Buffer.prototype.update1 = function(data, usage) {
    this.bind();

    if (this._size != data.byteLength) {
      this._ctx.bufferData(this._target, data, usage);
      this._size = data.byteLength;
    }

    else {
      this._ctx.bufferSubData(this._target, 0, data);
    }
  };

  Wham.Framebuffer = function(ctx, framebuffer) {
    this._ctx = null;
    this._framebuffer = null;
    this._ctx = ctx;
    this._framebuffer = framebuffer;
  };

  Wham.Framebuffer.getDefault = function(ctx) {
    return new Wham.Framebuffer(ctx, null);
  };

  Wham.Framebuffer.create = function(ctx) {
    return new Wham.Framebuffer(ctx, ctx.createFramebuffer());
  };

  Wham.Framebuffer.prototype.bind = function() {
    this._ctx.bindFramebuffer(this._ctx.FRAMEBUFFER, this._framebuffer);
  };

  Wham.Framebuffer.prototype.attach = function(texture) {
    this.bind();
    this._ctx.framebufferTexture2D(this._ctx.FRAMEBUFFER, this._ctx.COLOR_ATTACHMENT0, this._ctx.TEXTURE_2D, texture.texture(), 0);
  };

  Wham.TextureOptions = function(ctx, format_, wrap_, filter_, dataType_) {
    this._ctx = null;
    this.format = 0;
    this.wrap = 0;
    this.filter = 0;
    this.dataType = 0;
    this._ctx = ctx;
    this.format = format_;
    this.wrap = wrap_;
    this.filter = filter_;
    this.dataType = dataType_;
  };

  Wham.TextureOptions.prototype.clone = function() {
    return new Wham.TextureOptions(this._ctx, this.format, this.wrap, this.filter, this.dataType);
  };

  Wham.Texture = function(ctx, options) {
    this._ctx = null;
    this._options = null;
    this._texture = null;
    this._ctx = ctx;
    this._options = options.clone();
    this._texture = this._ctx.createTexture();
    this._ctx.bindTexture(this._ctx.TEXTURE_2D, this._texture);
    this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_WRAP_S, this._options.wrap);
    this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_WRAP_T, this._options.wrap);
    this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_MIN_FILTER, this._options.filter);
    this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_MAG_FILTER, this._options.filter);
  };

  Wham.Texture.prototype.texture = function() {
    return this._texture;
  };

  Wham.Texture.prototype.bind1 = function() {
    this._ctx.bindTexture(this._ctx.TEXTURE_2D, this._texture);
  };

  Wham.Texture.prototype.bind2 = function(unit) {
    this._ctx.activeTexture(this._ctx.TEXTURE0 + unit);
    this.bind1();
  };

  Wham.Texture.prototype.clear = function(width, height) {
    this.bind1();
    this._ctx.texImage2D(this._ctx.TEXTURE_2D, 0, this._options.format, width, height, 0, this._options.format, this._options.dataType, null);
  };

  Wham.Texture.prototype.set1 = function(canvas) {
    this.bind1();
    this._ctx.texImage2D(this._ctx.TEXTURE_2D, 0, this._options.format, this._options.format, this._options.dataType, canvas);
  };

  var HTML = {};

  HTML.on = function(target, type, listener) {
    target.addEventListener(type, listener);
  };

  var in_Math = {};

  in_Math.PI = function() {
    return 3.141592653589793;
  };

  var in_List = {};

  in_List.get = function(self, index) {
    assert(0 <= index && index < in_List.count(self));
    return self[index];
  };

  in_List.count = function(self) {
    return self.length;
  };

  var in_StringMap = {};

  in_StringMap.$new = function() {
    return __create(null);
  };

  in_StringMap.get1 = function(self, key) {
    assert(key in self);
    return self[key];
  };

  var in_Date = {};

  in_Date.toMilliseconds = function(self) {
    return +self;
  };

  var in_HTMLMouseEvent = {};

  in_HTMLMouseEvent.location = function(self) {
    return new Vector(self.offsetX, self.offsetY);
  };

  var in_HTMLCanvasElement = {};

  in_HTMLCanvasElement.getContext2D = function(self) {
    try {
      return self.getContext('2d');
    }

    catch (e) {
    }

    return null;
  };

  in_HTMLCanvasElement.getContextWebGL1 = function(self) {
    try {
      return self.getContext('webgl');
    }

    catch (e) {
    }

    try {
      return self.getContext('experimental-webgl');
    }

    catch (e1) {
    }

    return null;
  };

  var in_CanvasRenderingContext2D = {};

  in_CanvasRenderingContext2D.setStrokeStyle = function(self, value) {
    self.strokeStyle = value;
  };

  in_CanvasRenderingContext2D.setFillStyle = function(self, value) {
    self.fillStyle = value;
  };

  in_CanvasRenderingContext2D.setFillStyle1 = function(self, value) {
    self.fillStyle = value;
  };

  var in_HTMLDocument = {};

  in_HTMLDocument.addEventListener4 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  var in_HTMLElement = {};

  in_HTMLElement.addEventListener4 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  var RELEASE = false;
  var waterColors = [Color.fromHex(7051762), Color.fromHex(4814543), Color.fromHex(8428277), Color.fromHex(8305894), Color.fromHex(9011445), Color.fromHex(970239), Color.fromHex(5611513)];
  var GLSLX_SOURCE_V_COPY_POSITION = 'precision highp float;\n\nconst vec4 n = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), l = vec4(0.0, 0.0, 1.0, 1.0), r = vec4(0.0, 1.0, 1.0, 1.0), q = vec4(1.0, 0.0, 1.0, 1.0), p = vec4(1.0, 1.0, 0.0, 1.0), g = vec4(0.0, 0.0, 0.0, 1.0), o = vec4(1.0, 1.0, 1.0, 1.0);\nattribute vec2 quad;\n\nvoid main() {\n  gl_Position = vec4(quad, 0, 1.0);\n}\n';
  var GLSLX_SOURCE_F_PREP_FOR_JFA = 'precision highp float;\n\nuniform sampler2D iSeedInputTexture;\nuniform vec2 iGridSize;\nuniform vec4 iBackgroundColor;\nconst vec4 n = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), l = vec4(0.0, 0.0, 1.0, 1.0), r = vec4(0.0, 1.0, 1.0, 1.0), q = vec4(1.0, 0.0, 1.0, 1.0), p = vec4(1.0, 1.0, 0.0, 1.0), g = vec4(0.0, 0.0, 0.0, 1.0), o = vec4(1.0, 1.0, 1.0, 1.0);\n\nint y(int a, int b) {\n  return a * 256 + b;\n}\n\nbool f(float a, float b) {\n  return abs(a - b) < 1e-4;\n}\n\nbool D(vec4 a, vec4 b) {\n  return f(a.x, b.x) && f(a.y, b.y) && f(a.z, b.z) && f(a.w, b.w);\n}\n\nvec4 E(float a, float b, vec2 c) {\n  return vec4(a, b, c);\n}\n\nvec4 w() {\n  return vec4(-1.0, -1.0, -1.0, -1.0);\n}\n\nvoid main() {\n  vec2 b = gl_FragCoord.xy / iGridSize, c = vec2(b.x, 1.0 - b.y);\n  vec4 a = texture2D(iSeedInputTexture, c);\n  if (D(a, iBackgroundColor))\n    gl_FragColor = w();\n  else {\n    int d = y(int(a.r * 255.0), int(a.g * 255.0)), e = y(int(a.b * 255.0), int(a.a * 255.0));\n    gl_FragColor = E(float(d), float(e), gl_FragCoord.xy);\n  }\n}\n';
  var GLSLX_SOURCE_F_JUMP_FLOOD = 'precision highp float;\n\nuniform sampler2D iCellGridTexture;\nuniform vec2 iCellGridSize;\nuniform int iStepSize;\nuniform bool iUseTorusDistanceForSeeds;\nconst vec4 n = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), l = vec4(0.0, 0.0, 1.0, 1.0), r = vec4(0.0, 1.0, 1.0, 1.0), q = vec4(1.0, 0.0, 1.0, 1.0), p = vec4(1.0, 1.0, 0.0, 1.0), g = vec4(0.0, 0.0, 0.0, 1.0), o = vec4(1.0, 1.0, 1.0, 1.0);\n\nbool f(float a, float b) {\n  return abs(a - b) < 1e-4;\n}\n\nbool s(vec2 a) {\n  return a.x >= 0.0 && a.y >= 0.0 && a.x <= 1.0 && a.y <= 1.0;\n}\n\nvec4 w() {\n  return vec4(-1.0, -1.0, -1.0, -1.0);\n}\n\nvec2 j(const vec4 a) {\n  return vec2(a.z, a.w);\n}\n\nbool i(const vec4 a) {\n  return!f(a.y, -1.0);\n}\n\nfloat t(vec2 a, vec2 b, vec2 c) {\n  float d = min(abs(a.x - b.x), c.x - abs(a.x - b.x)), e = min(abs(a.y - b.y), c.y - abs(a.y - b.y));\n  return sqrt(d * d + e * e);\n}\n\nvec4 h(const vec4 b, const vec2 z) {\n  vec2 c = (gl_FragCoord.xy + z) / iCellGridSize;\n  vec4 a = texture2D(iCellGridTexture, c);\n  a = !s(c) && !iUseTorusDistanceForSeeds ? w() : a;\n  if (!i(a))\n    return b;\n  else if (!i(b))\n    return a;\n  else {\n    vec2 d = j(b), e = j(a);\n    float A = iUseTorusDistanceForSeeds ? t(d, gl_FragCoord.xy, iCellGridSize) : distance(d, gl_FragCoord.xy), B = iUseTorusDistanceForSeeds ? t(e, gl_FragCoord.xy, iCellGridSize) : distance(e, gl_FragCoord.xy);\n    if (A > B)\n      return a;\n  }\n  return b;\n}\n\nvoid main() {\n  vec2 b = gl_FragCoord.xy / iCellGridSize;\n  vec4 a = texture2D(iCellGridTexture, b);\n  a = h(a, vec2(0, iStepSize)), a = h(a, vec2(iStepSize, iStepSize)), a = h(a, vec2(iStepSize, 0)), a = h(a, vec2(iStepSize, -iStepSize)), a = h(a, vec2(0, -iStepSize)), a = h(a, vec2(-iStepSize, -iStepSize)), a = h(a, vec2(-iStepSize, 0)), a = h(a, vec2(-iStepSize, iStepSize)), gl_FragColor = a;\n}\n';
  var GLSLX_SOURCE_F_DRAW_JUMP_FLOOD_DATA = 'precision highp float;\n\nuniform sampler2D iCellGridTexture;\nuniform vec2 iGridSize, iCanvasSize;\nuniform int iRelease;\nuniform float iMinSeedDistanceThreshold;\nconst vec4 n = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), l = vec4(0.0, 0.0, 1.0, 1.0), r = vec4(0.0, 1.0, 1.0, 1.0), q = vec4(1.0, 0.0, 1.0, 1.0), p = vec4(1.0, 1.0, 0.0, 1.0), g = vec4(0.0, 0.0, 0.0, 1.0), o = vec4(1.0, 1.0, 1.0, 1.0);\n\nint C(int a, int b) {\n  return int(mod(float(a), float(b)));\n}\n\nvec2 x(int a) {\n  return vec2(a / 256, C(a, 256));\n}\n\nbool f(float a, float b) {\n  return abs(a - b) < 1e-4;\n}\n\nbool k(vec2 a, vec2 b, vec2 c) {\n  return a.x > b.x && a.x < c.x && a.y > b.y && a.y < c.y;\n}\n\nvec2 u(vec2 a) {\n  return iGridSize * gl_FragCoord.xy / iCanvasSize;\n}\n\nbool s(vec2 a) {\n  return a.x >= 0.0 && a.y >= 0.0 && a.x <= 1.0 && a.y <= 1.0;\n}\n\nvec4 F(const vec4 a) {\n  int b = int(a.x), c = int(a.y);\n  return vec4(x(b), x(c)) / 255.0;\n}\n\nvec2 j(const vec4 a) {\n  return vec2(a.z, a.w);\n}\n\nbool i(const vec4 a) {\n  return!f(a.y, -1.0);\n}\n\nvoid v(vec2 a) {\n  if (iRelease == 1)\n    return;\n  vec4 b = vec4(1.0, 0.5, 0.5, 1.0), c = vec4(0.5, 0.5, 1.0, 1.0), d = vec4(0.5, 1.0, 0.5, 1.0);\n  if (mod(a.x, 100.0) < 3.0 || mod(a.y, 100.0) < 3.0)\n    gl_FragColor = (b + gl_FragColor) / 2.0;\n  if (k(a.xy, vec2(0.0, 0.0), vec2(10.0, 10.0)))\n    gl_FragColor = (d + gl_FragColor) / 2.0;\n  if (k(a.xy, vec2(100.0, 100.0), vec2(110.0, 110.0)))\n    gl_FragColor = (c + gl_FragColor) / 2.0;\n}\n\nvoid main() {\n  vec2 a = u(gl_FragCoord.xy), c = a / iGridSize;\n  if (!s(c)) {\n    gl_FragColor = g, v(a);\n    return;\n  }\n  vec4 b = texture2D(iCellGridTexture, c);\n  if (!i(b))\n    discard;\n  else\n    gl_FragColor = iMinSeedDistanceThreshold > 0.0 && distance(j(b), a) > iMinSeedDistanceThreshold ? g : F(b);\n}\n';
  var GLSLX_SOURCE_F_DRAW_DISTANCE_FIELD = 'precision highp float;\n\nuniform sampler2D iCellGridTexture;\nuniform vec2 iGridSize, iCanvasSize;\nuniform int iRelease;\nconst vec4 n = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), l = vec4(0.0, 0.0, 1.0, 1.0), r = vec4(0.0, 1.0, 1.0, 1.0), q = vec4(1.0, 0.0, 1.0, 1.0), p = vec4(1.0, 1.0, 0.0, 1.0), g = vec4(0.0, 0.0, 0.0, 1.0), o = vec4(1.0, 1.0, 1.0, 1.0);\n\nbool f(float a, float b) {\n  return abs(a - b) < 1e-4;\n}\n\nbool k(vec2 a, vec2 b, vec2 c) {\n  return a.x > b.x && a.x < c.x && a.y > b.y && a.y < c.y;\n}\n\nvec2 u(vec2 a) {\n  return iGridSize * gl_FragCoord.xy / iCanvasSize;\n}\n\nbool s(vec2 a) {\n  return a.x >= 0.0 && a.y >= 0.0 && a.x <= 1.0 && a.y <= 1.0;\n}\n\nvec2 j(const vec4 a) {\n  return vec2(a.z, a.w);\n}\n\nbool i(const vec4 a) {\n  return!f(a.y, -1.0);\n}\n\nfloat t(vec2 a, vec2 b, vec2 c) {\n  float d = min(abs(a.x - b.x), c.x - abs(a.x - b.x)), e = min(abs(a.y - b.y), c.y - abs(a.y - b.y));\n  return sqrt(d * d + e * e);\n}\n\nvoid v(vec2 a) {\n  if (iRelease == 1)\n    return;\n  vec4 b = vec4(1.0, 0.5, 0.5, 1.0), c = vec4(0.5, 0.5, 1.0, 1.0), d = vec4(0.5, 1.0, 0.5, 1.0);\n  if (mod(a.x, 100.0) < 3.0 || mod(a.y, 100.0) < 3.0)\n    gl_FragColor = (b + gl_FragColor) / 2.0;\n  if (k(a.xy, vec2(0.0, 0.0), vec2(10.0, 10.0)))\n    gl_FragColor = (d + gl_FragColor) / 2.0;\n  if (k(a.xy, vec2(100.0, 100.0), vec2(110.0, 110.0)))\n    gl_FragColor = (c + gl_FragColor) / 2.0;\n}\n\nvoid main() {\n  vec2 b = u(gl_FragCoord.xy), c = b / iGridSize;\n  if (!s(c)) {\n    gl_FragColor = g, v(b);\n    return;\n  }\n  vec4 d = texture2D(iCellGridTexture, c);\n  if (!i(d))\n    discard;\n  else {\n    vec2 e = j(d);\n    float a = t(e, b, iGridSize);\n    a = 1.0 - a / (iGridSize.x * 0.5), gl_FragColor = vec4(a, a, a, 1.0);\n  }\n}\n';
  var GLSLX_SOURCE_F_RENDER_TEXTURE = 'precision highp float;\n\nuniform sampler2D iInputTexture;\nuniform vec2 iResolution;\nconst vec4 n = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), l = vec4(0.0, 0.0, 1.0, 1.0), r = vec4(0.0, 1.0, 1.0, 1.0), q = vec4(1.0, 0.0, 1.0, 1.0), p = vec4(1.0, 1.0, 0.0, 1.0), g = vec4(0.0, 0.0, 0.0, 1.0), o = vec4(1.0, 1.0, 1.0, 1.0);\n\nvoid main() {\n  vec2 a = gl_FragCoord.xy / iResolution;\n  gl_FragColor = texture2D(iInputTexture, a);\n}\n';
  CanvasDrawController.dotRadius = 1;
  SeedSpiralMouseBehavior.centerRadius = 6;
  SeedSpiralMouseBehavior.handleRadius = 4;
  SeedSpiralMouseBehavior.clickBlur = 6;
  SeedSpiralMouseBehavior.initialCenterHandleDistance = 50;
  Wham.QUAD2 = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

  main();
})();
