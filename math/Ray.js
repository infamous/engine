/**
 * Pulled from Three.js @author bhouston / http://exocortex.com
 */
var Vec3 = require('./Vec3');


var Ray = function ( origin, direction ) {

	this.origin = ( origin !== undefined ) ?  new Vec3(origin[0],origin[1],origin[2]) : new Vec3();
	this.direction = ( direction !== undefined ) ? new Vec3(direction[0],direction[1],direction[2]) : new Vec3();

};

Ray.prototype.set = function ( origin, direction ) {

		this.origin.copy( origin );
		this.direction.copy( direction );

		return this;

};

Ray.prototype.copy = function ( ray ) {

		this.origin.copy( ray.origin );
		this.direction.copy( ray.direction );

		return this;

};

Ray.prototype.recast = function () {

		var v1 = new Vec3();

		return function ( t ) {

			this.origin.copy( this.at( t, v1 ) );

			return this;

		};

};

Ray.prototype.intersectSphere = function(center, radius) {

  var tmp = new Vec3(0,0,0);
  var c = new Vec3(center[0],center[1],center[2]);
  var out = new Vec3(0,0,0);
  tmp = c.subtract(this.origin);

  var len = tmp.dot(this.direction);
  if (len < 0) { // sphere is behind ray
    return null
  }

  tmp.scaleAndAdd(this.origin, this.direction, len);

  var dSq = tmp.squaredDistance(c);
  var rSq = radius * radius;
  if (dSq > rSq) {
    return null
  }

  out = this.direction.scale(len - Math.sqrt(rSq - dSq));
  return out.add(out, this.origin, out);

};

Ray.prototype.equals = function ( ray ) {

		return ray.origin.equals( this.origin ) && ray.direction.equals( this.direction );

};

Ray.prototype.clone = function () {

		return new Ray().copy( this );

};


module.exports = Ray;
