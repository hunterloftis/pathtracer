class Vector3 {
  constructor (x, y, z) {
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0
  }
  clone (v) {
    return new Vector3(v.x, v.y, v.z)
  }
  dot (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }
  plus (v) {
    if (v instanceof Vector3) return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
    return new Vector3(this.x + v, this.y + v, this.z + v)
  }
  minus (v) {
    if (v instanceof Vector3) return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
    return new Vector3(this.x - v, this.y - v, this.z - v)
  }
  scaledBy (v) {
    if (v instanceof Vector3) return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z)
    return new Vector3(this.x * v, this.y * v, this.z * v)
  }
  dividedBy (v) {
    if (v instanceof Vector3) return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z)
    return new Vector3(this.x / v, this.y / v, this.z / v)
  }
  reflected (normal) {
    const cos = normal.dot(this)
    return this.minus(normal.scaledBy(2 * cos)).normalized  // TODO: normalized necessary?
  }
  // http://asawicki.info/news_1301_reflect_and_refract_functions.html
  refracted (normal, exteriorIndex, interiorIndex) {
    const ratio = exteriorIndex / interiorIndex
    const nDotI = normal.dot(this)
    const k = 1 - ratio * ratio * (1 - nDotI * nDotI)
    if (k < 0) return null
    // if (k < 0) return this.reflected(normal.scaledBy(-1))  // total internal reflection. something like this.
    const offset = normal.scaledBy(ratio * nDotI + Math.sqrt(k))
    return this.scaledBy(ratio).minus(offset).normalized  // TODO: normalized necessary?
  }
  equals (v) {
    return this.x === v.x && this.y === v.y && this.z === v.z
  }
  floor (n) {
    return new Vector3(this.x < n ? n : this.x, this.y < n ? n : this.y, this.z < n ? n : this.z)
  }
  // https://math.stackexchange.com/questions/1461038/how-exactly-does-the-sign-of-the-dot-product-determine-the-angle-between-two-vec
  enters (normal) {
    return normal.dot(this) < 0
  }
  get length () {
    return Math.sqrt(this.dot(this))
  }
  get array () {
    return [this.x, this.y, this.z]
  }
  get normalized () {
    return this.dividedBy(this.length)
  }
  get randomInHemisphere () {
    const rand = Vector3.randomInSphere
    return this.dot(rand) > 0 ? rand : rand.scaledBy(-1)
  }
  get max () {
    return Math.max(this.x, this.y, this.z)
  }
  get min () {
    return Math.min(this.x, this.y, this.z)
  }
  add (v) {
    if (v instanceof Vector3) { this.x += v.x; this.y += v.y; this.z += v.z }
    else { this.x += v; this.y += v; this.z += v }
    return this
  }
  static sum (...vectors) {
    return vectors.reduce((total, v) => total.add(v), new Vector3())
  }
  static fromAngles (theta, phi) {
    return new Vector3(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi))
  }
  static get randomInSphere () {
    return Vector3.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1))
  }
}
