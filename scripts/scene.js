
class Scene {
  constructor () {
    this.objects = this._create()
  }
  intersect (ray) {
    let closest = { object: undefined, distance: Infinity }
    for (let sphere of this.objects) {
      let dist = sphere.intersectionDistance(ray)
      if (dist > 1e-6 && dist < closest.distance) { // TODO: pass minimum dist / bias as arg
        closest = { object: sphere, distance: dist }
      }
    }
    if (!closest.object) return {}
    const point = ray.origin.plus(ray.direction.scaledBy(closest.distance))
    const normal = point.minus(closest.object.center).normalized
    const normal1 = normal.dot(ray.direction) < 0 ? normal : normal.scaledBy(-1)
    const entering = normal.dot(normal1) > 0
    return { hit: point, normal, material: closest.object.material }
  }
  background (ray) {
    return new Vector3()
  }
  _create () {
    return []
  }
}
