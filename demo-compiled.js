(function() {
  var __create = Object.create ? Object.create : function(prototype) {
    return {'__proto__': prototype};
  };

  function __extends(derived, base) {
    derived.prototype = __create(base.prototype);
    derived.prototype.constructor = derived;
  }

  var __imul = Math.imul ? Math.imul : function(a, b) {
    return (a * (b >>> 16) << 16) + a * (b & 65535) | 0;
  };

  function assert(truth) {
    if (!truth) {
      throw Error('Assertion failed');
    }
  }

  function fmod(a, b) {
    return a - b * Math.floor(a / b);
  }

  function traverse2(node, callback) {
    var queue = in_List.$new();
    queue.push(node);

    while (in_List.count(queue) != 0) {
      var next = in_List.takeFirst(queue);

      if (callback(next) == TraverseInstruction.STOP) {
        return;
      }

      for (var i = 0, list = next.children(), count = in_List.count(list); i < count; i = i + 1 | 0) {
        var child = in_List.get(list, i);
        queue.push(child);
      }
    }
  }

  function gridSize() {
    return 256;
  }

  function sizeCanvas1(canvas, size) {
    canvas.width = size * Browser.devicePixelRatio() | 0;
    canvas.height = size * Browser.devicePixelRatio() | 0;
    canvas.style.width = size.toString() + 'px';
    canvas.style.height = size.toString() + 'px';
  }

  function sizeCanvas2(canvas, size) {
    canvas.setWidth(size * Browser.devicePixelRatio() | 0);
    canvas.setHeight(size * Browser.devicePixelRatio() | 0);
    canvas.style.setWidth(size.toString() + 'px');
    canvas.style.setHeight(size.toString() + 'px');
    return canvas;
  }

  function displayError(container) {
    var ref;
    container.innerHTML = '';
    var errorStyle = new Style(['text-align', 'margin', 'background-color', 'padding', 'font-family', 'line-height'], ['center', '40px auto', '#FCFFD3', '40px', 'Helvetica', '40px']);
    container.appendChild((ref = new div(), ref.setClass('caps'), ref.style = errorStyle, ref.append("Demo disabled. Couldn't start WebGL."), ref).rawElement());
  }

  function tryOrDisplayError(container, tryBlock) {
    try {
      tryBlock();
    }

    catch (temp) {
      displayError(container);
    }
  }

  function initializePaintDemo(container) {
    var ref1;
    var ref;
    var inputCanvas = sizeCanvas2((ref = new canvas(), ref.style = inputCanvasStyle, ref), gridSize());
    var outputCanvas = sizeCanvas2(new canvas(), gridSize());
    container.appendChild((ref1 = new div(), ref1.style = demoContainerStyle, ref1.append1(inputCanvas), ref1.append1(outputCanvas), ref1).rawElement());
    var jfa = null;
    tryOrDisplayError(container, function() {
      jfa = new JumpFlood(outputCanvas.element());
    });

    if (jfa != null) {
      new CanvasDrawController(inputCanvas.element(), outputCanvas.element(), function() {
        jfa.computeAndDraw1(inputCanvas.element());
      });
    }
  }

  function initializeFishDemo(container) {
    var ref1;
    var ref;
    var inputCanvas = sizeCanvas2((ref = new canvas(), ref.style = inputCanvasStyle, ref), gridSize());
    var outputCanvas = sizeCanvas2(new canvas(), gridSize());
    container.appendChild((ref1 = new div(), ref1.style = demoContainerStyle, ref1.append1(inputCanvas), ref1.append1(outputCanvas), ref1).rawElement());
    var jfa = null;
    tryOrDisplayError(container, function() {
      jfa = new JumpFlood(outputCanvas.element());
    });

    if (jfa != null) {
      new FishGameController(inputCanvas.element(), outputCanvas.element(), function() {
        var opts = new JumpFlood.Options();
        opts.wrap = true;
        jfa.computeAndDraw2(inputCanvas.element(), opts);
      });
    }
  }

  function initializePhotoDemo(container) {
    var ref3;
    var ref2;
    var ref1;
    var ref;
    var inputCanvasStyle = new Style(['width', 'height', 'position', 'top', 'left'], ['100%', '100%', 'absolute', '0', '0']);
    var inputCanvas = sizeCanvas2((ref = new canvas(), ref.style = inputCanvasStyle, ref), gridSize());
    var image = (ref1 = new img(), ref1.id = 'eye', ref1.setSrc('/images/eye.jpg'), ref1.style = inputCanvasStyle, ref1);
    var outputCanvas = sizeCanvas2(new canvas(), gridSize());
    container.appendChild((ref2 = new div(), ref2.style = demoContainerStyle, ref2.append1((ref3 = new div(), ref3.style = new Style(['display', 'position', 'width', 'height'], ['inline-block', 'relative', gridSize().toString() + 'px', gridSize().toString() + 'px']), ref3.append1(image), ref3.append1(inputCanvas), ref3)), ref2.append1(outputCanvas), ref2).rawElement());
    var jfa = null;
    tryOrDisplayError(container, function() {
      jfa = new JumpFlood(outputCanvas.element());
    });

    if (jfa != null) {
      image.setOnload(function() {
        new PhotoDemoController(inputCanvas.element(), outputCanvas.element(), image.element(), function(photoController) {
          jfa.computeAndDraw1(photoController.seedCanvas());
        });
      });
    }
  }

  function initializeJfaPatternDemo(container) {
    var ref2;
    var ref1;
    var ref;
    var patternLabelStyle = new Style(['margin-top', 'display', 'margin'], ['20px', 'block', '20px auto']);
    patternLabelStyle.take(defaultLabelStyle);
    var patternSliderStyle = new Style(['width', 'display'], ['226px', 'inline-block']);
    var patternCanvas = sizeCanvas2(new canvas(), gridSize());
    var label = (ref = new div(), ref.style = patternLabelStyle, ref);
    var slider = (ref1 = new div(), ref1.style = patternSliderStyle, ref1);
    container.appendChild((ref2 = new div(), ref2.style = demoContainerStyle, ref2.append1(patternCanvas), ref2.append1(label), ref2.append1(slider), ref2).rawElement());
    var demoGridSize = 16;
    var logicalCanvasSize = gridSize();
    new JFAPatternDemoController(patternCanvas.element(), logicalCanvasSize, demoGridSize, label.rawElement(), slider.rawElement());
  }

  function initializeSliderDemo(container) {
    var ref5;
    var ref4;
    var ref3;
    var ref2;
    var ref1;
    var ref;
    var sliderLabelStyle = new Style(['display', 'text-align', 'width', 'margin-bottom'], ['inline-block', 'center', gridSize().toString() + 'px', '20px']);
    sliderLabelStyle.take(defaultLabelStyle);
    var content = (ref = new div(), ref.style = demoContainerStyle, ref.append1(sizeCanvas2((ref1 = new canvas(), ref1.setClass('input-canvas'), ref1.style = inputCanvasStyle, ref1), gridSize())), ref.append1(sizeCanvas2((ref2 = new canvas(), ref2.setClass('output-canvas'), ref2), gridSize())), ref.append1((ref3 = new div(), ref3.style = new Style(['margin-top'], ['20px']), ref3.append1((ref4 = new div(), ref4.setClass('label'), ref4.style = sliderLabelStyle, ref4)), ref3.append1((ref5 = new div(), ref5.setClass('slider'), ref5.style = new Style(['width', 'display'], ['226px', 'inline-block']), ref5)), ref3)), ref);
    container.appendChild(content.rawElement());
    new SlidableMaxJFARoundDemoController(content.findDescendentByClassName('input-canvas').rawElement(), content.findDescendentByClassName('output-canvas').rawElement(), gridSize(), content.findDescendentByClassName('label').rawElement(), content.findDescendentByClassName('slider').rawElement(), function() {
      displayError(container);
    });
  }

  function initializeDistanceDemo(container) {
    var ref1;
    var ref;
    var inputCanvas = sizeCanvas2((ref = new canvas(), ref.style = inputCanvasStyle, ref), gridSize());
    var outputCanvas = sizeCanvas2(new canvas(), gridSize());
    container.appendChild((ref1 = new div(), ref1.style = demoContainerStyle, ref1.append1(inputCanvas), ref1.append1(outputCanvas), ref1).rawElement());
    var jfa = null;
    tryOrDisplayError(container, function() {
      jfa = new JumpFlood(outputCanvas.element());
    });

    if (jfa != null) {
      new FishGameController(inputCanvas.element(), outputCanvas.element(), function() {
        var opts = new JumpFlood.Options();
        opts.wrap = true;
        opts.output = JumpFlood.Output.DISTANCE_FIELD;
        jfa.computeAndDraw2(inputCanvas.element(), opts);
      });
    }
  }

  function initializeShadowDemo(container) {
    var ref7;
    var ref6;
    var ref5;
    var ref4;
    var ref3;
    var ref2;
    var ref1;
    var ref;
    var labelStyle = new Style(['display', 'text-align', 'width', 'margin-right'], ['inline-block', 'right', '55px', '40px']);
    labelStyle.take(defaultLabelStyle);
    var sliderStyle = new Style(['display', 'width'], ['inline-block', '226px']);
    var controlsContainerStyle = new Style(['margin'], ['20px auto']);
    var content = (ref = new div(), ref.style = demoContainerStyle, ref.append1(sizeCanvas2((ref1 = new canvas(), ref1.setClass('output-canvas'), ref1), gridSize())), ref.append1((ref2 = new div(), ref2.style = controlsContainerStyle, ref2.append1((ref3 = new span(), ref3.style = labelStyle, ref3.append('Spread'), ref3)), ref2.append1((ref4 = new div(), ref4.setClass('spread-slider'), ref4.style = sliderStyle, ref4)), ref2)), ref.append1((ref5 = new div(), ref5.style = controlsContainerStyle, ref5.append1((ref6 = new span(), ref6.style = labelStyle, ref6.append('Blur'), ref6)), ref5.append1((ref7 = new div(), ref7.setClass('blur-slider'), ref7.style = sliderStyle, ref7)), ref5)), ref);
    container.appendChild(content.rawElement());
    var outputCanvas = content.findDescendentByClassName('output-canvas').rawElement();
    in_HTMLCanvasElement.getContext2D(outputCanvas).scale(Browser.devicePixelRatio(), Browser.devicePixelRatio());
    new ShadowDemoController(container, gridSize(), outputCanvas, content.findDescendentByClassName('spread-slider').rawElement(), content.findDescendentByClassName('blur-slider').rawElement());
  }

  function initializeGridDemo(container) {
    var ref1;
    var ref;
    var inputCanvas = sizeCanvas2((ref = new canvas(), ref.style = inputCanvasStyle, ref), gridSize());
    var outputCanvas = sizeCanvas2(new canvas(), gridSize());
    container.appendChild((ref1 = new div(), ref1.style = demoContainerStyle, ref1.append1(inputCanvas), ref1.append1(outputCanvas), ref1).rawElement());
    var jfa = null;
    tryOrDisplayError(container, function() {
      jfa = new JumpFlood(outputCanvas.element());
    });

    if (jfa != null) {
      var opts = new JumpFlood.Options();
      opts.wrap = true;
      new GridDemoController(inputCanvas.element(), outputCanvas.element(), function() {
        jfa.computeAndDraw2(inputCanvas.element(), opts);
      });
    }
  }

  function getContainer(id) {
    var container = document.getElementById(id);
    container.removeAttribute('style');
    return container;
  }

  function main() {
    in_HTMLWindow.addEventListener1(window, 'load', function() {
      initializePaintDemo(getContainer('paint-demo-container'));
      initializeFishDemo(getContainer('fish-demo-container'));
      initializePhotoDemo(getContainer('photo-demo-container'));
      initializeJfaPatternDemo(getContainer('jfa-pattern-demo-container'));
      initializeSliderDemo(getContainer('slider-demo-container'));
      initializeDistanceDemo(getContainer('distance-demo-container'));
      initializeShadowDemo(getContainer('shadow-demo-container'));
      initializeGridDemo(getContainer('grid-demo-container'));
    });
  }

  // See here to understand how this works:
  // http://www.skorks.com/2010/10/write-a-function-to-determine-if-a-number-is-a-power-of-2/
  function isPowerOfTwo(number) {
    return number != 0 && (number & number - 1) == 0;
  }

  var Browser = {};

  // This is a function so that we can easily stub it out
  Browser.devicePixelRatio = function() {
    return window.devicePixelRatio;
  };

  Browser.isElementInViewport = function(element) {
    var rect = element.getBoundingClientRect();
    return rect.bottom >= 0 && rect.right >= 0 && rect.top <= window.innerHeight && rect.left <= window.innerWidth;
  };

  // Calls `render` when `element` is on screen. Calls it with the time elapsed
  // since `render` was last called for this element. This number can be large
  // if you scroll away from an element and come back (or similarly if you change
  // tabs and come back).
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

  Color.prototype.toVec4 = function() {
    return new Float32Array([this.r, this.g, this.b, this.a]);
  };

  Color.prototype.toCSS = function() {
    return 'rgba(' + (this.r * 255 | 0).toString() + ', ' + (this.g * 255 | 0).toString() + ', ' + (this.b * 255 | 0).toString() + ', ' + this.a.toString() + ')';
  };

  Color.randomPurple = function() {
    return new Color(0.5 + Math.random() * 0.4, 0.2, 0.3 + Math.random() * 0.5, 1);
  };

  Color.fromHex = function(number) {
    return new Color((number >> 16 & 255) / 255, (number >> 8 & 255) / 255, (number & 255) / 255, 1);
  };

  function MouseEvent(_manager, mouseEvent, touchEvent) {
    this._manager = _manager;
    this.mouseEvent = mouseEvent;
    this.touchEvent = touchEvent;
  }

  // Returns true if the user has clicked down with the mouse
  // or if they are touching the screen
  MouseEvent.prototype.isDown = function() {
    return this._manager.lastKnownInfo().isDown;
  };

  MouseEvent.prototype.stopPropagation = function() {
    if (this.mouseEvent != null) {
      this.mouseEvent.stopPropagation();
    }

    else {
      this.touchEvent.stopPropagation();
    }
  };

  MouseEvent.prototype.target = function() {
    return this.mouseEvent != null ? this.mouseEvent.target : this.touchEvent.target;
  };

  // Returns the equivalent of (offsetX, offsetY), but it works for touch
  // events too. Returns the offset from the target of the event.
  MouseEvent.prototype.location = function() {
    var rect = this.target().getBoundingClientRect();
    var clientLocation = null;

    if (this.mouseEvent != null) {
      clientLocation = new Vector(this.mouseEvent.clientX, this.mouseEvent.clientY);
    }

    else {
      clientLocation = new Vector(in_List.get(in_HTMLTouchEvent.touches(this.touchEvent), 0).clientX, in_List.get(in_HTMLTouchEvent.touches(this.touchEvent), 0).clientY);
    }

    return clientLocation.subtract(new Vector(rect.left, rect.top));
  };

  // For wrapping onDown, onMove, onUp callbacks
  function AnonymousBehavior(onDown, onMove, onUp) {
    this.onDown = onDown;
    this.onMove = onMove;
    this.onUp = onUp;
  }

  AnonymousBehavior.prototype.down = function(e) {
    if (this.onDown != null) {
      this.onDown(e);
    }
  };

  AnonymousBehavior.prototype.move = function(e) {
    if (this.onMove != null) {
      this.onMove(e);
    }
  };

  AnonymousBehavior.prototype.up = function(e) {
    if (this.onUp != null) {
      this.onUp(e);
    }
  };

  // Wrapper that handles mouse and touch events for simple stuff
  // like down/drag/up. Doesn't handle swipes/rotates or anything
  // like that.
  function MouseInfo(isDown_) {
    this.isDown = false;
    this.isDown = isDown_;
  }

  MouseInfo.prototype.clone = function() {
    return new MouseInfo(this.isDown);
  };

  function MouseWatcher() {
    var self = this;
    self.lastKnownInfo = new MouseInfo(false);
    in_HTMLWindow.addEventListener1(window, 'load', function() {
      var setDown = function() {
        self.lastKnownInfo.isDown = true;
      };
      var setUp = function() {
        self.lastKnownInfo.isDown = false;
      };
      document.addEventListener('mousedown', setDown, true);
      document.addEventListener('mouseup', setUp);
      document.addEventListener('touchstart', setDown);
      document.addEventListener('touchend', setUp);
      document.addEventListener('mouseout', function(e) {
        if (e.toElement == null && e.relatedTarget == null) {
          setUp();
        }
      });
    });
  }

  function MouseBehaviorManager() {
    this._mouseBehaviors = [];
  }

  MouseBehaviorManager.prototype.register = function(behavior) {
    this._mouseBehaviors.push(behavior);
  };

  MouseBehaviorManager.prototype.onDown = function(onDown) {
    this._mouseBehaviors.push(new AnonymousBehavior(onDown, null, null));
  };

  MouseBehaviorManager.prototype.onMove = function(onMove) {
    this._mouseBehaviors.push(new AnonymousBehavior(null, onMove, null));
  };

  MouseBehaviorManager.prototype.onUp = function(onUp) {
    this._mouseBehaviors.push(new AnonymousBehavior(null, null, onUp));
  };

  MouseBehaviorManager.prototype.lastKnownInfo = function() {
    return MOUSE_WATCHER.lastKnownInfo.clone();
  };

  MouseBehaviorManager.prototype.listenOnElement = function(element) {
    var self = this;
    in_HTMLElement.addEventListener4(element, 'mousedown', function(e) {
      self._notifyDown(new MouseEvent(self, e, null));
      in_HTMLEvent.preventDefault(e);
    });
    in_HTMLElement.addEventListener4(element, 'mousemove', function(e) {
      self._notifyMove(new MouseEvent(self, e, null));
      in_HTMLEvent.preventDefault(e);
    });
    in_HTMLElement.addEventListener4(element, 'mouseup', function(e) {
      self._notifyUp(new MouseEvent(self, e, null));
      in_HTMLEvent.preventDefault(e);
    });
    in_HTMLElement.addEventListener4(element, 'mouseleave', function(e) {
      self._notifyUp(new MouseEvent(self, e, null));
      in_HTMLEvent.preventDefault(e);
    });
    in_HTMLElement.addEventListener5(element, 'touchstart', function(e) {
      self._notifyDown(new MouseEvent(self, null, e));
      in_HTMLEvent.preventDefault(e);
    });
    in_HTMLElement.addEventListener5(element, 'touchmove', function(e) {
      self._notifyMove(new MouseEvent(self, null, e));
      in_HTMLEvent.preventDefault(e);
    });
    in_HTMLElement.addEventListener5(element, 'touchend', function(e) {
      self._notifyUp(new MouseEvent(self, null, e));
      in_HTMLEvent.preventDefault(e);
    });
  };

  MouseBehaviorManager.prototype._notifyDown = function(event) {
    for (var i = 0, list = this._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
      var _behavior = in_List.get(list, i);
      _behavior.down(event);
    }
  };

  MouseBehaviorManager.prototype._notifyUp = function(event) {
    for (var i = 0, list = this._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
      var _behavior = in_List.get(list, i);
      _behavior.up(event);
    }
  };

  MouseBehaviorManager.prototype._notifyMove = function(event) {
    for (var i = 0, list = this._mouseBehaviors, count = in_List.count(list); i < count; i = i + 1 | 0) {
      var _behavior = in_List.get(list, i);
      _behavior.move(event);
    }
  };

  var UpdateType = {
    CHANGE: 0,
    COMMIT: 1
  };

  function DragBehavior() {
    this._dragStart = null;
    this.offset = new Vector(0, 0);
    this.onUpdate = null;
  }

  DragBehavior.prototype.down = function(e) {
    this._setCursorMove(e.target(), true);
    this._dragStart = e.location();
    this._update(e.location(), UpdateType.CHANGE);
  };

  DragBehavior.prototype.move = function(e) {
    this._setCursorMove(e.target(), e.isDown());

    if (this._dragStart != null) {
      this._update(e.location(), UpdateType.CHANGE);
    }
  };

  DragBehavior.prototype.up = function(e) {
    if (this._dragStart != null) {
      this._update(e.location(), UpdateType.COMMIT);
      this._dragStart = null;
    }

    this._setCursorMove(e.target(), false);
  };

  DragBehavior.prototype._update = function(eventLocation, type) {
    assert(this._dragStart != null);
    this.offset = eventLocation.subtract(this._dragStart);

    if (this.onUpdate != null) {
      this.onUpdate(type);
    }
  };

  DragBehavior.prototype._setCursorMove = function(element, setMove) {
    element.style.cursor = setMove ? 'move' : null;
  };

  function Square(center) {
    this.center = center;
    this.size = 2;
    this.color = new Color(0, 0, 1, 1);
  }

  Square.prototype.render = function(ctx) {
    ctx.beginPath();
    ctx.rect(this.center.x - (this.size / 2 | 0) | 0, this.center.y - (this.size / 2 | 0) | 0, __imul(this.size, 2), __imul(this.size, 2));
    in_CanvasRenderingContext2D.setFillStyle(ctx, this.color.toCSS());
    ctx.fill();
    ctx.closePath();
  };

  function Style(keys, values) {
    this._inner = in_StringMap.$new();

    for (var i = 0, count = in_List.count(keys); i < count; i = i + 1 | 0) {
      this._inner[in_List.get(keys, i)] = in_List.get(values, i);
    }
  }

  Style.prototype.applyToElement = function(element) {
    in_StringMap.each(this._inner, function(key, value) {
      element.style[key] = value;
    });
  };

  Style.prototype.take = function(other) {
    var self = this;
    in_StringMap.each(other._inner, function(key, value) {
      self._inner[key] = value;
    });
    return self;
  };

  Style.prototype.setHeight = function(value) {
    this._inner['height'] = value;
  };

  Style.prototype.setWidth = function(value) {
    this._inner['width'] = value;
  };

  Style.$new = function() {
    this._inner = in_StringMap.$new();
  };

  Style.$new.prototype = Style.prototype;

  function Vector(x, y) {
    this.x = 0;
    this.y = 0;
    this.x = x;
    this.y = y;
  }

  Vector.prototype.clone = function() {
    return new Vector(this.x, this.y);
  };

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

  Vector.prototype.addUpdate1 = function(d) {
    this.x += d;
    this.y += d;
  };

  Vector.prototype.multiplyUpdate1 = function(d) {
    this.x *= d;
    this.y *= d;
  };

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

  var TraverseInstruction = {
    CONTINUE: 0,
    STOP: 1
  };

  function XMLDomElement(tag) {
    this._tag = null;
    this._children = in_List.$new();
    this._element = null;
    this.style = new Style.$new();
    this.id = null;
    this._element = document.createElement(tag);
  }

  XMLDomElement.prototype.setClass = function(value) {
    this._element.className = value;
  };

  XMLDomElement.prototype.$class = function() {
    return this._element.className;
  };

  XMLDomElement.prototype.children = function() {
    return this._children;
  };

  XMLDomElement.prototype.rawElement = function() {
    this._applyStyles();
    return this._element;
  };

  XMLDomElement.prototype._applyStyles = function() {
    this.style.applyToElement(this._element);

    for (var i = 0, list = this._children, count = in_List.count(list); i < count; i = i + 1 | 0) {
      var child = in_List.get(list, i);
      child._applyStyles();
    }
  };

  XMLDomElement.prototype.append = function(child) {
    this._element.textContent = child;
  };

  XMLDomElement.prototype.append1 = function(child) {
    this._children.push(child);
    this._element.appendChild(child._element);
  };

  // TODO(ryan): This assumes that elements have at most one class. That's no good.
  XMLDomElement.prototype.findDescendentByClassName = function(className_) {
    return this._findDescendent(function(descendent) {
      return descendent.$class() == className_;
    });
  };

  XMLDomElement.prototype._findDescendent = function(check) {
    var result = null;
    traverse2(this, function(descendent) {
      if (check(descendent)) {
        result = descendent;
        return TraverseInstruction.STOP;
      }

      return TraverseInstruction.CONTINUE;
    });
    return result;
  };

  function div() {
    XMLDomElement.call(this, 'div');
  }

  __extends(div, XMLDomElement);

  function span() {
    XMLDomElement.call(this, 'span');
  }

  __extends(span, XMLDomElement);

  function canvas() {
    XMLDomElement.call(this, 'canvas');
  }

  __extends(canvas, XMLDomElement);

  canvas.prototype.element = function() {
    return this._element;
  };

  canvas.prototype.setWidth = function(value) {
    this.element().width = value;
  };

  canvas.prototype.setHeight = function(value) {
    this.element().height = value;
  };

  function img() {
    XMLDomElement.call(this, 'img');
  }

  __extends(img, XMLDomElement);

  img.prototype.element = function() {
    return this._element;
  };

  img.prototype.setSrc = function(value) {
    this.element().src = value;
  };

  img.prototype.setOnload = function(value) {
    this.element().onload = value;
  };

  // onDraw will be called whenever the user draws something in the canvas.
  // Useful since we want to re-compute the Voronoi diagram of the canvas
  // every time the user draws.
  function CanvasDrawController(inputCanvas, outputCanvas, onDraw) {
    var self = this;
    self._inputCanvas = null;
    self._outputCanvas = null;
    self._ctx = null;
    self._onDraw = null;
    self._mouseBehaviorManager = new MouseBehaviorManager();
    self._inputCanvas = inputCanvas;
    self._outputCanvas = outputCanvas;
    self._onDraw = onDraw;
    self._ctx = in_HTMLCanvasElement.getContext2D(self._inputCanvas);
    self._ctx.scale(Browser.devicePixelRatio(), Browser.devicePixelRatio());
    self._mouseBehaviorManager.listenOnElement(self._inputCanvas);
    self._mouseBehaviorManager.listenOnElement(self._outputCanvas);
    self._mouseBehaviorManager.onDown(function(e) {
      if (e.target() == self._inputCanvas || e.target() == self._outputCanvas) {
        self._changeColorAndDraw(e.location());
      }
    });
    self._mouseBehaviorManager.onMove(function(e) {
      if (e.isDown()) {
        self._changeColorAndDraw(e.location());
      }
    });
    var canvasRect = self._inputCanvas.getBoundingClientRect();
    self._changeColorAndDraw(new Vector(canvasRect.width / 2 | 0, canvasRect.height / 2 | 0));
  }

  CanvasDrawController.prototype._changeColorAndDraw = function(point) {
    var canvasRect = this._inputCanvas.getBoundingClientRect();

    if (point.x > 0 && point.y > 0 && point.x < canvasRect.width && point.y < canvasRect.height) {
      this._ctx.beginPath();
      this._ctx.rect(point.x - CanvasDrawController.dotRadius | 0, point.y - CanvasDrawController.dotRadius | 0, __imul(CanvasDrawController.dotRadius, 2), __imul(CanvasDrawController.dotRadius, 2));
      in_CanvasRenderingContext2D.setFillStyle(this._ctx, Color.randomPurple().toCSS());
      this._ctx.fill();

      if (this._onDraw != null) {
        this._onDraw();
      }
    }
  };

  function DraggableTextDemoController(inputCanvas, outputCanvas) {
    var self = this;
    self._textCanvas = null;
    self._inputCanvas = null;
    self._outputCanvas = null;
    self._ctx = null;
    self._logicalCanvasSize = 0;
    self._mouseBehaviorManager = new MouseBehaviorManager();
    self.center = null;
    self.dragBehavior = null;
    self.lastKnownOffset = null;
    self.onDraw = null;
    self._inputCanvas = inputCanvas;
    self._outputCanvas = outputCanvas;
    self._textCanvas = DraggableTextDemoController.drawTextCanvas();
    self._ctx = in_HTMLCanvasElement.getContext2D(self._inputCanvas);
    self._ctx.scale(Browser.devicePixelRatio(), Browser.devicePixelRatio());
    self._logicalCanvasSize = outputCanvas.getBoundingClientRect().width;

    // Figure out the width of the text and set _lastKnownOffset so that the text
    // is centered in the canvas
    var halfCanvas = new Vector(self._outputCanvas.width, self._outputCanvas.height).divide1(2);
    var halfTextSize = new Vector(self._textCanvas.width, self._textCanvas.height).divide1(2);
    self.center = halfCanvas.subtract(halfTextSize).divide1(Browser.devicePixelRatio());
    self.lastKnownOffset = self.center.clone();
    self._mouseBehaviorManager.listenOnElement(self._inputCanvas);
    self._mouseBehaviorManager.listenOnElement(self._outputCanvas);
    self.dragBehavior = new DragBehavior();
    self.dragBehavior.onUpdate = function(type) {
      switch (type) {
        case UpdateType.CHANGE: {
          self.render(self.lastKnownOffset.add(self.dragBehavior.offset));
          break;
        }

        case UpdateType.COMMIT: {
          self.lastKnownOffset.addUpdate(self.dragBehavior.offset);
          self.render(self.lastKnownOffset);
          break;
        }
      }
    };
    self._mouseBehaviorManager.register(self.dragBehavior);
    self.render(self.center);
  }

  DraggableTextDemoController.drawTextCanvas = function() {
    var canvas = document.createElement('canvas');
    var ctx = in_HTMLCanvasElement.getContext2D(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = DraggableTextDemoController.textSizePx.toString() + 'px Baskerville';
    var width = ctx.measureText(DraggableTextDemoController.text).width;
    canvas.width = Math.round(width) * Browser.devicePixelRatio() | 0;
    canvas.height = DraggableTextDemoController.textSizePx * Browser.devicePixelRatio() | 0;
    ctx.scale(Browser.devicePixelRatio(), Browser.devicePixelRatio());
    ctx.font = DraggableTextDemoController.textSizePx.toString() + 'px Baskerville';
    in_CanvasRenderingContext2D.setFillStyle(ctx, '#333');
    ctx.textBaseline = 'hanging';
    ctx.fillText(DraggableTextDemoController.text, 0, 0);
    return canvas;
  };

  DraggableTextDemoController.prototype.render = function(offset) {
    in_CanvasRenderingContext2D.setFillStyle(this._ctx, 'white');
    this._ctx.fillRect(0, 0, this._logicalCanvasSize, this._logicalCanvasSize);
    this.drawTextToContext(this._ctx, offset);

    if (this.onDraw != null) {
      this.onDraw();
    }
  };

  DraggableTextDemoController.prototype.drawTextToContext = function(ctx, offset) {
    ctx.drawImage(this._textCanvas, offset.x, offset.y, this._textCanvas.width / Browser.devicePixelRatio(), this._textCanvas.height / Browser.devicePixelRatio());
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
    self._mouseBehaviorManager = new MouseBehaviorManager();
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
    self._mouseBehaviorManager.listenOnElement(self._inputCanvas);
    self._mouseBehaviorManager.listenOnElement(self._outputCanvas);
    self._mouseBehaviorManager.onDown(function(e) {
      self._fish.center = e.location();
    });
    self._mouseBehaviorManager.onMove(function(e) {
      self._fish.center = e.location();
    });
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

  // onDraw will be called whenever the user draws something in the canvas.
  // Useful since we want to re-compute the Voronoi diagram of the canvas
  // every time the user draws.
  function GridDemoController(inputCanvas, outputCanvas, onDraw) {
    var self = this;
    self._inputCanvas = null;
    self._outputCanvas = null;
    self._ctx = null;
    self._onDraw = null;
    self._firstPattern = null;
    self._secondPattern = null;
    self._secondColorOffset = new Vector((GridDemoController.spacing / 2 | 0) + (GridDemoController.spacing / 4 | 0) | 0, (GridDemoController.spacing / 2 | 0) - (GridDemoController.spacing / 4 | 0) | 0);
    self._mouseBehaviorManager = new MouseBehaviorManager();
    self._userHasInteracted = false;
    self._inputCanvas = inputCanvas;
    self._outputCanvas = outputCanvas;
    self._onDraw = onDraw;
    self._ctx = in_HTMLCanvasElement.getContext2D(self._inputCanvas);
    self._firstPattern = self._ctx.createPattern(GridDemoController.drawGrid(self._inputCanvas.width, self._inputCanvas.height), 'repeat');
    self._secondPattern = self._ctx.createPattern(GridDemoController.drawGrid(self._inputCanvas.width, self._inputCanvas.height), 'repeat');
    self._mouseBehaviorManager.listenOnElement(self._inputCanvas);
    self._mouseBehaviorManager.listenOnElement(self._outputCanvas);
    var dragBehavior = new DragBehavior();
    self._mouseBehaviorManager.register(dragBehavior);
    dragBehavior.onUpdate = function(type) {
      self._userHasInteracted = true;

      switch (type) {
        case UpdateType.CHANGE: {
          self._render(self._secondColorOffset.add(dragBehavior.offset));
          break;
        }

        case UpdateType.COMMIT: {
          self._secondColorOffset.addUpdate(dragBehavior.offset);
          self._render(self._secondColorOffset);
          break;
        }
      }
    };
    self._render(self._secondColorOffset);
    Browser.renderWhileElementOnScreen(self._inputCanvas, function(elapsedMs) {
      if (!self._userHasInteracted) {
        self._secondColorOffset.addUpdate1(elapsedMs / 30);
        self._render(self._secondColorOffset);
      }
    });
  }

  GridDemoController.drawGrid = function(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = in_HTMLCanvasElement.getContext2D(canvas);
    ctx.scale(Browser.devicePixelRatio(), Browser.devicePixelRatio());
    ctx.clearRect(0, 0, width, height);

    for (var x = -1, count1 = (width / GridDemoController.spacing | 0) + 1 | 0; x < count1; x = x + 1 | 0) {
      for (var y = -1, count = (height / GridDemoController.spacing | 0) + 1 | 0; y < count; y = y + 1 | 0) {
        ctx.beginPath();
        ctx.rect(__imul(x, GridDemoController.spacing) + (GridDemoController.spacing / 2 | 0) | 0, __imul(y, GridDemoController.spacing) + (GridDemoController.spacing / 2 | 0) | 0, GridDemoController.dotRadius * Browser.devicePixelRatio(), GridDemoController.dotRadius * Browser.devicePixelRatio());
        in_CanvasRenderingContext2D.setFillStyle(ctx, Color.randomPurple().toCSS());
        ctx.fill();
      }
    }

    return canvas;
  };

  GridDemoController.prototype._render = function(offset) {
    this._ctx.clearRect(0, 0, this._inputCanvas.width, this._inputCanvas.height);
    this._ctx.beginPath();
    this._ctx.rect(0, 0, this._inputCanvas.width, this._inputCanvas.height);
    in_CanvasRenderingContext2D.setFillStyle1(this._ctx, this._firstPattern);
    this._ctx.fill();
    this._ctx.beginPath();
    this._ctx.rect(0, 0, this._inputCanvas.width, this._inputCanvas.height);
    in_CanvasRenderingContext2D.setFillStyle1(this._ctx, this._secondPattern);

    // Translate the ctx before drawing the second one to offset it
    this._ctx.save();
    this._ctx.translate(offset.x | 0, offset.y | 0);
    this._ctx.fill();
    this._ctx.restore();

    if (this._onDraw != null) {
      this._onDraw();
    }
  };

  function JFAPatternDemoController(canvas, logicalCanvasSize, gridSize, label, slider) {
    var self = this;
    self._canvas = null;
    self._gridSize = 0;
    self._label = null;
    self._slider = null;
    self._logicalCanvasSize = 0;
    self._mouseBehaviorManager = null;
    self._state = null;
    self._userIsDragging = false;
    self._elapsedSinceLastRender = 0;
    self._canvas = canvas;
    in_HTMLCanvasElement.getContext2D(self._canvas).scale(Browser.devicePixelRatio(), Browser.devicePixelRatio());
    self._logicalCanvasSize = logicalCanvasSize;
    self._gridSize = gridSize;
    self._label = label;
    self._state = new JFAPatternDemoController.State(new JFAPatternDemoController.IntPair(0, 0), 0);
    Browser.renderWhileElementOnScreen(canvas, function(elapsedMs) {
      self._stepSimulation(elapsedMs);
    });

    // Initialize mouse interactions
    self._mouseBehaviorManager = new MouseBehaviorManager();
    self._mouseBehaviorManager.listenOnElement(canvas);
    var moveToStateUnderMouse = function(event) {
      self._userIsDragging = true;
      var cellLocation = event.location().divide1(self._cellSize());
      self._state.center = new JFAPatternDemoController.IntPair((cellLocation.x | 0) - 1 | 0, cellLocation.y | 0);
    };
    self._mouseBehaviorManager.onDown(moveToStateUnderMouse);
    self._mouseBehaviorManager.onMove(function(event) {
      if (event.isDown()) {
        moveToStateUnderMouse(event);
      }

      self._render();
    });
    self._mouseBehaviorManager.onUp(function(event) {
      self._userIsDragging = false;
    });

    // Initialize UI
    var max = JFAPatternDemoController.computeMaxRoundInclusive(gridSize);
    self._slider = new Slider(slider, in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.$new(), 'start', 0), 'step', 1), 'range', {'min': 0, 'max': max}));
    self._slider.on('start', function() {
      self._userIsDragging = true;
      self._state.jfaRound = self._slider.get() | 0;
      self._updateUI(UpdateSource.SLIDER);
    });
    self._slider.on('end', function() {
      self._state.jfaRound = self._slider.get() | 0;
      self._updateUI(UpdateSource.SLIDER);
      self._userIsDragging = false;
    });
    self._slider.on('slide', function() {
      self._state.jfaRound = self._slider.get() | 0;
      self._updateUI(UpdateSource.SLIDER);
    });
    self._updateUI(UpdateSource.SIMULATION);
  }

  // If gridSize is 8, for example, then
  //
  // round = 0, gridSize = 4
  // round = 1, gridSize = 2
  // round = 2, gridSize = 1
  // round = 3 --> gridSize invalid
  JFAPatternDemoController.computeStepLength = function(round, gridSize) {
    if (round < 0 || round == Math.log2(gridSize)) {
      throw new Error(round.toString() + ' is not a valid round for JFA gridSize ' + gridSize.toString());
    }

    return gridSize / in_int.power(2, round + 1 | 0) | 0;
  };

  JFAPatternDemoController.computeMaxRoundInclusive = function(gridSize) {
    return Math.log2(gridSize) - 1 | 0;
  };

  // From here: http://stackoverflow.com/a/6333775
  JFAPatternDemoController.fillAndStrokeArrow = function(ctx, from, to) {
    var headlen = 12;
    var angle = Math.atan2(to.y - from.y | 0, to.x - from.x | 0);

    // Draw the line
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Draw the arrow head
    var pt2 = new Vector(to.x - headlen * Math.cos(angle - in_Math.PI() / 6), to.y - headlen * Math.sin(angle - in_Math.PI() / 6));
    var pt3 = new Vector(to.x - headlen * Math.cos(angle + in_Math.PI() / 6), to.y - headlen * Math.sin(angle + in_Math.PI() / 6));
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.lineTo(pt3.x, pt3.y);
    ctx.fill();
  };

  JFAPatternDemoController.prototype._updateUI = function(source) {
    var stepLength = JFAPatternDemoController.computeStepLength(this._state.jfaRound, this._gridSize);
    this._label.textContent = 'JFA round ' + this._state.jfaRound.toString() + ', step length is ' + stepLength.toString();

    if (source != UpdateSource.SLIDER) {
      this._slider.set(this._state.jfaRound);
    }
  };

  JFAPatternDemoController.prototype.nextState = function(state) {
    var next = state.clone();
    next.center.x = next.center.x + 1 | 0;

    if (next.center.x == this._gridSize) {
      next.center.x = 0;
      next.center.y = next.center.y + 1 | 0;
    }

    if (next.center.y == this._gridSize) {
      next.center.y = 0;

      // Update jfaRound if necessary
      next.jfaRound = (next.jfaRound + 1 | 0) % (JFAPatternDemoController.computeMaxRoundInclusive(this._gridSize) + 1 | 0) | 0;
    }

    return next;
  };

  JFAPatternDemoController.prototype._cellSize = function() {
    return this._logicalCanvasSize / this._gridSize | 0;
  };

  JFAPatternDemoController.prototype._stepSimulation = function(elapsedMs) {
    this._elapsedSinceLastRender += elapsedMs;

    if (this._elapsedSinceLastRender > JFAPatternDemoController.frameDurationMs) {
      this._elapsedSinceLastRender = 0;

      if (!this._userIsDragging) {
        var oldJfaRound = this._state.jfaRound;
        this._state = this.nextState(this._state);

        if (oldJfaRound != this._state.jfaRound) {
          this._updateUI(UpdateSource.SIMULATION);
        }

        this._render();
      }
    }
  };

  JFAPatternDemoController.prototype._render = function() {
    var ctx = in_HTMLCanvasElement.getContext2D(this._canvas);
    ctx.clearRect(0, 0, this._logicalCanvasSize, this._logicalCanvasSize);
    this._drawBackgroundGrid(ctx);
    this._drawCells(ctx);
    this._drawArrows(ctx);
  };

  JFAPatternDemoController.prototype._drawBackgroundGrid = function(ctx) {
    var cellSize = this._cellSize();

    // Draw background grid
    ctx.beginPath();
    ctx.lineWidth = JFAPatternDemoController.gridLineWidth;

    for (var i = 0, count = this._gridSize + 1 | 0; i < count; i = i + 1 | 0) {
      ctx.moveTo(0, __imul(cellSize, i));
      ctx.lineTo(this._logicalCanvasSize, __imul(cellSize, i));
    }

    for (var i1 = 0, count1 = this._gridSize + 1 | 0; i1 < count1; i1 = i1 + 1 | 0) {
      ctx.moveTo(__imul(cellSize, i1), 0);
      ctx.lineTo(__imul(cellSize, i1), this._logicalCanvasSize);
    }

    in_CanvasRenderingContext2D.setStrokeStyle(ctx, Color.veryLightGrey.toCSS());
    ctx.stroke();

    // Border around everything
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.rect(1, 1, this._logicalCanvasSize - 2 | 0, this._logicalCanvasSize - 2 | 0);
    in_CanvasRenderingContext2D.setStrokeStyle(ctx, Color.mediumGrey.toCSS());
    ctx.stroke();
  };

  JFAPatternDemoController.prototype._drawCells = function(ctx) {
    var cellSize = this._cellSize();

    // Draw center square
    ctx.beginPath();
    ctx.rect(__imul(this._state.center.x, cellSize), __imul(this._state.center.y, cellSize), cellSize, cellSize);
    in_CanvasRenderingContext2D.setFillStyle(ctx, Color.purple.toCSS());
    ctx.fill();

    // Draw the cells that we're moving to
    ctx.beginPath();
    ctx.lineWidth = JFAPatternDemoController.gridLineWidth;
    in_CanvasRenderingContext2D.setStrokeStyle(ctx, Color.purple.toCSS());
    var k = JFAPatternDemoController.computeStepLength(this._state.jfaRound, this._gridSize);

    for (var i1 = 0, list1 = [-k | 0, 0, k], count1 = in_List.count(list1); i1 < count1; i1 = i1 + 1 | 0) {
      var deltaX = in_List.get(list1, i1);

      for (var i = 0, list = [-k | 0, 0, k], count = in_List.count(list); i < count; i = i + 1 | 0) {
        var deltaY = in_List.get(list, i);
        var cellX = this._state.center.x + deltaX | 0;
        var cellY = this._state.center.y + deltaY | 0;
        ctx.rect(__imul(cellX, cellSize) + JFAPatternDemoController.gridLineWidth | 0, __imul(cellY, cellSize) + JFAPatternDemoController.gridLineWidth | 0, cellSize - __imul(2, JFAPatternDemoController.gridLineWidth) | 0, cellSize - __imul(2, JFAPatternDemoController.gridLineWidth) | 0);
      }
    }

    ctx.stroke();
  };

  JFAPatternDemoController.prototype._drawArrows = function(ctx) {
    var k = JFAPatternDemoController.computeStepLength(this._state.jfaRound, this._gridSize);
    var cellSize = this._cellSize();

    // Draw the lines to arrows to the cells
    ctx.beginPath();
    ctx.lineWidth = JFAPatternDemoController.gridLineWidth;
    in_CanvasRenderingContext2D.setStrokeStyle(ctx, Color.mediumGrey.toCSS());
    in_CanvasRenderingContext2D.setFillStyle(ctx, Color.mediumGrey.toCSS());

    for (var i1 = 0, list1 = [-k | 0, 0, k], count1 = in_List.count(list1); i1 < count1; i1 = i1 + 1 | 0) {
      var deltaX = in_List.get(list1, i1);

      for (var i = 0, list = [-k | 0, 0, k], count = in_List.count(list); i < count; i = i + 1 | 0) {
        var deltaY = in_List.get(list, i);

        if (deltaX == 0 && deltaY == 0) {
          continue;
        }

        var cellX = this._state.center.x + deltaX | 0;
        var cellY = this._state.center.y + deltaY | 0;
        var rectX = __imul(cellX, cellSize);
        var rectY = __imul(cellY, cellSize);
        var extraX = deltaX == (-k | 0) ? 0 : deltaX == 0 ? cellSize / 2 | 0 : cellSize;
        var extraY = deltaY == (-k | 0) ? 0 : deltaY == 0 ? cellSize / 2 | 0 : cellSize;
        JFAPatternDemoController.fillAndStrokeArrow(ctx, new JFAPatternDemoController.IntPair(__imul(this._state.center.x, cellSize) + extraX | 0, __imul(this._state.center.y, cellSize) + extraY | 0), new JFAPatternDemoController.IntPair(rectX + (cellSize / 2 | 0) | 0, rectY + (cellSize / 2 | 0) | 0));
      }
    }
  };

  JFAPatternDemoController.IntPair = function(x, y) {
    this.x = x;
    this.y = y;
  };

  JFAPatternDemoController.State = function(center, jfaRound) {
    this.center = center;
    this.jfaRound = jfaRound;
  };

  JFAPatternDemoController.State.prototype.clone = function() {
    return new JFAPatternDemoController.State(this.center, this.jfaRound);
  };

  var UpdateSource = {
    SIMULATION: 0,
    SLIDER: 1
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
        this._center = e.location();
        this._handle = this._center.add(handleRelativeToCenter);
        break;
      }

      case SeedSpiralMouseBehavior.DragType.HANDLE: {
        // Move just the handle
        this._handle = e.location();
        break;
      }
    }

    this._render();
  };

  SeedSpiralMouseBehavior.prototype.down = function(e) {
    this._lastKnownMouse = e.location();
    var mouseDown = e.location();

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
    this._lastKnownMouse = e.location();

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
    this._controller.drawAtPoint(e.location());
    this._dragContext = null;
    this._lastKnownMouse = e.location();
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

  function PhotoDemoController(inputCanvas_, outputCanvas_, sourceImage_, onDraw_) {
    this.inputCanvas = null;
    this.outputCanvas = null;
    this.inputContext = null;
    this._seedCanvas = null;
    this._seedCtx = null;
    this.sourceImg = null;
    this.sourcePattern = null;
    this.onDraw = null;
    this._mouseBehaviorManager = new MouseBehaviorManager();
    this.inputCanvas = inputCanvas_;
    this.outputCanvas = outputCanvas_;
    this.sourceImg = sourceImage_;
    this.onDraw = onDraw_;
    this._mouseBehaviorManager.listenOnElement(this.inputCanvas);
    this._mouseBehaviorManager.listenOnElement(this.outputCanvas);
    this.inputContext = in_HTMLCanvasElement.getContext2D(this.inputCanvas);
    this.inputContext.scale(Browser.devicePixelRatio(), Browser.devicePixelRatio());
    this._seedCanvas = document.createElement('canvas');
    this._seedCtx = in_HTMLCanvasElement.getContext2D(this._seedCanvas);
    this._seedCanvas.width = this.inputCanvas.width;
    this._seedCanvas.height = this.inputCanvas.height;
    var patternCanvas = document.createElement('canvas');
    patternCanvas.width = this._seedCanvas.width;
    patternCanvas.height = this._seedCanvas.height;
    in_HTMLCanvasElement.getContext2D(patternCanvas).drawImage(this.sourceImg, 0, 0, this.sourceImg.naturalWidth, this.sourceImg.naturalHeight, 0, 0, patternCanvas.width, patternCanvas.height);
    this.sourcePattern = this._seedCtx.createPattern(patternCanvas, 'repeat');

    //_mouseBehaviorManager.register(DrawSeedMouseBehavior.new(self))
    this._mouseBehaviorManager.register(new SeedSpiralMouseBehavior(this));
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

  function ShadowDemoController(container, gridSize, outputCanvas, spreadSliderElement, blurSliderElement) {
    var self = this;
    self._jfa = null;
    self._gridSize = 0;
    self._outputCanvas = null;
    self._spreadSlider = null;
    self._blurSlider = null;
    self._jfaSeedCanvas = null;
    self._shadowCanvas = null;
    self._outputCanvasCtx = null;
    self._voronoi = null;
    self._controller = null;
    self._gridSize = gridSize;
    self._outputCanvas = outputCanvas;

    // Create the canvas that we draw seeds onto
    self._jfaSeedCanvas = document.createElement('canvas');
    sizeCanvas1(self._jfaSeedCanvas, self._gridSize);

    // Create the canvas that we draw the shadow onto (this is the output
    // of JFA)
    self._shadowCanvas = document.createElement('canvas');
    sizeCanvas1(self._shadowCanvas, self._gridSize);
    self._outputCanvasCtx = in_HTMLCanvasElement.getContext2D(self._outputCanvas);

    // Initialize the Voronoi generator
    tryOrDisplayError(container, function() {
      self._jfa = new JumpFlood(self._shadowCanvas);
    });

    if (self._jfa == null) {
      return;
    }

    self._controller = new DraggableTextDemoController(self._jfaSeedCanvas, outputCanvas);
    self._controller.onDraw = function() {
      self.render();
    };
    self._spreadSlider = new Slider(spreadSliderElement, in_StringMap.insert(in_StringMap.insert(in_StringMap.$new(), 'start', ShadowDemoController.initialSpread), 'range', {'min': ShadowDemoController.minSpread, 'max': ShadowDemoController.maxSpread}));
    self._spreadSlider.on('slide', function() {
      self.render();
    });
    self._blurSlider = new Slider(blurSliderElement, in_StringMap.insert(in_StringMap.insert(in_StringMap.$new(), 'start', ShadowDemoController.initialBlur), 'range', {'min': ShadowDemoController.minBlur, 'max': ShadowDemoController.maxBlur}));
    self._blurSlider.on('slide', function() {
      self.render();
    });
    self.render();
  }

  ShadowDemoController.prototype.render = function() {
    var shadowSpread = this._spreadSlider.get();
    var shadowBlur = this._blurSlider.get();
    var opts = new JumpFlood.Options();
    opts.seedCanvasBackgroundColor = Color.white.toVec4();
    opts.output = JumpFlood.Output.DROP_SHADOW;
    opts.shadowSpread = shadowSpread;
    opts.shadowBlur = shadowBlur;
    this._jfa.computeAndDraw2(this._jfaSeedCanvas, opts);

    // Output canvas has a white background
    in_CanvasRenderingContext2D.setFillStyle(this._outputCanvasCtx, 'white');
    this._outputCanvasCtx.fillRect(0, 0, this._outputCanvas.width / Browser.devicePixelRatio(), this._outputCanvas.height / Browser.devicePixelRatio());

    // Draw the shadow of the text on the background
    this._outputCanvasCtx.drawImage(this._shadowCanvas, 0, 0, this._outputCanvas.width / Browser.devicePixelRatio(), this._outputCanvas.height / Browser.devicePixelRatio());

    // Draw the text to the center of the output canvas
    this._controller.drawTextToContext(this._outputCanvasCtx, this._controller.center);
    in_CanvasRenderingContext2D.setStrokeStyle(this._outputCanvasCtx, '#C5C5C5');
    this._outputCanvasCtx.lineWidth = 1;
    this._outputCanvasCtx.strokeRect(0, 0, this._outputCanvas.width / Browser.devicePixelRatio(), this._outputCanvas.height / Browser.devicePixelRatio());
  };

  function SlidableMaxJFARoundDemoController(inputCanvas, outputCanvas, gridSize, label, slider, onError) {
    var self = this;
    self._inputCanvas = null;
    self._outputCanvas = null;
    self._jfa = null;
    self._label = null;
    self._slider = null;
    self._inputCanvas = inputCanvas;
    self._label = label;

    try {
      self._jfa = new JumpFlood(outputCanvas);
    }

    catch (temp) {
      onError();
    }

    var maxJfaRound = Math.log2(gridSize) + 1 | 0;
    self._slider = new Slider(slider, in_StringMap.insert(in_StringMap.insert(in_StringMap.insert(in_StringMap.$new(), 'start', maxJfaRound), 'step', 1), 'range', {'min': 1, 'max': maxJfaRound}));
    self._slider.on('slide', function() {
      self._drawWithSteps(self._slider.get() | 0);
    });

    // A CanvasDrawController handles user draw-actions on the input canvas
    // Whenever the user draws, we re-render the voronoi diagram for the input
    new CanvasDrawController(inputCanvas, outputCanvas, function() {
      self._drawWithSteps(self._slider.get() | 0);
    });
    self._drawWithSteps(maxJfaRound);
  }

  SlidableMaxJFARoundDemoController.prototype._drawWithSteps = function(steps) {
    this._label.textContent = 'Stop at round #' + (this._slider.get() | 0).toString();
    var opts = new JumpFlood.Options();
    opts.maxRounds = steps;
    this._jfa.computeAndDraw2(this._inputCanvas, opts);
  };

  // Wrapper around noUiSlider API to make it slightly friendlier in Skew
  function Slider(element, options) {
    this._element = null;
    this._element = element;
    noUiSlider.create(element, options);
  }

  Slider.prototype.get = function() {
    return this._element.noUiSlider.get();
  };

  Slider.prototype.set = function(value) {
    this._element.noUiSlider.set(value);
  };

  Slider.prototype.on = function(event, callback) {
    this._element.noUiSlider.on(event, callback);
  };

  function JumpFlood(canvas) {
    this._wham = null;
    this._gridSize = 0;
    this._prepJumpFloodData = null;
    this._jumpFlood = null;
    this._drawVoronoi = null;
    this._drawDistanceField = null;
    this._drawDropShadow = null;
    this._renderTexture = null;
    this._sourceTexture = null;
    this._destTexture = null;
    this._quadBuffer = null;
    this._seedInputTexture = null;
    this._tempOutputTexture = null;
    this._framebuffer = null;
    this._simulationStepper = null;
    this._inputCanvas = null;
    this._outputCanvas = null;

    if (canvas.width != canvas.height) {
      throw new Error('Voronoi canvas parameter must be square. Size is (' + canvas.width.toString() + ', ' + canvas.height.toString() + ')');
    }

    if (!isPowerOfTwo(canvas.width)) {
      throw new Error('Voronoi canvas size must be a power of two. Size is ' + canvas.width.toString());
    }

    this._gridSize = canvas.width;
    this._outputCanvas = canvas;
    this._wham = new Wham(canvas);

    if (this._wham.ctx == null) {
      throw new Error('Failed to initialize Wham');
    }

    this._wham.ctx.disable(this._wham.ctx.DEPTH_TEST);
    var ctx = this._wham.ctx;
    ctx.disable(ctx.DEPTH_TEST);
    this._jumpFlood = new Wham.Program(this._wham.ctx, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_JUMP_FLOOD);
    this._prepJumpFloodData = new Wham.Program(this._wham.ctx, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_PREP_FOR_JFA);
    this._renderTexture = new Wham.Program(this._wham.ctx, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_RENDER_TEXTURE);
    this._drawVoronoi = new Wham.Program(this._wham.ctx, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_DRAW_JUMP_FLOOD_DATA);
    this._drawDistanceField = new Wham.Program(this._wham.ctx, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_DRAW_DISTANCE_FIELD);
    this._drawDropShadow = new Wham.Program(this._wham.ctx, GLSLX_SOURCE_V_COPY_POSITION, GLSLX_SOURCE_F_DRAW_SHADOW);
    this._quadBuffer = new Wham.Buffer(ctx);
    this._quadBuffer.update1(Wham.QUAD2, ctx.STATIC_DRAW);
    var opts = new Wham.TextureOptions(ctx, ctx.RGBA, ctx.REPEAT, ctx.NEAREST, ctx.UNSIGNED_BYTE);
    this._sourceTexture = new Wham.Texture(ctx, opts);
    this._sourceTexture.clear(this._gridSize, this._gridSize);
    this._destTexture = new Wham.Texture(ctx, opts);
    this._destTexture.clear(this._gridSize, this._gridSize);
    opts = new Wham.TextureOptions(ctx, ctx.RGBA, ctx.REPEAT, ctx.LINEAR, ctx.UNSIGNED_BYTE);
    this._tempOutputTexture = new Wham.Texture(ctx, opts);
    this._tempOutputTexture.clear(this._gridSize, this._gridSize);
    opts = new Wham.TextureOptions(ctx, ctx.RGBA, ctx.REPEAT, ctx.NEAREST, ctx.UNSIGNED_BYTE);
    this._seedInputTexture = new Wham.Texture(ctx, opts);
    this._seedInputTexture.clear(this._gridSize, this._gridSize);
    this._framebuffer = Wham.Framebuffer.create(ctx);
  }

  JumpFlood.prototype.computeAndDraw1 = function(seedInputCanvas) {
    this.computeAndDraw2(seedInputCanvas, new JumpFlood.Options());
  };

  JumpFlood.prototype.computeAndDraw2 = function(seedInputCanvas, options) {
    this._setSeedsFromCanvas2(seedInputCanvas, options.seedCanvasBackgroundColor);

    if (options.maxRounds < 0) {
      this._computeVoronoi(options);
    }

    else {
      this._resetVoronoiSteps(options);

      for (var i = 0, count = options.maxRounds; i < count; i = i + 1 | 0) {
        this._stepVoronoi();
      }
    }

    switch (options.output) {
      case JumpFlood.Output.VORONOI: {
        this._drawVoronoiDiagramToOutputCanvas();
        break;
      }

      case JumpFlood.Output.DISTANCE_FIELD: {
        this._drawDistanceFieldToOutputCanvas();
        break;
      }

      case JumpFlood.Output.DROP_SHADOW: {
        if (options.shadowSpread < 0) {
          throw new Error('If options.output is .SHADOW, you must set options.shadowSpread');
        }

        if (options.shadowBlur < 0) {
          throw new Error('If options.output is .SHADOW, you must set options.shadowBlur');
        }

        this._drawShadowToOutputCanvas(options.shadowSpread, options.shadowBlur);
        break;
      }
    }
  };

  JumpFlood.prototype._setSeedsFromCanvas2 = function(inputCanvas, backgroundColor) {
    this._inputCanvas = inputCanvas;
    this._framebuffer.attach(this._sourceTexture);
    this._checkFramebufferCompletion();

    // Create a texture for the canvas. Bind it to texture position 0.
    this._seedInputTexture.set1(inputCanvas);
    this._seedInputTexture.bind2(0);
    this._wham.ctx.viewport(0, 0, this._gridSize, this._gridSize);
    this._prepJumpFloodData.use().attrib1(GLSLX_NAME_QUAD, this._quadBuffer, 2).uniform1(GLSLX_NAME_I_SEED_INPUT_TEXTURE, 0).uniform4(GLSLX_NAME_I_RESOLUTION, new Float32Array([this._gridSize, this._gridSize])).uniform4(GLSLX_NAME_I_BACKGROUND_COLOR, backgroundColor).draw(this._wham.ctx.TRIANGLE_STRIP, 4);
  };

  JumpFlood.prototype._drawVoronoiDiagramToOutputCanvas = function() {
    // First draw _destTexture into _tempOutputTexture
    this._framebuffer.attach(this._tempOutputTexture);
    this._checkFramebufferCompletion();

    // Create a texture for the canvas. Bind it to texture position 0.
    this._seedInputTexture.set1(this._inputCanvas);
    this._seedInputTexture.bind2(0);
    this._destTexture.bind2(1);
    this._wham.ctx.viewport(0, 0, this._gridSize, this._gridSize);
    this._drawVoronoi.use().attrib1(GLSLX_NAME_QUAD, this._quadBuffer, 2).uniform1(GLSLX_NAME_I_SEED_INPUT_TEXTURE, 0).uniform1(GLSLX_NAME_I_INPUT_TEXTURE, 1).uniform4(GLSLX_NAME_I_RESOLUTION, new Float32Array([this._gridSize, this._gridSize])).draw(this._wham.ctx.TRIANGLE_STRIP, 4);
    this._drawTempTexture();
  };

  JumpFlood.prototype._drawDistanceFieldToOutputCanvas = function() {
    // First draw _destTexture into _tempOutputTexture
    this._framebuffer.attach(this._tempOutputTexture);
    this._checkFramebufferCompletion();
    this._destTexture.bind2(0);
    this._wham.ctx.viewport(0, 0, this._gridSize, this._gridSize);
    this._drawDistanceField.use().attrib1(GLSLX_NAME_QUAD, this._quadBuffer, 2).uniform1(GLSLX_NAME_I_INPUT_TEXTURE, 0).uniform4(GLSLX_NAME_I_RESOLUTION, new Float32Array([this._gridSize, this._gridSize])).draw(this._wham.ctx.TRIANGLE_STRIP, 4);
    this._drawTempTexture();
  };

  JumpFlood.prototype._drawShadowToOutputCanvas = function(shadowSpread, shadowBlur) {
    // First draw _destTexture into _tempOutputTexture
    this._framebuffer.attach(this._tempOutputTexture);
    this._checkFramebufferCompletion();
    this._destTexture.bind2(0);
    this._wham.ctx.viewport(0, 0, this._gridSize, this._gridSize);
    this._drawDropShadow.use().attrib1(GLSLX_NAME_QUAD, this._quadBuffer, 2).uniform1(GLSLX_NAME_I_INPUT_TEXTURE, 0).uniform4(GLSLX_NAME_I_RESOLUTION, new Float32Array([this._gridSize, this._gridSize])).uniform2(GLSLX_NAME_I_SHADOW_SPREAD, shadowSpread).uniform2(GLSLX_NAME_I_SHADOW_BLUR, shadowBlur).uniform4(GLSLX_NAME_I_SHADOW_COLOR, new Float32Array([0.7, 0.7, 0.7, 1])).draw(this._wham.ctx.TRIANGLE_STRIP, 4);
    this._drawTempTexture();
  };

  // We draw into _tempTexture at a higher resolution than we want on screen
  // and then scale down _tempTexture to antialias
  JumpFlood.prototype._drawTempTexture = function() {
    this._wham.defaultFramebuffer.bind();
    this._checkFramebufferCompletion();
    this._tempOutputTexture.bind2(0);
    this._wham.ctx.viewport(0, 0, this._outputCanvas.width, this._outputCanvas.height);
    this._renderTexture.use().attrib1(GLSLX_NAME_QUAD, this._quadBuffer, 2).uniform1(GLSLX_NAME_I_INPUT_TEXTURE, 0).uniform4(GLSLX_NAME_I_RESOLUTION, new Float32Array([this._outputCanvas.width, this._outputCanvas.height])).draw(this._wham.ctx.TRIANGLE_STRIP, 4);
  };

  // Useful if you want to compute Voronoi in one step.
  JumpFlood.prototype._computeVoronoi = function(options) {
    var stepSize = this._gridSize / 2 | 0;

    while (stepSize >= 1) {
      this._runJumpFloodStep(stepSize, options);
      stepSize = stepSize / 2 | 0;
    }

    this._runJumpFloodStep(2, options);
    this._runJumpFloodStep(1, options);
  };

  // Use resetVoronoiSteps and stepVoronoi to move foward
  // through iterations of the JFA algorithm. Useful, for
  // example, if you're showing an explanation of the
  // algorithm.
  JumpFlood.prototype._resetVoronoiSteps = function(options) {
    var self = this;
    var stepSize = self._gridSize / 2 | 0;
    self._simulationStepper = function() {
      if (stepSize >= 1) {
        self._runJumpFloodStep(stepSize | 0, options);
        stepSize /= 2;
      }

      else if (stepSize < 1) {
        self._runJumpFloodStep(2, options);
        self._runJumpFloodStep(1, options);
      }
    };
  };

  JumpFlood.prototype._stepVoronoi = function() {
    this._simulationStepper();
  };

  JumpFlood.prototype._runJumpFloodStep = function(stepSize, options) {
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
    this._checkFramebufferCompletion();
    this._sourceTexture.bind2(0);
    this._wham.ctx.viewport(0, 0, this._gridSize, this._gridSize);
    this._jumpFlood.use().attrib1(GLSLX_NAME_QUAD, this._quadBuffer, 2).uniform1(GLSLX_NAME_I_INPUT_TEXTURE, 0).uniform1(GLSLX_NAME_I_STEP_SIZE, stepSize).uniform4(GLSLX_NAME_I_RESOLUTION, new Float32Array([this._gridSize, this._gridSize])).uniform1(GLSLX_NAME_I_USE_TORUS_DISTANCE_FOR_SEEDS, options.wrap ? 1 : 0).draw(this._wham.ctx.TRIANGLE_STRIP, 4);
    this._swapBuffers();
  };

  JumpFlood.prototype._swapBuffers = function() {
    var tmp = this._sourceTexture;
    this._sourceTexture = this._destTexture;
    this._destTexture = tmp;
  };

  JumpFlood.prototype._checkFramebufferCompletion = function() {
    if (!RELEASE) {
      var ctx = this._wham.ctx;
      var check = ctx.checkFramebufferStatus(ctx.FRAMEBUFFER);

      if (check != ctx.FRAMEBUFFER_COMPLETE) {
        throw new Error('Framebuffer completion error');
      }
    }
  };

  JumpFlood.Output = {
    // Draw a Voronoi diagram as output
    VORONOI: 0,

    // Draw a distance field as output. Pixels close to a seed are
    // light and pixels far from a seed are dark.
    DISTANCE_FIELD: 1,

    // Draw a drop shadow as output. Each seed of the input casts
    // shadow. The color of the seeds don't matter.
    DROP_SHADOW: 2
  };

  JumpFlood.Options = function() {
    this.wrap = false;
    this.seedCanvasBackgroundColor = Color.clear.toVec4();
    this.maxRounds = -1;
    this.output = JumpFlood.Output.VORONOI;
    this.shadowSpread = -1;
    this.shadowBlur = -1;
  };

  var HTML = {};

  HTML.asList = function(listLike) {
    var list = [];

    for (var i = 0, count = listLike.length; i < count; i = i + 1 | 0) {
      list.push(listLike[i]);
    }

    return list;
  };

  HTML.on = function(target, type, listener) {
    target.addEventListener(type, listener);
  };

  HTML.preventDefault = function(event) {
    event.preventDefault();
  };

  var in_List = {};

  in_List.get = function(self, index) {
    assert(0 <= index && index < in_List.count(self));
    return self[index];
  };

  in_List.count = function(self) {
    return self.length;
  };

  in_List.isEmpty = function(self) {
    return in_List.count(self) == 0;
  };

  in_List.takeFirst = function(self) {
    assert(!in_List.isEmpty(self));
    return self.shift();
  };

  in_List.$new = function() {
    return [];
  };

  var in_StringMap = {};

  in_StringMap.get1 = function(self, key) {
    assert(key in self);
    return self[key];
  };

  in_StringMap.insert = function(self, key, value) {
    self[key] = value;
    return self;
  };

  in_StringMap.each = function(self, x) {
    for (var key in self) {
      x(key, in_StringMap.get1(self, key));
    }
  };

  in_StringMap.$new = function() {
    return __create(null);
  };

  var in_Math = {};

  in_Math.PI = function() {
    return 3.141592653589793;
  };

  var in_int = {};

  in_int.power = function(self, x) {
    var y = self;
    var z = x < 0 ? 0 : 1;

    while (x > 0) {
      if ((x & 1) != 0) {
        z = __imul(z, y);
      }

      x >>= 1;
      y = __imul(y, y);
    }

    return z;
  };

  var in_Date = {};

  in_Date.toMilliseconds = function(self) {
    return +self;
  };

  var in_HTMLWindow = {};

  in_HTMLWindow.addEventListener1 = function(self, type, listener) {
    HTML.on(self, type, listener);
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

  var in_HTMLEvent = {};

  in_HTMLEvent.preventDefault = function(self) {
    HTML.preventDefault(self);
  };

  var in_HTMLTouchEvent = {};

  in_HTMLTouchEvent.touches = function(self) {
    return HTML.asList(self.touches);
  };

  var in_HTMLElement = {};

  in_HTMLElement.addEventListener4 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  in_HTMLElement.addEventListener5 = function(self, type, listener) {
    HTML.on(self, type, listener);
  };

  var RELEASE = false;

  // Need to have only one of these since it listens on the document with a
  // useCapture listener
  var MOUSE_WATCHER = new MouseWatcher();
  var defaultLabelStyle = new Style(['font-family'], ["'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Geneva, Verdana, sans-serif"]);
  var demoContainerStyle = new Style(['text-align', 'margin'], ['center', '40px auto']);
  var inputCanvasStyle = new Style(['background-color'], ['#F5F5F5']);
  var waterColors = [Color.fromHex(7051762), Color.fromHex(4814543), Color.fromHex(8428277), Color.fromHex(8305894), Color.fromHex(9011445), Color.fromHex(970239), Color.fromHex(5611513)];
  var GLSLX_SOURCE_V_COPY_POSITION = 'precision highp float;\nprecision highp int;\n\nconst vec4 j = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), n = vec4(0.0, 0.0, 1.0, 1.0), o = vec4(0.0, 0.0, 0.0, 1.0), l = vec4(1.0, 1.0, 1.0, 1.0);\nattribute vec2 G;\n\nvoid main() {\n  gl_Position = vec4(G, 0, 1.0);\n}\n';
  var GLSLX_SOURCE_F_PREP_FOR_JFA = 'precision highp float;\nprecision highp int;\n\nuniform sampler2D v;\nuniform vec2 e;\nuniform vec4 A;\nconst vec4 j = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), n = vec4(0.0, 0.0, 1.0, 1.0), o = vec4(0.0, 0.0, 0.0, 1.0), l = vec4(1.0, 1.0, 1.0, 1.0);\n\nbool B(const vec4 a, const vec4 b) {\n  return all(lessThan(abs(a - b), vec4(5e-3)));\n}\n\nvec2 q(const float b) {\n  float a = b;\n  return vec2(floor(a / 100.0), mod(a, 100.0));\n}\n\nvec4 s(const vec2 b) {\n  vec2 a = floor(b), c = q(a.x), d = q(a.y);\n  return vec4(c, d) / 255.0;\n}\n\nvec4 x() {\n  return s(vec2(5000.0, 5000.0));\n}\n\nvoid main() {\n  vec2 a = gl_FragCoord.xy / e, b = vec2(a.x, 1.0 - a.y);\n  vec4 c = texture2D(v, b);\n  gl_FragColor = B(c, A) ? x() : s(gl_FragCoord.xy);\n}\n';
  var GLSLX_SOURCE_F_JUMP_FLOOD = 'precision highp float;\nprecision highp int;\n\nuniform sampler2D i;\nuniform vec2 e;\nuniform int C;\nuniform bool w;\nconst vec4 j = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), n = vec4(0.0, 0.0, 1.0, 1.0), o = vec4(0.0, 0.0, 0.0, 1.0), l = vec4(1.0, 1.0, 1.0, 1.0);\n\nbool p(const vec2 a, const vec2 b, const vec2 c) {\n  return all(greaterThan(a, b)) && all(lessThan(a, c));\n}\n\nbool r(const vec2 a) {\n  return p(a, vec2(0.0, 0.0), vec2(1.0, 1.0));\n}\n\nvec2 q(const float b) {\n  float a = b;\n  return vec2(floor(a / 100.0), mod(a, 100.0));\n}\n\nfloat f(const vec2 a) {\n  return a.x * 100.0 + a.y;\n}\n\nvec4 s(const vec2 b) {\n  vec2 a = floor(b), c = q(a.x), d = q(a.y);\n  return vec4(c, d) / 255.0;\n}\n\nvec4 x() {\n  return s(vec2(5000.0, 5000.0));\n}\n\nvec2 g(const vec4 b) {\n  vec4 a = b * 255.0;\n  float c = f(a.rg), d = f(a.ba);\n  return vec2(c, d) + vec2(0.5);\n}\n\nbool t(const vec4 a) {\n  vec2 b = g(a);\n  return b.x < 4999.0;\n}\n\nfloat u(vec2 a, vec2 b, vec2 c) {\n  float d = min(abs(a.x - b.x), c.x - abs(a.x - b.x)), h = min(abs(a.y - b.y), c.y - abs(a.y - b.y));\n  return sqrt(d * d + h * h);\n}\n\nvec4 k(const vec4 b, const vec2 y) {\n  vec2 c = (gl_FragCoord.xy + y) / e;\n  vec4 a = texture2D(i, c);\n  a = !r(c) && !w ? x() : a;\n  if (!t(a))\n    return b;\n  else if (!t(b))\n    return a;\n  else {\n    vec2 d = g(b), h = g(a);\n    float D = w ? u(d, gl_FragCoord.xy, e) : distance(d, gl_FragCoord.xy), E = w ? u(h, gl_FragCoord.xy, e) : distance(h, gl_FragCoord.xy);\n    if (D > E)\n      return a;\n  }\n  return b;\n}\n\nvoid main() {\n  vec2 c = gl_FragCoord.xy / e;\n  vec4 a = texture2D(i, c);\n  int b = C;\n  a = k(a, vec2(0, b)), a = k(a, vec2(b, b)), a = k(a, vec2(b, 0)), a = k(a, vec2(b, -b)), a = k(a, vec2(0, -b)), a = k(a, vec2(-b, -b)), a = k(a, vec2(-b, 0)), a = k(a, vec2(-b, b)), gl_FragColor = a;\n}\n';
  var GLSLX_SOURCE_F_DRAW_JUMP_FLOOD_DATA = 'precision highp float;\nprecision highp int;\n\nuniform sampler2D v, i;\nuniform vec2 e;\nconst vec4 j = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), n = vec4(0.0, 0.0, 1.0, 1.0), o = vec4(0.0, 0.0, 0.0, 1.0), l = vec4(1.0, 1.0, 1.0, 1.0);\n\nfloat f(const vec2 a) {\n  return a.x * 100.0 + a.y;\n}\n\nvec2 g(const vec4 b) {\n  vec4 a = b * 255.0;\n  float c = f(a.rg), d = f(a.ba);\n  return vec2(c, d) + vec2(0.5);\n}\n\nbool t(const vec4 a) {\n  vec2 b = g(a);\n  return b.x < 4999.0;\n}\n\nvoid main() {\n  vec2 c = gl_FragCoord.xy / e;\n  vec4 b = texture2D(i, c);\n  if (t(b)) {\n    vec2 a = g(b) / e;\n    a.y = 1.0 - a.y, gl_FragColor = texture2D(v, a);\n  }\n  else\n    gl_FragColor = l;\n}\n';
  var GLSLX_SOURCE_F_DRAW_DISTANCE_FIELD = 'precision highp float;\nprecision highp int;\n\nuniform sampler2D i;\nuniform vec2 e;\nconst vec4 j = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), n = vec4(0.0, 0.0, 1.0, 1.0), o = vec4(0.0, 0.0, 0.0, 1.0), l = vec4(1.0, 1.0, 1.0, 1.0);\n\nbool p(const vec2 a, const vec2 b, const vec2 c) {\n  return all(greaterThan(a, b)) && all(lessThan(a, c));\n}\n\nbool r(const vec2 a) {\n  return p(a, vec2(0.0, 0.0), vec2(1.0, 1.0));\n}\n\nfloat f(const vec2 a) {\n  return a.x * 100.0 + a.y;\n}\n\nvec2 g(const vec4 b) {\n  vec4 a = b * 255.0;\n  float c = f(a.rg), d = f(a.ba);\n  return vec2(c, d) + vec2(0.5);\n}\n\nfloat u(vec2 a, vec2 b, vec2 c) {\n  float d = min(abs(a.x - b.x), c.x - abs(a.x - b.x)), h = min(abs(a.y - b.y), c.y - abs(a.y - b.y));\n  return sqrt(d * d + h * h);\n}\n\nvoid main() {\n  vec2 b = gl_FragCoord.xy / e;\n  if (!r(b)) {\n    gl_FragColor = j;\n    return;\n  }\n  vec4 c = texture2D(i, b);\n  vec2 d = g(c);\n  float a = u(d, gl_FragCoord.xy, e);\n  a = 1.0 - a / (e.x * 0.5), gl_FragColor = vec4(a, a, a, 1.0);\n}\n';
  var GLSLX_SOURCE_F_DRAW_SHADOW = 'precision highp float;\nprecision highp int;\n\nuniform sampler2D i;\nuniform vec2 e;\nuniform float F, z;\nuniform vec4 H;\nconst vec4 j = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), n = vec4(0.0, 0.0, 1.0, 1.0), o = vec4(0.0, 0.0, 0.0, 1.0), l = vec4(1.0, 1.0, 1.0, 1.0);\n\nbool p(const vec2 a, const vec2 b, const vec2 c) {\n  return all(greaterThan(a, b)) && all(lessThan(a, c));\n}\n\nbool r(const vec2 a) {\n  return p(a, vec2(0.0, 0.0), vec2(1.0, 1.0));\n}\n\nfloat f(const vec2 a) {\n  return a.x * 100.0 + a.y;\n}\n\nvec2 g(const vec4 b) {\n  vec4 a = b * 255.0;\n  float c = f(a.rg), d = f(a.ba);\n  return vec2(c, d) + vec2(0.5);\n}\n\nvoid main() {\n  vec2 a = gl_FragCoord.xy / e;\n  if (!r(a)) {\n    gl_FragColor = j;\n    return;\n  }\n  vec4 b = texture2D(i, a);\n  vec2 c = g(b);\n  float d = distance(c, gl_FragCoord.xy), h = F - z / 2.0, y = clamp((d - h) / z, 0.0, 1.0);\n  gl_FragColor = mix(H, vec4(0.0), y);\n}\n';
  var GLSLX_SOURCE_F_RENDER_TEXTURE = 'precision highp float;\nprecision highp int;\n\nuniform sampler2D i;\nuniform vec2 e;\nconst vec4 j = vec4(1.0, 0.0, 0.0, 1.0), m = vec4(0.0, 1.0, 0.0, 1.0), n = vec4(0.0, 0.0, 1.0, 1.0), o = vec4(0.0, 0.0, 0.0, 1.0), l = vec4(1.0, 1.0, 1.0, 1.0);\n\nvoid main() {\n  vec2 a = gl_FragCoord.xy / e;\n  gl_FragColor = texture2D(i, a);\n}\n';
  var GLSLX_NAME_I_RESOLUTION = 'e';
  var GLSLX_NAME_I_INPUT_TEXTURE = 'i';
  var GLSLX_NAME_I_SEED_INPUT_TEXTURE = 'v';
  var GLSLX_NAME_I_USE_TORUS_DISTANCE_FOR_SEEDS = 'w';
  var GLSLX_NAME_I_SHADOW_BLUR = 'z';
  var GLSLX_NAME_I_BACKGROUND_COLOR = 'A';
  var GLSLX_NAME_I_STEP_SIZE = 'C';
  var GLSLX_NAME_I_SHADOW_SPREAD = 'F';
  var GLSLX_NAME_QUAD = 'G';
  var GLSLX_NAME_I_SHADOW_COLOR = 'H';
  Color.mediumGrey = Color.fromHex(6710886);
  Color.veryLightGrey = Color.fromHex(15724527);
  Color.purple = Color.fromHex(9391359);
  Color.white = Color.fromHex(16777215);
  Color.clear = new Color(0, 0, 0, 0);
  Wham.QUAD2 = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  CanvasDrawController.dotRadius = 2;
  DraggableTextDemoController.text = 'Voronoi';
  DraggableTextDemoController.textSizePx = 60;
  GridDemoController.spacing = 64;
  GridDemoController.dotRadius = 1;
  JFAPatternDemoController.frameDurationMs = 100;
  JFAPatternDemoController.gridLineWidth = 1;
  SeedSpiralMouseBehavior.centerRadius = 6;
  SeedSpiralMouseBehavior.handleRadius = 4;
  SeedSpiralMouseBehavior.clickBlur = 6;
  SeedSpiralMouseBehavior.initialCenterHandleDistance = 50;
  ShadowDemoController.initialSpread = 1;
  ShadowDemoController.minSpread = 1;
  ShadowDemoController.maxSpread = 256;
  ShadowDemoController.initialBlur = 22;
  ShadowDemoController.minBlur = 1;
  ShadowDemoController.maxBlur = 256;

  main();
})();
