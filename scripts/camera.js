class Camera {
  constructor ({ position, direction, sensor, lens, focus, fStop }) {
    this.position = position || new Vector3()
    this.direction = direction || new Vector3(0, 0, -1)
    this.sensor = sensor || 0.024                   // full frame format (36x24mm)
    this.focalLength = lens || 0.055         // 55mm lens
    this.objectDistance = -focus || -2      // focus on objects 2 meters from the lens
    this.fStop = fStop || 1.4                       // wide-open aperture
    this.aperture = this.focalLength / this.fStop
    this.imageDistance = 1 / (1 / this.focalLength - 1 / this.objectDistance)
    this.xDegrees = 30
    this.yDegrees = 10
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
    const direction = focusPoint.minus(aperturePoint).normalized
    // const apertureWorldRay = new Ray3(aperturePoint, apertureToFocus.normalized)

    // transform to the camera's origin and direction
    // https://matthew-brett.github.io/teaching/rotation_2d.html
    const xRad = this.xDegrees * Math.PI / 180
    const yRad = this.yDegrees * Math.PI / 180
    const z2 = direction.z * Math.cos(xRad) - direction.y * Math.sin(xRad)
    const y2 = direction.z * Math.sin(xRad) + direction.y * Math.cos(xRad)
    const rotatedDirection = new Vector3(direction.x, y2, z2)

    return new Ray3(this.position, rotatedDirection)
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