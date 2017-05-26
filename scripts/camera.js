class Camera {
  constructor ({ position = new Vector3(), direction = new Vector3(0, 0, -1), fov = 40 }) {
    const fovRadians = fov * Math.PI / 180
    this._zoom = Math.tan(fovRadians / 2)
    this.fov = fov
    this.position = position
    this.direction = direction
  }
  ray (x, y, width, height) {
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