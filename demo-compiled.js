(function() {
  var __imul = Math.imul ? Math.imul : function(a, b) {
    return (a * (b >>> 16) << 16) + a * (b & 65535) | 0;
  };

  function assert(truth) {
    if (!truth) {
      throw Error('Assertion failed');
    }
  }

  function getCanvas(container, className) {
    var canvas = container.getElementsByClassName(className)[0];
    canvas.width = DemoController.gridSize;
    canvas.height = DemoController.gridSize;
    return canvas;
  }

  function createJumpFlood(outputCanvas, size) {
    var jumpFlood = null;

    try {
      jumpFlood = new JumpFlood(outputCanvas, size);
    }

    catch (temp) {
      // Failed to initialize Web-GL. Display error.
      document.getElementById('demo-page').style.display = 'none';
      document.getElementById('webgl-error').style.display = null;

      throw temp;
    }

    return jumpFlood;
  }

  function initializePaintDemo(container) {
    var inputCanvas = getCanvas(container, 'input-canvas');
    var outputCanvas = getCanvas(container, 'output-canvas');
    var jfa = createJumpFlood(outputCanvas, DemoController.gridSize);

    // A CanvasDrawController handles user draw-actions on the input canvas
    // Whenever the user draws, we re-render the voronoi diagram for the input
    var drawController = new CanvasDrawController(inputCanvas);
    drawController.onDraw = function() {
      jfa.setSeedsFromCanvas(inputCanvas);
      jfa.computeVoronoi();
      jfa.drawToOutputCanvas();
    };
  }

  function initializeFishDemo(container) {
    var inputCanvas = getCanvas(container, 'input-canvas');
    var outputCanvas = getCanvas(container, 'output-canvas');
    var jfa = createJumpFlood(outputCanvas, DemoController.gridSize);
    var fishController = new FishGameController(inputCanvas);
    fishController.onDraw = function() {
      jfa.setSeedsFromCanvas(inputCanvas);
      jfa.computeVoronoi();
      jfa.drawToOutputCanvas();
    };
  }

  function initializePhotoDemo(container) {
    var inputCanvas = getCanvas(container, 'input-canvas');
    var outputCanvas = getCanvas(container, 'output-canvas');
    var jfa = createJumpFlood(outputCanvas, DemoController.gridSize);
    var photoController = new PhotoDemoController(inputCanvas);
    photoController.onDraw = function() {
      jfa.setSeedsFromCanvas(photoController.seedCanvas());
      jfa.computeVoronoi();
      jfa.drawToOutputCanvas();
    };
  }

  function main() {
    window.onload = function() {
      initializePaintDemo(document.getElementById('paint-demo-container'));
      initializeFishDemo(document.getElementById('fish-demo-container'));
      initializePhotoDemo(document.getElementById('photo-demo-container'));
    };
  }

  function getWebGLExtension(gl, name) {
    var ext = gl.getExtension(name);

    if (ext === null) {
      throw new Error('Unsupported WebGL extension with name ' + name);
    }

    return ext;
  }

  function fmod(a, b) {
    return a - b * Math.floor(a / b);
  }

  // TODO(ryan): A bunch of stuff depends on this constant. Name
  // it something more sensible and have less stuff depend on it
  // directly.
  var DemoController = {};

  function CanvasDrawController(canvas) {
    var self = this;
    self._canvas = null;
    self._ctx = null;
    self._color = null;
    self.colorIndex = 0;
    self.radius = 1;
    self.onDraw = null;
    self._canvas = canvas;
    self._styleCanvas(canvas);
    self._ctx = in_HTMLCanvasElement.getContext2D(self._canvas);
    in_HTMLDocument.addEventListener3(document, 'keyup', function(e) {
      var KEY_C = 67;

      if (e.which == KEY_C) {
        self.colorIndex = (self.colorIndex + 1 | 0) % in_List.count(paintColors) | 0;
      }
    });
    var changeColorAndDraw = function(point) {
      if (point.x > 0 && point.y > 0 && point.x < self._canvas.width && point.y < self._canvas.height) {
        self._color = new Color(0.5 + Math.random() * 0.4, 0.2, 0.3 + Math.random() * 0.5, 1);
        self._draw(point);
      }
    };
    var isMouseDown = false;
    in_HTMLDocument.addEventListener4(document, 'mousedown', function(e) {
      isMouseDown = true;
      changeColorAndDraw(new Vector(e.offsetX, e.offsetY));
    });
    in_HTMLElement.addEventListener4(self._canvas, 'mousemove', function(e) {
      if (isMouseDown) {
        changeColorAndDraw(new Vector(e.offsetX, e.offsetY));
      }
    });
    in_HTMLDocument.addEventListener4(document, 'mouseup', function(e) {
      isMouseDown = false;
    });
    in_HTMLDocument.addEventListener4(document, 'mouseleave', function(e) {
      isMouseDown = false;
    });
  }

  CanvasDrawController.prototype._draw = function(point) {
    this._ctx.beginPath();
    this._ctx.rect(point.x - this.radius | 0, point.y - this.radius | 0, __imul(this.radius, 2), __imul(this.radius, 2));
    in_CanvasRenderingContext2D.setFillStyle(this._ctx, this._color.toCSS());
    this._ctx.fill();

    if (this.onDraw != null) {
      this.onDraw();
    }
  };

  CanvasDrawController.prototype._styleCanvas = function(canvas) {
    canvas.style.backgroundColor = 'white';
    canvas.width = DemoController.gridSize;
    canvas.height = DemoController.gridSize;
  };

  function Square(center) {
    this.center = center;
    this.size = 2;
    this.color = new Color(0, 0, 1, 1);
  }

  Square.prototype.render = function(ctx) {
    ctx.beginPath();
    ctx.rect(this.center.x - this.size / 2 | 0, this.center.y - this.size / 2 | 0, this.size | 0, this.size | 0);
    in_CanvasRenderingContext2D.setFillStyle(ctx, this.color.toCSS());
    ctx.fill();
    ctx.closePath();
  };

  function FishGameController(canvas) {
    var self = this;
    self._canvas = null;
    self._ctx = null;
    self.onDraw = null;
    self._numPads = 40;
    self._pads = [];
    self._speeds = [];
    self._fish = null;
    self._canvas = canvas;
    self._ctx = in_HTMLCanvasElement.getContext2D(self._canvas);

    for (var i = 1, count = self._numPads; i < count; i = i + 1 | 0) {
      self._pads.push(new Square(new Vector(Math.random() * self._canvas.width, Math.random() * self._canvas.height)));
      in_List.get(self._pads, in_List.count(self._pads) - 1 | 0).color = in_List.get(waterColors, i % in_List.count(waterColors) | 0);
      self._speeds.push(10 + Math.random() * 4);
    }

    self._fish = new Square(new Vector(Math.random() * self._canvas.width, Math.random() * self._canvas.height));
    self._fish.color = Color.fromHex(16771345);
    in_HTMLElement.addEventListener4(canvas, 'mousemove', function(e) {
      self._fish.center.x = e.offsetX;
      self._fish.center.y = e.offsetY;
    });
    self._startRenderLoop();
  }

  FishGameController.prototype._startRenderLoop = function() {
    var self = this;
    var lastFrame = null;
    var tick = function() {
      var now = new Date();
      var timeElapsed = lastFrame == null ? 1 / 30 : in_Date.toMilliseconds(now) - in_Date.toMilliseconds(lastFrame);
      self._render(timeElapsed / 1000);
      lastFrame = now;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  FishGameController.prototype._render = function(timeElapsed) {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    for (var i = 1, count = in_List.count(this._pads); i < count; i = i + 1 | 0) {
      var pad = in_List.get(this._pads, i);
      pad.center.addUpdate1(in_List.get(this._speeds, i) * timeElapsed);
      pad.center.remainderUpdate(new Vector(this._canvas.width, this._canvas.height));
    }

    for (var i1 = 0, list = this._pads, count1 = in_List.count(list); i1 < count1; i1 = i1 + 1 | 0) {
      var pad1 = in_List.get(list, i1);
      pad1.render(this._ctx);
    }

    this._fish.render(this._ctx);

    if (this.onDraw != null) {
      this.onDraw();
    }
  };

  function SeedSpiralMouseBehavior(controller) {
    var self = this;
    self._controller = null;
    self._isMouseDown = false;
    self._relativeSeedLocations = [];
    self._angle = 0;
    self._center = new Vector(0, 0);
    self._controller = controller;
    self._center = new Vector(controller.seedCanvas().width / 2 | 0, controller.seedCanvas().height / 2 | 0);

    for (var radiusIndex = 0; radiusIndex < 20; radiusIndex = radiusIndex + 1 | 0) {
      // Need more and more points as we get further out
      var numPoints = 10;

      // Radius gets bigger as we get further out
      var radius = __imul(radiusIndex, radiusIndex) / 2 | 0;

      for (var i = 0; i < numPoints; i++) {
        var x = radius * Math.cos(i / numPoints * in_Math.PI() * 2);
        var y = radius * Math.sin(i / numPoints * in_Math.PI() * 2);
        x += Math.random() * 30 - 15;
        y += Math.random() * 30 - 15;
        self._relativeSeedLocations.push(new Vector(x, y));
      }
    }

    self._drawSeeds();
    setInterval(function() {
      self._angle += 0.005;
      self._controller.clearSeedCanvas();
      self._controller.drawImage();
      self._drawSeeds();
      self._controller.onDraw();
    }, 1000 / 60 | 0);
  }

  SeedSpiralMouseBehavior.prototype._onMove = function(e) {
    this._center = new Vector(e.offsetX, e.offsetY);
    this._controller.clearSeedCanvas();
    this._controller.drawImage();
    this._drawSeeds();
    this._controller.onDraw();
  };

  SeedSpiralMouseBehavior.prototype.down = function(e) {
    this._isMouseDown = true;
    e.stopPropagation();
    this._onMove(e);
  };

  SeedSpiralMouseBehavior.prototype.move = function(e) {
    if (this._isMouseDown) {
      this._onMove(e);
    }

    e.stopPropagation();
  };

  SeedSpiralMouseBehavior.prototype.up = function(e) {
    this._controller.drawAtPoint(new Vector(e.offsetX, e.offsetY));
    this._isMouseDown = false;
    e.stopPropagation();
  };

  SeedSpiralMouseBehavior.prototype._drawIfOnCanvas = function(point) {
    var maxWidth = this._controller.seedCanvas().width;

    if (point.x > 0 && point.y > 0 && point.x < maxWidth && point.y < maxWidth) {
      this._controller.drawAtPoint(point);
    }
  };

  SeedSpiralMouseBehavior.prototype._drawSeeds = function() {
    for (var i = 0, list = this._relativeSeedLocations, count = in_List.count(list); i < count; i = i + 1 | 0) {
      var location = in_List.get(list, i);
      this._drawIfOnCanvas(this._center.add(location.rotate(this._angle)));
    }
  };

  function PhotoDemoController(canvas) {
    var self = this;
    self._canvas = null;
    self._ctx = null;
    self._seedCanvas = null;
    self._seedCtx = null;
    self.sourceImg = null;
    self.sourcePattern = null;
    self._isMouseDown = false;
    self.radius = 1;
    self.onDraw = null;
    self._mouseBehaviors = [];
    self._canvas = canvas;
    self._ctx = in_HTMLCanvasElement.getContext2D(self._canvas);
    canvas.width = DemoController.gridSize;
    canvas.height = DemoController.gridSize;
    self._seedCanvas = document.createElement('canvas');
    self._seedCtx = in_HTMLCanvasElement.getContext2D(self._seedCanvas);
    self._seedCanvas.width = self._canvas.width;
    self._seedCanvas.height = self._canvas.height;
    self.sourceImg = document.getElementById('eye');
    self.sourcePattern = self._seedCtx.createPattern(self.sourceImg, 'repeat');
    self.drawImage();
    in_HTMLElement.addEventListener4(self._canvas, 'mousedown', function(e) {
      for (var i = 0, list = self._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
        var behavior = in_List.get(list, i);
        behavior.down(e);
      }
    });
    in_HTMLElement.addEventListener4(self._canvas, 'mousemove', function(e) {
      for (var i = 0, list = self._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
        var behavior = in_List.get(list, i);
        behavior.move(e);
      }
    });
    in_HTMLElement.addEventListener4(self._canvas, 'mouseup', function(e) {
      for (var i = 0, list = self._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
        var behavior = in_List.get(list, i);
        behavior.up(e);
      }
    });
    self._mouseBehaviors = [new SeedSpiralMouseBehavior(self)];
  }

  PhotoDemoController.prototype.seedCanvas = function() {
    return this._seedCanvas;
  };

  PhotoDemoController.prototype._drawAtPoint = function(ctx, point, fillStyle) {
    ctx.beginPath();
    ctx.rect(point.x - this.radius | 0, point.y - this.radius | 0, __imul(this.radius, 2), __imul(this.radius, 2));

    // TODO(ryan): Talk to Evan about this
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };

  PhotoDemoController.prototype.clearSeedCanvas = function() {
    this._seedCtx.clearRect(0, 0, this._seedCanvas.width, this._seedCanvas.height);
  };

  PhotoDemoController.prototype.drawImage = function() {
    // Start out by drawing the source image in the canvas displayed
    // to the user
    this._ctx.drawImage(this.sourceImg, 0, 0);
  };

  PhotoDemoController.prototype.drawAtPoint = function(point) {
    this._drawAtPoint(this._ctx, point, 'rgba(255, 255, 255, 0.5)');

    // Pin the sourceImage pixels down onto the seed canvas
    // where the user is drawing
    this._drawAtPoint(this._seedCtx, point, this.sourcePattern);
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

  Color.encodeColorValues = function(a, b) {
    if (a < 0 || a > 255) {
      throw new Error('First parameter ' + a.toString() + ' is out of bounds. Must be between 0 and 255.');
    }

    if (b < 0 || b > 255) {
      throw new Error('Second parameter ' + b.toString() + ' is out of bounds. Must be between 0 and 255.');
    }

    return __imul(a, 256) + b | 0;
  };

  Color.fromHex = function(number) {
    return new Color((number >> 16 & 255) / 255 | 0, (number >> 8 & 255) / 255, (number & 255) / 255, 1);
  };

  function JumpFlood(canvas, gridSize) {
    this._igloo = null;
    this._gridSize = 0;
    this._program = null;
    this._prepProgram = null;
    this._quadBuffer = null;
    this._sourceTexture = null;
    this._destTexture = null;
    this._tmpTexture = null;
    this._framebuffer = null;
    this._simulationStepper = null;
    this._drawOutput = null;
    this._outputCanvas = null;
    this._gridSize = gridSize;
    this._outputCanvas = canvas;

    // Igloo is a thin object-oriented WebGL library. TODO(ryan): move
    // this initialization into `lib`.
    this._igloo = new Igloo(canvas);

    if (this._igloo.gl == null) {
      throw new Error('Failed to initialize Igloo');
    }

    this._igloo.gl.disable(this._igloo.gl.DEPTH_TEST);
    this._drawOutput = new Igloo.Program(this._igloo.gl, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_DRAW_GRID);
    var gl = this._igloo.gl;
    getWebGLExtension(gl, 'OES_texture_float');
    gl.disable(gl.DEPTH_TEST);
    this._program = new Igloo.Program(this._igloo.gl, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_JUMP_FLOOD);
    this._prepProgram = new Igloo.Program(this._igloo.gl, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_PREP_FOR_JFA);
    this._quadBuffer = this._igloo.array(Igloo.QUAD2);
    this._sourceTexture = this._igloo.texture(null, gl.RGBA, gl.REPEAT, gl.NEAREST, gl.FLOAT).blank(gridSize, gridSize);
    this._destTexture = this._igloo.texture(null, gl.RGBA, gl.REPEAT, gl.NEAREST, gl.FLOAT).blank(gridSize, gridSize);
    this._tmpTexture = this._igloo.texture(null, gl.RGBA, gl.REPEAT, gl.NEAREST, gl.UNSIGNED_BYTE).blank(gridSize, gridSize);
    this._framebuffer = this._igloo.framebuffer();
    this._setSeeds(Seed.random2(new Vector(DemoController.gridSize, DemoController.gridSize), colors, 200));
  }

  JumpFlood.prototype.drawToOutputCanvas = function() {
    this._igloo.defaultFramebuffer.bind();
    this._destTexture.bind(0);
    this._igloo.gl.viewport(0, 0, this._outputCanvas.width, this._outputCanvas.height);
    this._drawOutput.use().attrib('quad', this._quadBuffer, 2).uniformi('iCellGridTexture', 0).uniform('iCanvasSize', new Float32Array([this._outputCanvas.width, this._outputCanvas.height])).uniform('iGridSize', new Float32Array([this._gridSize, this._gridSize])).uniform('iRelease', RELEASE, true).draw(this._igloo.gl.TRIANGLE_STRIP, 4);
  };

  JumpFlood.prototype.setSeedsFromCanvas = function(inputCanvas) {
    this._framebuffer.attach(this._sourceTexture);

    if (!RELEASE) {
      var gl = this._igloo.gl;
      var check = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

      if (check != gl.FRAMEBUFFER_COMPLETE) {
        throw new Error('Framebuffer completion issue');
      }
    }

    // Create a texture for the canvas. Bind it to texture position 0.
    var gl1 = this._igloo.gl;
    gl1.bindTexture(gl1.TEXTURE_2D, this._tmpTexture.texture);
    gl1.texImage2D(gl1.TEXTURE_2D, 0, gl1.RGBA, gl1.RGBA, gl1.UNSIGNED_BYTE, inputCanvas);
    this._tmpTexture.bind(0);
    this._igloo.gl.viewport(0, 0, this._gridSize, this._gridSize);
    this._prepProgram.use().attrib('quad', this._quadBuffer, 2).uniformi('iCellGridTexture', 0).uniform('iCellGridSize', new Float32Array([this._gridSize, this._gridSize])).uniform('iBackgroundColor', new Float32Array([0, 0, 0, 0])).draw(this._igloo.gl.TRIANGLE_STRIP, 4);
  };

  JumpFlood.prototype._setSeeds = function(seeds) {
    // Seeds are encoded in the grid as a vec4 (seedRg, seedBa, seedLocationX, seedLocationY)
    var rgba = new Float32Array(__imul(__imul(this._gridSize, this._gridSize), 4));

    // Set all values to -1 to that it's clear that they're all uninitialized
    for (var i = 0, count = rgba.length; i < count; i = i + 1 | 0) {
      rgba[i] = -1;
    }

    // Initialize the seeds
    for (var i1 = 0, count1 = in_List.count(seeds); i1 < count1; i1 = i1 + 1 | 0) {
      var seed = in_List.get(seeds, i1);
      var coord = (seed.position.y * this._gridSize + seed.position.x) * 4 | 0;
      var rg = Color.encodeColorValues(seed.color.r * 255 | 0, seed.color.g * 255 | 0);
      var ba = Color.encodeColorValues(seed.color.b * 255 | 0, seed.color.a * 255 | 0);
      rgba[coord] = rg;
      rgba[coord + 1 | 0] = ba;
      rgba[coord + 2 | 0] = seed.position.x;
      rgba[coord + 3 | 0] = seed.position.y;
    }

    this._sourceTexture.subset(rgba, 0, 0, this._gridSize, this._gridSize);
  };

  // Useful if you want to compute Voronoi in one step.
  JumpFlood.prototype.computeVoronoi = function() {
    var stepSize = this._gridSize / 2 | 0;

    while (stepSize >= 1) {
      this._runJumpFloodStep(stepSize);
      stepSize = stepSize / 2 | 0;
    }

    this._runJumpFloodStep(2);
    this._runJumpFloodStep(1);
  };

  JumpFlood.prototype._runJumpFloodStep = function(stepSize) {
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
      var gl = this._igloo.gl;
      var check = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

      if (check != gl.FRAMEBUFFER_COMPLETE) {
        throw new Error('Framebuffer completion issue');
      }
    }

    this._sourceTexture.bind(0);
    this._igloo.gl.viewport(0, 0, this._gridSize, this._gridSize);
    this._program.use().attrib('quad', this._quadBuffer, 2).uniformi('iCellGridTexture', 0).uniformi('iStepSize', stepSize).uniform('iCellGridSize', new Float32Array([this._gridSize, this._gridSize])).draw(this._igloo.gl.TRIANGLE_STRIP, 4);
    this._swapBuffers();
  };

  JumpFlood.prototype._swapBuffers = function() {
    // Swap the source and destination textures
    var tmp = this._sourceTexture;
    this._sourceTexture = this._destTexture;
    this._destTexture = tmp;
  };

  function Seed(position, color) {
    this.position = position;
    this.color = color;
  }

  Seed.random1 = function(gridSize, colors) {
    return new Seed(new Vector(gridSize.x * Math.random(), gridSize.y * Math.random()), in_List.get(colors, Math.random() * in_List.count(colors) | 0));
  };

  Seed.random2 = function(gridSize, colors, numSeeds) {
    var seeds = [];

    for (var i = 0, count = numSeeds; i < count; i = i + 1 | 0) {
      seeds.push(Seed.random1(gridSize, colors));
    }

    return seeds;
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

  Vector.prototype.remainderUpdate = function(v) {
    this.x = fmod(this.x, v.x);
    this.y = fmod(this.y, v.y);
  };

  Vector.prototype.addUpdate1 = function(d) {
    this.x += d;
    this.y += d;
  };

  Vector.prototype.rotate = function(angleRad) {
    return new Vector(this.x * Math.cos(angleRad) - this.y * Math.sin(angleRad), this.y * Math.cos(angleRad) + this.x * Math.sin(angleRad));
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

  var in_Date = {};

  in_Date.toMilliseconds = function(self) {
    return +self;
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

  var in_CanvasRenderingContext2D = {};

  in_CanvasRenderingContext2D.setFillStyle = function(self, value) {
    self.fillStyle = value;
  };

  var in_HTMLDocument = {};

  in_HTMLDocument.addEventListener3 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  in_HTMLDocument.addEventListener4 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  var in_HTMLElement = {};

  in_HTMLElement.addEventListener4 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  var RELEASE = false;
  var paintColors = [Color.fromHex(7667884), Color.fromHex(14373119), Color.fromHex(5046527), Color.fromHex(9651967), Color.fromHex(10042034), Color.fromHex(4150527), Color.fromHex(233724), Color.fromHex(16777215)];
  var waterColors = [Color.fromHex(7051762), Color.fromHex(4814543), Color.fromHex(8428277), Color.fromHex(8305894), Color.fromHex(9011445), Color.fromHex(970239), Color.fromHex(5611513)];
  var colors = [Color.fromHex(7112959), Color.fromHex(4379135), Color.fromHex(12075479), Color.fromHex(9971199), Color.fromHex(6225916), Color.fromHex(4849577), Color.fromHex(8285951), Color.fromHex(10551246), Color.fromHex(15226111)];
  var GLSLX_SOURCE_V_COPY_POSITION = 'precision highp float;\n\nconst vec4 q = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), k = vec4(0.0, 0.0, 1.0, 1.0), r = vec4(0.0, 1.0, 1.0, 1.0), o = vec4(1.0, 0.0, 1.0, 1.0), j = vec4(1.0, 1.0, 0.0, 1.0), g = vec4(0.0, 0.0, 0.0, 1.0), l = vec4(1.0, 1.0, 1.0, 1.0);\nattribute vec2 quad;\n\nvoid main() {\n  gl_Position = vec4(quad, 0, 1.0);\n}\n';
  var GLSLX_SOURCE_F_PREP_FOR_JFA = 'precision highp float;\n\nuniform sampler2D iCellGridTexture;\nuniform vec2 iCellGridSize;\nuniform vec4 iBackgroundColor;\nconst vec4 q = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), k = vec4(0.0, 0.0, 1.0, 1.0), r = vec4(0.0, 1.0, 1.0, 1.0), o = vec4(1.0, 0.0, 1.0, 1.0), j = vec4(1.0, 1.0, 0.0, 1.0), g = vec4(0.0, 0.0, 0.0, 1.0), l = vec4(1.0, 1.0, 1.0, 1.0);\n\nint u(int a, int b) {\n  return a * 256 + b;\n}\n\nbool e(float a, float b) {\n  return abs(a - b) < 1e-4;\n}\n\nbool w(vec4 a, vec4 b) {\n  return e(a.x, b.x) && e(a.y, b.y) && e(a.z, b.z) && e(a.w, b.w);\n}\n\nvec4 z(float a, float b, vec2 c) {\n  return vec4(a, b, c);\n}\n\nvec4 n() {\n  return vec4(-1.0, -1.0, -1.0, -1.0);\n}\n\nvoid main() {\n  vec2 b = gl_FragCoord.xy / iCellGridSize, c = vec2(b.x, 1.0 - b.y);\n  vec4 a = texture2D(iCellGridTexture, c);\n  if (w(a, iBackgroundColor))\n    gl_FragColor = n();\n  else {\n    int f = u(int(a.r * 255.0), int(a.g * 255.0)), p = u(int(a.b * 255.0), int(a.a * 255.0));\n    gl_FragColor = z(float(f), float(p), gl_FragCoord.xy);\n  }\n}\n';
  var GLSLX_SOURCE_F_JUMP_FLOOD = 'precision highp float;\n\nuniform sampler2D iCellGridTexture;\nuniform vec2 iCellGridSize;\nuniform int iStepSize;\nconst vec4 q = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), k = vec4(0.0, 0.0, 1.0, 1.0), r = vec4(0.0, 1.0, 1.0, 1.0), o = vec4(1.0, 0.0, 1.0, 1.0), j = vec4(1.0, 1.0, 0.0, 1.0), g = vec4(0.0, 0.0, 0.0, 1.0), l = vec4(1.0, 1.0, 1.0, 1.0);\n\nbool e(float a, float b) {\n  return abs(a - b) < 1e-4;\n}\n\nbool h(vec2 a) {\n  return a.x >= 0.0 && a.y >= 0.0 && a.x <= 1.0 && a.y <= 1.0;\n}\n\nvec4 n() {\n  return vec4(-1.0, -1.0, -1.0, -1.0);\n}\n\nvec2 s(const vec4 a) {\n  return vec2(a.z, a.w);\n}\n\nbool i(const vec4 a) {\n  return!e(a.y, -1.0);\n}\n\nvec4 d(const vec4 a, const vec2 f) {\n  vec2 c = (gl_FragCoord.xy + f) / iCellGridSize;\n  vec4 b = h(c) ? texture2D(iCellGridTexture, c) : n();\n  if (!i(b))\n    return a;\n  else if (!i(a))\n    return b;\n  else {\n    vec2 p = s(a), x = s(b);\n    if (distance(p, gl_FragCoord.xy) > distance(x, gl_FragCoord.xy))\n      return b;\n  }\n  return a;\n}\n\nvoid main() {\n  vec2 b = gl_FragCoord.xy / iCellGridSize;\n  if (!h(b))\n    discard;\n  vec4 a = texture2D(iCellGridTexture, b);\n  a = d(a, vec2(0, iStepSize)), a = d(a, vec2(iStepSize, iStepSize)), a = d(a, vec2(iStepSize, 0)), a = d(a, vec2(iStepSize, -iStepSize)), a = d(a, vec2(0, -iStepSize)), a = d(a, vec2(-iStepSize, -iStepSize)), a = d(a, vec2(-iStepSize, 0)), a = d(a, vec2(-iStepSize, iStepSize)), gl_FragColor = a;\n}\n';
  var GLSLX_SOURCE_F_DRAW_GRID = 'precision highp float;\n\nuniform sampler2D iCellGridTexture;\nuniform vec2 iGridSize, iCanvasSize;\nuniform int iRelease;\nconst vec4 q = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), k = vec4(0.0, 0.0, 1.0, 1.0), r = vec4(0.0, 1.0, 1.0, 1.0), o = vec4(1.0, 0.0, 1.0, 1.0), j = vec4(1.0, 1.0, 0.0, 1.0), g = vec4(0.0, 0.0, 0.0, 1.0), l = vec4(1.0, 1.0, 1.0, 1.0);\n\nint A(int a, int b) {\n  return int(mod(float(a), float(b)));\n}\n\nvec2 v(int a) {\n  return vec2(a / 256, A(a, 256));\n}\n\nbool e(float a, float b) {\n  return abs(a - b) < 1e-4;\n}\n\nbool t(vec2 a, vec2 b, vec2 c) {\n  return a.x > b.x && a.x < c.x && a.y > b.y && a.y < c.y;\n}\n\nvec2 y(vec2 b) {\n  vec2 a = gl_FragCoord.xy / iCanvasSize;\n  return vec2(0.0, 0.0) + iGridSize * a;\n}\n\nbool h(vec2 a) {\n  return a.x >= 0.0 && a.y >= 0.0 && a.x <= 1.0 && a.y <= 1.0;\n}\n\nvec4 C(const vec4 a) {\n  int b = int(a.x), c = int(a.y);\n  return vec4(v(b), v(c)) / 255.0;\n}\n\nbool i(const vec4 a) {\n  return!e(a.y, -1.0);\n}\n\nvoid B(vec2 a) {\n  if (iRelease == 1)\n    return;\n  vec4 b = vec4(1.0, 0.5, 0.5, 1.0), c = vec4(0.5, 0.5, 1.0, 1.0), f = vec4(0.5, 1.0, 0.5, 1.0);\n  if (mod(a.x, 100.0) < 3.0 || mod(a.y, 100.0) < 3.0)\n    gl_FragColor = (b + gl_FragColor) / 2.0;\n  if (t(a.xy, vec2(0.0, 0.0), vec2(10.0, 10.0)))\n    gl_FragColor = (f + gl_FragColor) / 2.0;\n  if (t(a.xy, vec2(100.0, 100.0), vec2(110.0, 110.0)))\n    gl_FragColor = (c + gl_FragColor) / 2.0;\n}\n\nvoid main() {\n  vec2 a = y(gl_FragCoord.xy), b = a / iGridSize;\n  if (!h(b)) {\n    gl_FragColor = g, B(a);\n    return;\n  }\n  vec4 c = texture2D(iCellGridTexture, b);\n  if (!i(c))\n    discard;\n  else\n    gl_FragColor = C(c);\n}\n';
  DemoController.gridSize = 256;

  main();
})();
