/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

import { Transitionable } from '../transitions/Transitionable';
import { Quaternion } from '../math/Quaternion';

var Q_REGISTER = new Quaternion();
var Q2_REGISTER = new Quaternion();

class Vec3Transitionable {
  constructor(x, y, z, transform) {
    this._transform = transform;
    this._dirty = false;
    this.x = new Transitionable(x);
    this.y = new Transitionable(y);
    this.z = new Transitionable(z);
    this._values = {
      x: x,
      y: y,
      z: z
    };
  }

  get() {
    this._values.x = this.x.get();
    this._values.y = this.y.get();
    this._values.z = this.z.get();
    return this._values;
  };

  set(x, y, z, options, callback) {
    if (!this._transform._dirty) {
      this._transform._node.requestUpdate(this._transform._id);
      this._transform._dirty = true;
    }
    this._dirty = true;

    var cbX = null;
    var cbY = null;
    var cbZ = null;

    if (z != null)
      cbZ = callback;else if (y != null)
      cbY = callback;else if (x != null)
      cbX = callback;

    if (x != null) this.x.set(x, options, cbX);
    if (y != null) this.y.set(y, options, cbY);
    if (z != null) this.z.set(z, options, cbZ);

    return this;
  };

  isActive() {
    return this.x.isActive() || this.y.isActive() || this.z.isActive();
  };

  pause() {
    this.x.pause();
    this.y.pause();
    this.z.pause();
    return this;
  };

  resume() {
    this.x.resume();
    this.y.resume();
    this.z.resume();
    return this;
  };

  halt() {
    this.x.halt();
    this.y.halt();
    this.z.halt();
    return this;
  };

}

class QuatTransitionable {
  constructor(x, y, z, w, transform) {
    this._transform = transform;
    this._dirty = false;
    this._t = new Transitionable([x, y, z, w]);
  }

  get() {
    return this._t.get();
  };


  set(x, y, z, w, options, callback) {
    if (!this._transform._dirty) {
      this._transform._node.requestUpdate(this._transform._id);
      this._transform._dirty = true;
    }
    this._dirty = true;

    options.method = 'slerp';
    this._t.set([x, y, z, w], options, callback);
  };


  isActive() {
    return this._t.isActive();
  };

  pause() {
    this._t.pause();
    return this;
  };

  resume() {
    this._t.resume();
    return this;
  };

  halt() {
    this._dirty = false;
    this._t.halt();
    return this;
  };

}

class Transform {
  constructor(node) {
    this._node = node;
    this._id = node.addComponent(this);
    this.origin = null;
    this.mountPoint = null;
    this.align = null;
    this.scale = null;
    this.position = null;
    this.rotation = null;

    this._dirty = false;
  }

  toString() {
    return 'Transform';
  };

  getValue() {
    return {
      component: this.toString(),
      origin: this.origin && this.origin.get(),
      mountPoint: this.mountPoint && this.mountPoint.get(),
      align: this.align && this.align.get(),
      scale: this.scale && this.scale.get(),
      position: this.position && this.position.get(),
      rotation: this.rotation && this.rotation.get()
    };
  };

  setState(state) {
    if (this.toString() === state.component) {
      if (state.origin) {
        this.setOrigin(state.origin.x, state.origin.y, state.origin.z);
      }
      if (state.mountPoint) {
        this.setMountPoint(state.mountPoint.x, state.mountPoint.y, state.mountPoint.z);
      }
      if (state.align) {
        this.setAlign(state.align.x, state.align.y, state.align.z);
      }
      if (state.scale) {
        this.setScale(state.scale.x, state.scale.y, state.scale.z);
      }
      if (state.position) {
        this.setPosition(state.position.x, state.position.y, state.position.z);
      }
      if (state.rotation) {
        this.setRotation(state.rotation.x, state.rotation.y, state.rotation.z, state.rotation.w);
      }
      return true;
    }
    return false;
  };

  setOrigin(x, y, z, options, callback) {
    if (!this.origin) {
      var v = this._node.getOrigin();
      this.origin = new Vec3Transitionable(v[0], v[1], v[2], this);
    }
    this.origin.set(x, y, z, options, callback);
    return this;
  };

  setMountPoint(x, y, z, options, callback) {
    if (!this.mountPoint) {
      var v = this._node.getMountPoint();
      this.mountPoint = new Vec3Transitionable(v[0], v[1], v[2], this);
    }
    this.mountPoint.set(x, y, z, options, callback);
    return this;
  };

  setAlign(x, y, z, options, callback) {
    if (!this.align) {
      var v = this._node.getAlign();
      this.align = new Vec3Transitionable(v[0], v[1], v[2], this);
    }
    this.align.set(x, y, z, options, callback);
    return this;
  };

  setScale(x, y, z, options, callback) {
    if (!this.scale) {
      var v = this._node.getScale();
      this.scale = new Vec3Transitionable(v[0], v[1], v[2], this);
    }
    this.scale.set(x, y, z, options, callback);
    return this;
  };

  setPosition(x, y, z, options, callback) {
    if (!this.position) {
      var v = this._node.getPosition();
      this.position = new Vec3Transitionable(v[0], v[1], v[2], this);
    }
    this.position.set(x, y, z, options, callback);
    return this;
  };

  translate(x, y, z, options, callback) {
    if (!this.position) {
      var v = this._node.getPosition();
      this.position = new Vec3Transitionable(v[0], v[1], v[2], this);
    }
    var p = this.position;
    var xq = p.x._queue;
    var yq = p.y._queue;
    var zq = p.z._queue;
    var xEnd = x == null ? null : x + (xq.length > 0 ? xq[xq.length - 5] : p.x._state);
    var yEnd = y == null ? null : y + (yq.length > 0 ? yq[yq.length - 5] : p.y._state);
    var zEnd = z == null ? null : z + (zq.length > 0 ? zq[zq.length - 5] : p.z._state);
    this.position.set(xEnd, yEnd, zEnd, options, callback);
    return this;
  };

  setRotation(x, y, z, w, options, callback) {
    if (!this.rotation) {
      var v = this._node.getRotation();
      this.rotation = new QuatTransitionable(v[0], v[1], v[2], v[3], this);
    }
    var q = Q_REGISTER;
    if (typeof w === 'number') {
      q.set(w, x, y, z);
    } else {
      q.fromEuler(x, y, z);
      callback = options;
      options = w;
    }
    this.rotation.set(q.x, q.y, q.z, q.w, options, callback);
    return this;
  };

  rotate(x, y, z, w, options, callback) {
    if (!this.rotation) {
      var v = this._node.getRotation();
      this.rotation = new QuatTransitionable(v[0], v[1], v[2], v[3], this);
    }
    var queue = this.rotation._t._queue;
    var len = queue.length;
    var referenceQ;
    var arr;
    if (len !== 0)
      arr = queue[len - 5];
    else
      arr = this.rotation._t._state;
    referenceQ = Q2_REGISTER.set(arr[3], arr[0], arr[1], arr[2]);

    var rotQ = Q_REGISTER;
    if (typeof w === 'number') {
      rotQ.set(w, x, y, z);
    } else {
      rotQ.fromEuler(x, y, z);
      callback = options;
      options = w;
    }

    var q = referenceQ.multiply(rotQ);
    this.rotation.set(q.x, q.y, q.z, q.w, options, callback);
    return this;
  };

  clean() {
    var node = this._node;
    var c;
    var isDirty = false;
    if ((c = this.origin) && c._dirty) {
      node.setOrigin(c.x.get(), c.y.get(), c.z.get());
      c._dirty = c.isActive();
      isDirty = isDirty || c._dirty;
    }
    if ((c = this.mountPoint) && c._dirty) {
      node.setMountPoint(c.x.get(), c.y.get(), c.z.get());
      c._dirty = c.isActive();
      isDirty = isDirty || c._dirty;
    }
    if ((c = this.align) && c._dirty) {
      node.setAlign(c.x.get(), c.y.get(), c.z.get());
      c._dirty = c.isActive();
      isDirty = isDirty || c._dirty;
    }
    if ((c = this.scale) && c._dirty) {
      node.setScale(c.x.get(), c.y.get(), c.z.get());
      c._dirty = c.isActive();
      isDirty = isDirty || c._dirty;
    }
    if ((c = this.position) && c._dirty) {
      node.setPosition(c.x.get(), c.y.get(), c.z.get());
      c._dirty = c.isActive();
      isDirty = isDirty || c._dirty;
    }
    if ((c = this.rotation) && c._dirty) {
      var q = c.get();
      node.setRotation(q[0], q[1], q[2], q[3]);
      c._dirty = c.isActive();
      isDirty = isDirty || c._dirty;
    }
    if (isDirty) this._node.requestUpdateOnNextTick(this._id);
    else
      this._dirty = false;
  };

  onUpdate() {
    return this.clean()
  };

}

export { Transform };
