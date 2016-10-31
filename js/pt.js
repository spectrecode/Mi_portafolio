
/* Licensed under the Apache License, Version 2.0. (http://www.apache.org/licenses/LICENSE-2.0). Copyright 2015-2016 William Ngan. (https://github.com/williamngan/pt/) */

  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

Const = (function() {
  function Const() {}
  Const.xy = 'xy';
  Const.yz = 'yz';
  Const.xz = 'xz';
  Const.xyz = 'xyz';
  Const.two_pi = 6.283185307179586;
  Const.one_degree = 0.027453292519943295;
  Const.gravity = 9.81;
  return Const;

})();

this.Const = Const;

Matrix = (function() {
  function Matrix() {}

  Matrix.rotateAnchor2D = function(radian, anchor, axis) {
    var a, cosA, sinA;
    if (axis == null) {
      axis = Const.xy;
    }
    a = anchor.get2D(axis);
    cosA = Math.cos(radian);
    sinA = Math.sin(radian);
    return [cosA, sinA, 1, -sinA, cosA, 1, a.x * (1 - cosA) + a.y * sinA, a.y * (1 - cosA) - a.x * sinA, 1];
  };

  Matrix.transform2D = function(pt, m, axis, byValue) {
    var v, x, y;
    if (axis == null) {
      axis = Const.xy;
    }
    if (byValue == null) {
      byValue = false;
    }
    v = pt.get2D(axis);
    x = v.x * m[0] + v.y * m[3] + m[6];
    y = v.x * m[1] + v.y * m[4] + m[7];
    v.x = x;
    v.y = y;
    v = v.get2D(axis, true);
    if (!byValue) {
      pt.set(v);
      return pt;
    }
    return v;
  };

  return Matrix;

})();

this.Matrix = Matrix;

Space = (function() {
  function Space(id) {
    this.id = id;
    this.size = new Vector();
    this.center = new Vector();
    this.items = {};
    this._refresh = true;
  }

  Space.prototype.refresh = function(b) {
    this._refresh = b;
    return this;
  };

  Space.prototype.render = function(context) {
    return this;
  };

  Space.prototype.add = function(item) {
    var k;
    if ((item.animate != null) && typeof item.animate === 'function') {
      k = this._animCount++;
      this.items[k] = item;
    }
    return this;
  };

  Space.prototype.play = function(time) {
    if (time == null) {
      time = 0;
    }
    this._animID = requestAnimationFrame((function(_this) {
      return function(t) {
        return _this.play(t);
      };
    })(this));
    try {
      this._playItems(time);
    } catch (_error) {
    }
  };

  Space.prototype._playItems = function(time) {
    var k, ref, v;
    if (this._refresh) {
      this.clear();
    }
    ref = this.items;
    for (k in ref) {
      v = ref[k];
      v.animate(time, this._timeDiff, this.ctx);
    }
    return this;
  };

  Space.prototype.bindMouse = function(_bind) {
    if (_bind == null) {
      _bind = true;
    }
    if (this.space.addEventListener && this.space.removeEventListener) {
        return this.space.addEventListener("mousemove", this._mouseMove.bind(this));
    }
  };

  Space.prototype.bindTouch = function(_bind) {
    if (_bind == null) {
      _bind = true;
    }
  };

  Space.prototype._mouseAction = function(type, evt) {
    var _c, k, px, py, ref, ref1, results, results1, v;
    if (evt.touches || evt.changedTouches) {
      ref = this.items;
      results = [];
      
    } else {
      ref1 = this.items;
      results1 = [];
      for (k in ref1) {
        v = ref1[k];
        if (v.onMouseAction != null) {
          px = evt.offsetX || evt.layerX;
          py = evt.offsetY || evt.layerY;
          results1.push(v.onMouseAction(type, px, py, evt));
        }
      }
      return results1;
    }
  };

  Space.prototype._mouseMove = function(evt) {
    this._mouseAction("move", evt);
  };
  return Space;
})();

this.Space = Space;

CanvasSpace = (function(superClass) {
  extend(CanvasSpace, superClass);

  function CanvasSpace(elem, callback) {
    this._resizeHandler = bind(this._resizeHandler, this);
    var _existed, _selector, b, isElement;
    if (!elem) {
      elem = 'pt';
    }
    isElement = elem instanceof Element;
    CanvasSpace.__super__.constructor.call(this, isElement ? "pt_custom_space" : elem);
    this.space = null;
    this.bound = null;
    this.boundRect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
    this.pixelScale = 1;
    this._autoResize = true;
    _selector = null;
    if (isElement) {
      _selector = elem;
    } else {
      this.id = this.id[0] === "#" ? this.id.substr(1) : this.id;
      _selector = document.querySelector("#" + this.id);
      _existed = true;
    }
    if (!_selector) {
      this.bound = this._createElement("div", this.id + "_container");
      this.space = this._createElement("canvas", this.id);
      this.bound.appendChild(this.space);
      document.body.appendChild(this.bound);
      _existed = false;
    } else if (_selector.nodeName.toLowerCase() !== "canvas") {
      this.bound = _selector;
      this.space = this._createElement("canvas", this.id + "_canvas");
      this.bound.appendChild(this.space);
    } else {
      this.space = _selector;
      this.bound = this.space.parentElement;
    }
    if (_existed) {
      b = this.bound.getBoundingClientRect();
      this.resize(b.width, b.height);
    }
    this._mdown = false;
    this._mdrag = false;
    setTimeout(this._ready.bind(this, callback), 50);
    this.bgcolor = "#F3F7FA";
    this.ctx = this.space.getContext('2d');
  }

  CanvasSpace.prototype._createElement = function(elem, id) {
    var d;
    if (elem == null) {
      elem = "div";
    }
    d = document.createElement(elem);
    d.setAttribute("id", id);
    return d;
  };

  CanvasSpace.prototype._ready = function(callback) {
    if (this.bound) {
      this.boundRect = this.bound.getBoundingClientRect();
    }
  };

  CanvasSpace.prototype.setup = function(opt) {
    var r1, r2;
    if (opt.bgcolor !== void 0) {
      this.bgcolor = opt.bgcolor;
    }
    this._autoResize = opt.resize !== false ? true : false;
    return this;
  };

  CanvasSpace.prototype.resize = function(w, h, evt) {
    var k, p, ref;
    w = Math.floor(w);
    h = Math.floor(h);
    this.size.set(w, h);
    this.space.width = w * this.pixelScale;
    this.space.height = h * this.pixelScale;
    this.space.style.width = w + "px";
    this.space.style.height = h + "px";
  };

  CanvasSpace.prototype.clear = function(bg) {
    var lastColor;
    if (bg) {
      this.bgcolor = bg;
    }
    lastColor = this.ctx.fillStyle;
    if (this.bgcolor && this.bgcolor !== "transparent") {
      this.ctx.fillStyle = this.bgcolor;
      this.ctx.fillRect(0, 0, this.size.x, this.size.y);
    }   
  };

  return CanvasSpace;

})(Space);

this.CanvasSpace = CanvasSpace;

DOMSpace = (function(superClass) {
  extend(DOMSpace, superClass);

  function DOMSpace(elem, callback, spaceElement) {
    var _selector, isElement;
  }

  DOMSpace.prototype._createElement = function(elem, id) {
    var d;
    if (elem == null) {
      elem = "div";
    }
    d = document.createElement(elem);
    d.setAttribute("id", id);
    return d;
  };

  DOMSpace.prototype._ready = function(callback) {
    if (this.bound) {
      this.updateCSS();
    }
  };
})(Space);

this.DOMSpace = DOMSpace;

Form = (function() {
  function Form(space) {
    this.cc = space.ctx;
    this.cc.fillStyle = '#999';
  }

  Form.context = function(canvas_id) {
    var cc, elem;
    elem = document.getElementById(canvas_id);
    cc = elem && elem.getContext ? elem.getContext('2d') : false;
    return cc;
  };

  Form.line = function(ctx, pair) {
    ctx.beginPath();
    ctx.moveTo(pair.x, pair.y);
    ctx.lineTo(pair.p1.x, pair.p1.y);
    return ctx.stroke();
  };

  Form.point = function(ctx, pt, halfsize, fill, stroke, circle) {
    var x1, x2, y1, y2;
    if (halfsize == null) {
      halfsize = 2;
    }
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = false;
    }
    if (circle == null) {
      circle = false;
    }
    if (circle) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, halfsize, 0, Const.two_pi, false);
    } else {
      x1 = pt.x - halfsize;
      y1 = pt.y - halfsize;
      x2 = pt.x + halfsize;
      y2 = pt.y + halfsize;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1, y2);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2, y1);
      ctx.closePath();
    }
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
    return pt;
  };

  Form.points = function(ctx, pts, halfsize, fill, stroke, circle) {
    var aa, len1, p, results;
    if (halfsize == null) {
      halfsize = 2;
    }
    results = [];
    for (aa = 0, len1 = pts.length; aa < len1; aa++) {
      p = pts[aa];
      results.push(Form.point(ctx, p, halfsize));
    }
    return results;
  };

  Form.prototype.fill = function(c) {
    this.cc.fillStyle = c ? c : "transparent";
    this.filled = !!c;
    return this;
  };

  Form.prototype.stroke = function(c, width, joint, cap) {
    this.cc.strokeStyle = c ? c : "transparent";
    this.stroked = !!c;
    return this;
  };

  Form.prototype.point = function(p, halfsize, isCircle) {
    if (halfsize == null) {
      halfsize = 2;
    }
  
    Form.point(this.cc, p, halfsize);
    return this;
  };

  Form.prototype.points = function(ps, halfsize, isCircle) {
    if (halfsize == null) {
      halfsize = 2;
    }
    Form.points(this.cc, ps, halfsize);
    return this;
  };

  Form.prototype.line = function(p) {
    Form.line(this.cc, p);
    return this;
  };

  return Form;

})();

this.Form = Form;

Point = (function() {
  function Point(args) {
    this.copy(Point.get(arguments));
  }

  Point.get = function(args) {
    if (args.length > 0) {
      if (typeof args[0] === 'object') {
        if (args[0] instanceof Array || args[0].length > 0) {
          return {
            x: args[0][0] || 0,
            y: args[0][1] || 0,
            z: args[0][2] || 0
          };
        } else {
          return {
            x: args[0].x || 0,
            y: args[0].y || 0,
            z: args[0].z || 0
          };
        }
      } else {
        return {
          x: args[0] || 0,
          y: args[1] || 0,
          z: args[2] || 0
        };
      }
    } else {
      return {
        x: 0,
        y: 0,
        z: 0
      };
    }
  };

  Point.prototype.set = function(args) {
    var p;
    p = Point.get(arguments);
    this.x = p.x;
    this.y = p.y;
    this.z = p.z;
    return this;
  };

  Point.prototype.copy = function(p) {
    this.x = p.x;
    this.y = p.y;
    this.z = p.z;
    return this;
  };

  Point.prototype.get2D = function(axis, reverse) {
    if (reverse == null) {
      reverse = false;
    }
    return new this.__proto__.constructor(this);
  };

  return Point;

})();

this.Point = Point;

Vector = (function(superClass) {
  extend(Vector, superClass);

  function Vector() {
    Vector.__super__.constructor.apply(this, arguments);
  }

  Vector.prototype._getArgs = function(args) {
    if (typeof args[0] === 'number' && args.length > 1) {
      return args;
    } else {
      return args[0];
    }
  };

  Vector.prototype.add = function(args) {
    var _p;
    if (typeof arguments[0] === 'number' && arguments.length === 1) {
      this.x += arguments[0];
      this.y += arguments[0];
      this.z += arguments[0];
    } else {
      _p = Point.get(arguments);
      this.x += _p.x;
      this.y += _p.y;
      this.z += _p.z;
    }
    return this;
  };

  Vector.prototype.divide = function(args) {
    var _p;
    if (arguments.length === 1 && (typeof arguments[0] === 'number' || (typeof arguments[0] === 'object' && arguments[0].length === 1))) {
      this.x /= arguments[0];
      this.y /= arguments[0];
      this.z /= arguments[0];
    } 
    return this;
  };

  Vector.prototype.$divide = function(args) {
    var a;
    a = this._getArgs(arguments);
    return new Vector(this).divide(a);
  };

  Vector.prototype.moveBy = function(args) {
    var aa, inc, len1, p, pts;
    inc = Point.get(arguments);
    pts = this.toArray();
    for (aa = 0, len1 = pts.length; aa < len1; aa++) {
      p = pts[aa];
      p.add(inc);
    }
    return this;
  };

  Vector.prototype.rotate2D = function(radian, anchor, axis) {
    var aa, len1, mx, p, pts;
    mx = Matrix.rotateAnchor2D(radian, anchor, axis);
    pts = this.toArray();
    for (aa = 0, len1 = pts.length; aa < len1; aa++) {
      p = pts[aa];
      Matrix.transform2D(p, mx, axis);
    }
    return this;
  };

  Vector.prototype.clone = function() {
    return new Vector(this);
  };
  return Vector;

})(Point);

this.Vector = Vector;


Pair = (function(superClass) {
  extend(Pair, superClass);

  function Pair() {
    Pair.__super__.constructor.apply(this, arguments);
    this.p1 = new Vector(this.x, this.y, this.z);
    if (arguments.length === 4) {
      this.z = 0;
      this.p1.set(arguments[2], arguments[3]);
    } else if (arguments.length === 6) {
      this.p1.set(arguments[3], arguments[4], arguments[5]);
    }
  }

  Pair.prototype.to = function() {
    this.p1 = new Vector(Point.get(arguments));
    return this;
  };


  Pair.prototype.collinear = function(point) {
    return (this.p1.x - this.x) * (point.y - this.y) - (point.x - this.x) * (this.p1.y - this.y);
  };

  Pair.prototype.clone = function() {
    var p;
    p = new Pair(this);
    p.to(this.p1.clone());
    return p;
  };

  Pair.prototype.toArray = function() {
    return [this, this.p1];
  };

  return Pair;

})(Vector);

this.Pair = Pair;
//# sourceMappingURL=pt.js.map