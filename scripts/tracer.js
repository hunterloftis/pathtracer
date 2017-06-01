class Tracer {
  constructor ({ canvas, scene, bounces, camera, gamma = 2.2}) {
    Object.assign(this, { scene, bounces, gamma })
    this.width = canvas.width
    this.height = canvas.height
    this.buffer = new Float32Array(this.width * this.height * 4).fill(0)
    this.context = canvas.getContext('2d')
    this.imageData = this.context.getImageData(0, 0, this.width, this.height)
    this.pixels = this.imageData.data.fill(0)
    this._camera = camera || new Camera({ fov: 40 })
    this._black = new Vector3()
    this._gamma = this._gamma.bind(this)
    for (let i = 3; i < this.pixels.length; i += 4) this.pixels[i] = 255
  }
  exposeRandom() {
    const x = Math.floor(Math.random() * this.width)
    const y = Math.floor(Math.random() * this.height)
    this.expose({ x, y })
  }
  expose (pixel) {
    const ray = this._camera.ray(pixel.x, pixel.y, this.width, this.height)
    const rgb = this._trace(ray, this.bounces).array
    const index = (pixel.x + pixel.y * this.width) * 4
    const exposures = ++this.buffer[index + 3]
    const average = new Float32Array(3)
    for (let i = 0; i < 3; i++) {
      this.buffer[index + i] += rgb[i]
      average[i] = this.buffer[index + i] / exposures
    }
    this.pixels.set(this._mapped(average), index)
  }
  draw () {
    this.context.putImageData(this.imageData, 0, 0)
  }
  _mapped (rgb) {
    // TODO: HDR tonemapping here (exposure mapping?)
    return rgb.map(this._gamma)
  }
  _gamma (brightness) {
    return Math.pow(brightness / 255, (1 / this.gamma)) * 255
  }
  _trace (ray, bounces, strength = 1) {
    const terminate = bounces < 0 || Math.random() > strength
    if (terminate) return this._black

    const gain = 1 / strength
    const { hit, normal, material, distance } = this.scene.intersect(ray)
    if (!hit) return this.scene.background(ray).scaledBy(gain)

    const bsdf = material.bsdf(ray.direction, normal, distance)
    const combinedLight = bsdf.samples.reduce(combineSamples.bind(this), bsdf.emit)
    return combinedLight.scaledBy(gain)

    function combineSamples(totalLight, sample) {
      const sampleRay = new Ray3(hit, sample.direction)
      const sampleLight = this._trace(sampleRay, bounces - 1, sample.energy.max * strength)
      const luminosity = sample.energy.scaledBy(sample.pdf)
      return totalLight.plus(sampleLight.scaledBy(luminosity))
    }
  }
}
