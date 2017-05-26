class Sphere {
  constructor (center, radius, material) {
    this.center = center
    this.radius = radius
    this.material = material
  }
  // http://tfpsly.free.fr/english/index.html?url=http://tfpsly.free.fr/english/3d/Raytracing.html
  intersectionDistance (ray) {
    const BIAS = 1e-6 // TODO: make this an argument (this is the minimum distance)
    const op = this.center.minus(ray.origin);
    const b = op.dot(ray.direction);
    const det = b * b - op.dot(op) + this.radius * this.radius;
    if (det < 0) return Infinity;
    const detRoot = Math.sqrt(det);
    const t1 = b - detRoot;
    if (t1 > BIAS) return t1;
    const t2 = b + detRoot;
    if (t2 > BIAS) return t2;
    return Infinity;
  }
}
