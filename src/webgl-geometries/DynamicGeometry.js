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

import { Geometry } from './Geometry';

/**
 * DynamicGeometry is a component that defines and manages data
 * (vertex data and attributes) that is used to draw to WebGL.
 *
 * @class DynamicGeometry
 * @constructor
 *
 * @param {Object} options instantiation options
 * @return {undefined} undefined
 */
class DynamicGeometry extends Geometry {
  constructor(options) {
    super(options);

    this.spec.dynamic = true;
  }

  /**
   * Returns the number of attribute values used to draw the DynamicGeometry.
   *
   * @class DynamicGeometry
   * @constructor
   *
   * @return {Object} flattened length of the vertex positions attribute in the geometry.
   */
  getLength() {
    return this.getVertexPositions().length;
  };

  /**
   * Gets the buffer object based on buffer name. Throws error
   * if bufferName is not provided.
   *
   * @method
   *
   * @param  {String}  bufferName     name of vertexBuffer to be retrieved.
   * @return {Object}                 value of buffer with corresponding bufferName.
   */
  getVertexBuffer(bufferName) {
    if (!bufferName)
      throw 'getVertexBuffer requires a name';

    var idx = this.spec.bufferNames.indexOf(bufferName);

    if (~idx) return this.spec.bufferValues[idx];
    else
      throw 'buffer does not exist';
  };

  /**
   * Sets a vertex buffer with given name to input value. Registers a new
   * buffer if one does not exist with given name.
   *
   * @method
   * @param  {String} bufferName  Name of vertexBuffer to be set.
   * @param  {Array}  value       Input data to fill target buffer.
   * @param  {Number} size        Vector size of input buffer data.
   * @return {Object}             current geometry.
   */
  setVertexBuffer(bufferName, value, size) {
    var idx = this.spec.bufferNames.indexOf(bufferName);

    if (idx === -1) {
      idx = this.spec.bufferNames.push(bufferName) - 1;
    }

    this.spec.bufferValues[idx] = value || [];
    this.spec.bufferSpacings[idx] = size || this.DEFAULT_BUFFER_SIZE;

    if (this.spec.invalidations.indexOf(idx) === -1) {
      this.spec.invalidations.push(idx);
    }

    return this;
  };

  /**
   * Copies and sets all buffers from another geometry instance.
   *
   * @method
   *
   * @param  {Object} geometry    Geometry instance to copy buffers from.
   * @return {Object}             current geometry.
   */
  fromGeometry(geometry) {
    var len = geometry.spec.bufferNames.length;
    for (var i = 0; i < len; i++) {
      this.setVertexBuffer(
        geometry.spec.bufferNames[i],
        geometry.spec.bufferValues[i],
        geometry.spec.bufferSpacings[i]);
    }
    return this;
  };

  /**
   * Set the positions of the vertices in this geometry.
   *
   * @method
   * @param  {Array}     value   New value for vertex position buffer
   * @return {Object}            current geometry.
   */
  setVertexPositions(value) {
    return this.setVertexBuffer('a_pos', value, 3);
  };

  /**
   * Set the normals on this geometry.
   *
   * @method
   * @param  {Array}     value   Value to set normal buffer to.
   * @return {Object}            current geometry.
   */
  setNormals(value) {
    return this.setVertexBuffer('a_normals', value, 3);
  };

  /**
   * Set the texture coordinates on this geometry.
   *
   * @method
   * @param  {Array}     value   New value for texture coordinates buffer.
   * @return {Object}            current geometry.
   */
  setTextureCoords(value) {
    return this.setVertexBuffer('a_texCoord', value, 2);
  };

  /**
   * Set the texture coordinates on this geometry.
   * @method
   * @param  {Array}     value   New value for index buffer
   * @return {Object}            current geometry.
   */
  setIndices(value) {
    return this.setVertexBuffer('indices', value, 1);
  };

  /**
   * Set the WebGL drawing primitive for this geometry.
   *
   * @method
   * @param  {String} value  New drawing primitive for geometry
   * @return {Object}        current geometry.
   */
  setDrawType(value) {
    this.spec.type = value.toUpperCase();
    return this;
  };

  /**
   * Returns the 'pos' vertex buffer of the geometry.
   *
   * @method
   * @return {Array} Vertex buffer.
   */
  getVertexPositions() {
    return this.getVertexBuffer('a_pos');
  };

  /**
   * Returns the 'normal' vertex buffer of the geometry.
   * @method
   * @return {Array} Vertex Buffer.
   */
  getNormals() {
    return this.getVertexBuffer('a_normals');
  };

  /**
   * Returns the 'textureCoord' vertex buffer of the geometry.
   * @method
   * @return {Array} Vertex Buffer.
   */
  getTextureCoords() {
    return this.getVertexBuffer('a_texCoord');
  };

}

export { DynamicGeometry };
