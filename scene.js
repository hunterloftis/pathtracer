class Scene {
  constructor () {
    this.objects = this._create()
    console.log('objects:', this.objects)
  }
  intersect (ray) {
    let closest = this.objects.reduce((closest, sphere) => {
      let dist = sphere.intersectionDistance(ray)
      return dist < closest.distance
        ? { object: sphere, distance: dist }
        : closest
    }, { object: undefined, distance: Infinity })
    if (!closest.object) return

    const bias = ray.direction.scaledBy(-BIAS)
    const point = ray.origin.plus(ray.direction.scaledBy(closest.distance).plus(bias))
    const normal = point.minus(closest.object.center).normalized
    const normal1 = normal.dot(ray.direction) < 0 ? normal : normal.scaledBy(-1)
    const entering = normal.dot(normal1) > 0
    return Object.assign(closest, { point, normal, normal1, entering })
  }
  background (ray) {
    return new Vector3()
  }
  _create () {
    return []
  }
}
