class Camera {
  constructor ({ position = new Vector3(), direction = new Vector3(0, 0, -1) }) {
    this.position = position
    this.direction = direction
    this.focalLength = 0.035 // 35mm
    this.sensor = 0.024 // full frame height
    this.fStop = 5.6
    this.aperture = this.focalLength / this.fStop
  }
  ray (x, y, width, height) {
    const aspect = width / height
    const vx = x / width * aspect - 0.5
    const vy = y / height - 0.5
    const sensorX = -vx * this.sensor
    const sensorY = vy * this.sensor
    const sensor = new Vector3(sensorX, sensorY, this.focalLength)
    const sensorToLens = this.position.minus(sensor)
    const lensToWorld = new Ray3(this.position, sensorToLens.normalized)
    return lensToWorld
  }
  rayPinhole (x, y, width, height) {
    const aspect = width / height
    const viewX = (x + Math.random()) / width  // map pixel X to 0:1 with random jitter
    const viewY = (y + Math.random()) / height // map pixel Y to 0:1 with random jitter
    const screenX = (2 * viewX - 1) * aspect;  // map 0:1 to -aspect:aspect
    const screenY = (2 * viewY - 1) * -1;  // map 0:1 to 1:-1
    const direction = new Vector3(screenX * this._zoom, screenY * this._zoom, -1).normalized;
    // TODO: rotate direction by angular delta between direction and (0, 0, -1)
    return new Ray3(this.position, direction)
  }
}