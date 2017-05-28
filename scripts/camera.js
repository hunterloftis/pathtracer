class Camera {
  constructor ({ position = new Vector3(), direction = new Vector3(0, 0, -1) }) {
    this.position = position
    this.direction = direction
    this.sensor = 0.024         // full frame format (36x24mm)
    this.focalLength = 0.055    // 55mm lens
    this.focus = 1.0281
    this.imageDistance = this.focalLength * this.focus + 1E-6  // distance from lens to sensor
    this.objectDistance = -1 / (1 / this.focalLength - 1 / this.imageDistance)
    this.fStop = 1.4
    this.aperture = this.focalLength / this.fStop
  }
  ray (x, y, width, height) {
    const origin = new Vector3()

    // find the physical point ("pixel") on the sensor
    const aspect = width / height
    const vx = ((x + Math.random()) / width - 0.5) * aspect
    const vy = (y + Math.random()) / height - 0.5
    const sensorX = -vx * this.sensor
    const sensorY = vy * this.sensor
    const sensorPoint = new Vector3(sensorX, sensorY, this.imageDistance)
  
    // find the ideal ray this would create through a pinhole aperture
    const sensorToLens = origin.minus(sensorPoint)
    const lensWorldRay = new Ray3(origin, sensorToLens.normalized)
    
    // find where this perfect ray intersects the focus plane ("object distance")
    const focusRatio = this.objectDistance / lensWorldRay.direction.z
    const focusPoint = lensWorldRay.direction.scaledBy(focusRatio)

    // find a random point somewhere within the aperture on the lens
    const apertureOffset = this._pointInAperture()
    const aperturePoint = new Vector3(apertureOffset.x, apertureOffset.y, 0)

    // create a ray from this point in the aperture to the focus point
    const apertureToFocus = focusPoint.minus(aperturePoint)
    const apertureWorldRay = new Ray3(aperturePoint, apertureToFocus.normalized)

    // debugger

    return apertureWorldRay
  }
  // http://mathworld.wolfram.com/DiskPointPicking.html
  _pointInAperture () {
    const rMax = this.aperture / 2
    const r = Math.sqrt(Math.random() * rMax * rMax)
    const angle = Math.random() * Math.PI * 2
    const x = r * Math.cos(angle)
    const y = r * Math.sin(angle)
    return { x, y }
  }
}