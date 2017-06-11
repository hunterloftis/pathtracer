class Tracer {
  constructor ({ canvas, scene, bounces, camera, gamma = 2.2}) {
    Object.assign(this, { scene, bounces, gamma })
    this.width = canvas.width
    this.height = canvas.height
    this.buffer = new Float64Array(this.width * this.height * 4).fill(0)
    this.context = canvas.getContext('2d')
    this.imageData = this.context.getImageData(0, 0, this.width, this.height)
    this.pixels = this.imageData.data.fill(0)
    this.exposures = 0
    this.maxSamples = 16
    this.noiseThreshold = 32
    this._camera = camera || new Camera({ fov: 40 })
    this._black = new Vector3()
    this._gamma = this._gamma.bind(this)
    for (let i = 3; i < this.pixels.length; i += 4) this.pixels[i] = 255
    this._totalExposureTime = 0
    this._index = 0
  }
  expose () {
    const start = performance.now()
    const pixel = this._pixelForIndex(this._index)
    const rgbaIndex = (pixel.x + pixel.y * this.width) * 4
    const limit = Math.ceil(this._index / (this.width * this.height) + 1)
    const first = this._averageAt(pixel)
    let last = first
    for (let samples = 0; samples < limit; samples++) {
      const light = this._trace(pixel)
      const rgb = light.array
      const noise = (light.minus(last).length + light.minus(first).length) / 512
      last = light
      for (let i = 0; i < 3; i++) {
        this.buffer[rgbaIndex + i] += rgb[i]
      }
      this.buffer[rgbaIndex + 3]++
      this.exposures++
      if (noise < 0.05) break
    }
    this._colorPixel(pixel)
    this._index++
    this._totalExposureTime += performance.now() - start
  }
  _colorPixel(pixel) {
    // const average = this._averageAt(pixel)
    // const color = average.array.map(this._gamma)
    const index = (pixel.x + pixel.y * this.width) * 4
    const exp = this.buffer[index + 3] * 3
    const color = [exp, exp, exp]
    this.pixels.set(color, index)
  }
  _averageAt(pixel) {
    if (pixel.x < 0 || pixel.x >= this.width || pixel.y < 0 || pixel.y >= this.height) {
      return null
    }
    const index = (pixel.x + pixel.y * this.width) * 4
    const rgb = this.buffer.slice(index, index + 3)
    const exposures = this.buffer[index + 3]
    return new Vector3(...rgb).scaledBy(1 / exposures)
  }
  _colorAt(pixel, dx = 0, dy = 0) {
    const x = pixel.x + dx
    const y = pixel.y + dy
    const index = (x + y * this.width) * 4
    return new Vector3(...this.pixels.slice(index, index + 3))
  }
  _pixelForIndex(index) {
    const wrapped = index % (this.width * this.height)
    return { x: wrapped % this.width, y: Math.floor(wrapped / this.width) }
  }
  draw () {
    this.context.putImageData(this.imageData, 0, 0)
  }
  get nsPerExposure () {
    return Math.round(this._totalExposureTime / this.exposures * 1e6)
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
        energy.add(this.scene.bg(ray).scaledBy(signal))
        break
      } 
      const light = material.emit(normal, ray.direction)
      if (light) energy.add(light.scaledBy(signal))
      if (signal.dies(signal.max)) {
        break
      }
      const sample = material.bsdf(normal, ray.direction, distance)
      if (!sample) {
        break
      }
      ray = new Ray3(hit, sample.direction)
      signal = signal.scaledBy(sample.signal)
    }
    return energy
  }


}
