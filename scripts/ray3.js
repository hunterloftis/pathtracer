class Ray3 {
  constructor (origin, direction) {
    this.origin = origin
    this.direction = direction
  }
  reflected (origin, normal) {
    const cos = normal.dot(this.direction)
    const direction = this.direction.minus(normal.scaledBy(2 * cos))
    return new Ray3(origin, direction)
  }
  // http://asawicki.info/news_1301_reflect_and_refract_functions.html
  refracted (normal, index) {
    const eta = index
    const nDotI = normal.dot(this.direction)
    const k = 1 - eta * eta * (1 - nDotI * nDotI)
    if (k < 0) return null
    const newDirection = this.direction.scaledBy(eta).minus(normal.scaledBy(eta * nDotI + Math.sqrt(k)))
    const newOrigin = this.origin.plus(this.direction.scaledBy(BIAS * 2))
    return new Ray3(newOrigin, newDirection)
  }
}
