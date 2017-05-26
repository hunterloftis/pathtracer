class Tracer {
  constructor ({ canvas, scene, bounces, gamma = 2.2}) {
    Object.assign(this, { scene, bounces, gamma })
    this.width = canvas.width
    this.height = canvas.height
    this.buffer = new Uint32Array(this.width * this.height * 4).fill(0)
    this.context = canvas.getContext('2d')
    this.imageData = this.context.getImageData(0, 0, this.width, this.height)
    this.pixels = this.imageData.data.fill(255)
    this.paths = 0
    this._camera = new Camera({ fov: 40 })
    this._black = new Vector3()
  }
  expose () {
    const index = this._indexForPath(this.paths)
    const pixel = this._pixelForIndex(index)
    const ray = this._camera.ray(pixel.x, pixel.y, this.width, this.height)
    const rgb = this._trace(ray, this.bounces).array
    const rgba = index * 4
    const exposures = ++this.buffer[rgba + 3]
    for (let i = 0; i < 3; i++) {
      this.buffer[rgba + i] += rgb[i]
      this.pixels[rgba + i] = this._gamma(this.buffer[rgba + i] / exposures)
    }
    this.paths++
  }
  draw (debug = false) {
    this.context.putImageData(this.imageData, 0, 0)
    if (debug) {
      const index = this._indexForPath(this.paths)
      const pixel = this._pixelForIndex(index)
      this.context.fillStyle = '#fff'
      this.context.fillRect(0, pixel.y, this.width, 1)
    }
  }
  _gamma (brightness) {
    return Math.pow(brightness / 255, (1 / this.gamma)) * 255
  }
  _indexForPath (path) {
    return path % (this.width * this.height)
  }
  _pixelForIndex (index) {
    const x = index % this.width
    const y = Math.floor(index / this.width)
    return { x, y }
  }
  _trace (ray, bounces, attenuation = 1) {
    if (bounces >= 0 && Math.random() <= attenuation) {
      const gain = 1 / attenuation
      const { hit, normal, material } = this.scene.intersect(ray)
      if (!hit) return this.scene.background(ray).scaledBy(gain)
      if (ray.direction.enters(normal)) {
        const bsdf = material.bsdf(ray.direction, normal)
        const light = bsdf.samples.reduce((total, sample) => {
          const luminosity = sample.attenuation.scaledBy(sample.pdf)
          const sampleRay = new Ray3(hit, sample.direction)
          const sampleLight = this._trace(sampleRay, bounces - 1, sample.attenuation.max * attenuation)
          return total.plus(sampleLight.scaledBy(luminosity))
        }, bsdf.emit)
        return light.scaledBy(gain)
      }
      else {
        const direction = ray.direction.refracted(normal.scaledBy(-1), material.refraction, 1)
        const refractedRay = new Ray3(hit, direction)
        return this._trace(refractedRay, bounces - 1, attenuation).scaledBy(gain)
      }
    }
    return this._black
  }
}
