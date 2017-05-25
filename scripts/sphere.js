class Sphere {
  constructor (center, radius, material) {
    this.center = center
    this.radius = radius
    this.material = material
  }
  intersectionDistance (ray) {
    const op = this.center.minus(ray.origin);
    const b = op.dot(ray.direction);
    const det = b * b - op.dot(op) + this.radius * this.radius;
    if (det < 0) return Infinity;
    const detRoot = Math.sqrt(det);
    const t1 = b - detRoot;
    if (t1 > 0) return t1;
    const t2 = b + detRoot;
    if (t2 > 0) return t2;
    return Infinity;
  }
}
