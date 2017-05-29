class Tracer {
  constructor ({ canvas, scene, bounces, camera, gamma = 2.2}) {
    Object.assign(this, { scene, bounces, gamma })
    this.width = canvas.width
    this.height = canvas.height
    this.buffer = new Uint32Array(this.width * this.height * 4).fill(0)
    this.context = canvas.getContext('2d')
    this.imageData = this.context.getImageData(0, 0, this.width, this.height)
    this.pixels = this.imageData.data.fill(255)
    this.paths = 0
    this._camera = camera || new Camera({ fov: 40 })
    this._black = new Vector3()
    this._lastPixel = { x: 0, y: 0 }
    this.context.fillStyle = '#fff'
  }
  exposeRandom() {
    const x = Math.floor(Math.random() * this.width)
    const y = Math.floor(Math.random() * this.height)
    this.expose({ x, y })
  }
  exposeNext() {
    const index = this.paths % (this.width * this.height)
    const x = index % this.width
    const y = Math.floor(index / this.width)
    this.expose({ x, y })
  }
  expose (pixel) {
    const ray = this._camera.ray(pixel.x, pixel.y, this.width, this.height)
    const rgb = this._trace(ray, this.bounces).array
    const index = (pixel.x + pixel.y * this.width) * 4
    const exposures = ++this.buffer[index + 3]
    for (let i = 0; i < 3; i++) {
      this.buffer[index + i] += rgb[i]
      this.pixels[index + i] = this._gamma(this.buffer[index + i] / exposures)
    }
    this.paths++
    this._lastPixel = pixel
  }
  draw (debug = false) {
    this.context.putImageData(this.imageData, 0, 0)
    if (debug) this.context.fillRect(0, this._lastPixel.y, this.width, 1)
  }
  _gamma (brightness) {
    return Math.pow(brightness / 255, (1 / this.gamma)) * 255
  }
  _trace (ray, bounces, strength = 1) {
    const terminate = bounces < 0 || Math.random() > strength
    if (terminate) return this._black

    const gain = 1 / strength
    const { hit, normal, material } = this.scene.intersect(ray)
    if (!hit) return this.scene.background(ray).scaledBy(gain)

    if (!ray.direction.enters(normal)) {
      const direction = ray.direction.refracted(normal.scaledBy(-1), material.refraction, 1)
      const refractedRay = new Ray3(hit, direction)
      return this._trace(refractedRay, bounces - 1, strength).scaledBy(gain)
    }

    const bsdf = material.bsdf(ray.direction, normal)
    return bsdf.samples.reduce(traceSamples.bind(this), bsdf.emit).scaledBy(gain)

    function traceSamples(totalLight, sample) {
      const sampleRay = new Ray3(hit, sample.direction)
      const sampleLight = this._trace(sampleRay, bounces - 1, sample.energy.max * strength)
      const luminosity = sample.energy.scaledBy(sample.pdf)
      return totalLight.plus(sampleLight.scaledBy(luminosity))
    }
  }
}
