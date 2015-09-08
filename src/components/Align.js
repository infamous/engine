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

import { Position } from './Position';

/**
 * Align is a component designed to allow for smooth tweening
 * of the alignment of a node relative to its parent.
 *
 * @class Align
 * @augments Position
 *
 * @param {Node} node Node that the Align component will be attached to
 */
class Align extends Position {
  constructor(node) {
    super(node);

    var initial = node.getAlign();

    this._x.set(initial[0]);
    this._y.set(initial[1]);
    this._z.set(initial[2]);

    this.onUpdate = this.constructor.update;

  }

  /**
   * Return the name of the Align component
   *
   * @method
   *
   * @return {String} Name of the component
   */
  toString() {
    return 'Align';
  };

  /**
   * When the node this component is attached to updates, update the value
   * of the Node's align.
   *
   * @method
   *
   * @return {undefined} undefined
   */
  update() {
    this._node.setAlign(this._x.get(), this._y.get(), this._z.get());
    this._checkUpdate();
  };

}

export { Align };
