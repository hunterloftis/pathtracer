class Camera {
  constructor ({ position, direction, sensor, lens, focus, fStop, horizontalAngle, verticalAngle }) {
    this.position = position || new Vector3()
    this.direction = direction || new Vector3(0, 0, -1)
    this.sensor = 0.024         // full frame format (36x24mm)
    this.focalLength = 0.075    // 55mm lens
    this.imageDistance = 0.0754  // distance from lens to sensor
    this.objectDistance = -1 / (1 / this.focalLength - 1 / this.imageDistance)
    this.fStop = 1.4
    this.aperture = this.focalLength / this.fStop
    this.verticalAngle = verticalAngle || 0
    this.horizontalAngle = horizontalAngle || 0
    this._xAxis = new Vector3(-1, 0, 0)
    this._yAxis = new Vector3(0, -1, 0)
    console.log(this.imageDistance, this.focalLength, this.objectDistance)

  }
  ray (x, y, width, height) {
    const sensorPoint = this._sensorPoint(x, y, width, height)
    const focusPoint = this._focusPoint(sensorPoint)
    const aperturePoint = this._aperturePoint()
    const direction = focusPoint.minus(aperturePoint).normalized
    return new Ray3(this.position, this._rotated(direction))
  }
  _rotated (direction) {
    const direction1 = direction.angleAxis(this.verticalAngle, this._xAxis)
    return direction1.angleAxis(this.horizontalAngle, this._yAxis)
  }
  _focusPoint(sensorPoint) {
    const origin = new Vector3()
    const sensorToLens = origin.minus(sensorPoint)
    const lensWorldRay = new Ray3(origin, sensorToLens.normalized)
    const focusRatio = this.objectDistance / lensWorldRay.direction.z
    return lensWorldRay.direction.scaledBy(focusRatio)
  }
  _sensorPoint (x, y, width, height) {
    const aspect = width / height
    const vx = ((x + Math.random()) / width - 0.5) * aspect
    const vy = (y + Math.random()) / height - 0.5
    const sensorX = -vx * this.sensor
    const sensorY = vy * this.sensor
    return new Vector3(sensorX, sensorY, this.imageDistance)
  }
  // http://mathworld.wolfram.com/DiskPointPicking.html
  _aperturePoint () {
    const rMax = this.aperture / 2
    const r = Math.sqrt(Math.random() * rMax * rMax)
    const angle = Math.random() * Math.PI * 2
    const x = r * Math.cos(angle)
    const y = r * Math.sin(angle)
    return new Vector3(x, y, 0)
  }
}