class Tracer {
  constructor ({ canvas, scene, bounces, camera, gamma = 2.2}) {
    Object.assign(this, { scene, bounces, gamma })
    this.width = canvas.width
    this.height = canvas.height
    this.buffer = new Float64Array(this.width * this.height * 4).fill(0)
    this.context = canvas.getContext('2d')
    this.imageData = this.context.getImageData(0, 0, this.width, this.height)
    this.pixels = this.imageData.data.fill(0)
    this._camera = camera || new Camera({ fov: 40 })
    this._black = new Vector3()
    this._gamma = this._gamma.bind(this)
    for (let i = 3; i < this.pixels.length; i += 4) this.pixels[i] = 255
    this._totalExposureTime = 0
    this.exposures = 0
  }
  expose () {
    const start = performance.now()
    const index = this.exposures % (this.width * this.height)
    const pixel = { x: index % this.width, y: Math.floor(index / this.width) }
    const rgb = this._trace(pixel).array
    const rgbaIndex = (pixel.x + pixel.y * this.width) * 4
    const exposures = ++this.buffer[rgbaIndex + 3]
    const average = new Float32Array(3)
    for (let i = 0; i < 3; i++) {
      this.buffer[rgbaIndex + i] += rgb[i]
      average[i] = this.buffer[rgbaIndex + i] / exposures
    }
    this.pixels.set(this._mapped(average), rgbaIndex)
    this.exposures++
    this._totalExposureTime += performance.now() - start
  }
  draw () {
    this.context.putImageData(this.imageData, 0, 0)
  }
  get nsPerExposure () {
    return Math.round(this._totalExposureTime / this.exposures * 1e6)
  }
  _mapped (rgb) {
    // TODO: HDR tonemapping here (exposure mapping?)
    return rgb.map(this._gamma)
  }
  _gamma (brightness) {
    return Math.pow(brightness / 255, (1 / this.gamma)) * 255
  }
  _trace (pixel) {
    let ray = this._camera.ray(pixel.x, pixel.y, this.width, this.height)
    let signal = new Vector3(1, 1, 1)
    let energy = new Vector3(0, 0, 0)

    for (var bounces = 0; bounces < this.bounces; bounces++ ) {
      const { hit, normal, material, distance } = this.scene.intersect(ray)
      if (!hit) {
        energy.add(this.scene.background(ray).scaledBy(signal))
        break
      } 

      if (material.light) energy.add(material.light.scaledBy(signal))
      if (Math.random() > signal.max) break
      signal.scale(1 / signal.max)

      const sample = material.bsdf(normal, ray.direction, distance)
      if (!sample) break
      ray = new Ray3(hit, sample.direction)
      signal = signal.scaledBy(sample.signal)
    }
    return energy
  }


}
