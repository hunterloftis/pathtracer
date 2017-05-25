const BLACK = new Vector3(0, 0, 0)

class Camera {
  constructor ({ canvas, scene, fov, bounces }) {
    const fovRadians = fov * Math.PI / 180;
    Object.assign(this, { scene, bounces })
    this.zoom = Math.tan(fovRadians / 2);
    this.origin = new Vector3()
    this.width = canvas.width
    this.height = canvas.height
    this.buffer = new Uint32Array(this.width * this.height * 4);
    this.context = canvas.getContext('2d')
    this.image = this.context.getImageData(0, 0, this.width, this.height)
    this.paths = 0
    this.pathsPerFrame = this.width * this.height
  }
  expose (scene) {
    const index = this._indexForPath(this.paths)
    const pixel = this._pixelForIndex(index)
    const ray = this._rayForPixel(pixel)
    const color = this._trace(ray, this.bounces)
    this._setPixel(pixel.x, pixel.y, color)
    this.paths++
  }
  draw (debug=false) {
    this.context.putImageData(this.image, 0, 0)
    if (debug) {
      const pixel = this.pixel
      this.context.fillStyle = '#fff'
      this.context.fillRect(0, pixel.y, this.width, 1)
    }
  }
  get aspect () {
    return this.width / this.height
  }
  _setPixel (x, y, color) {
    const index = (x + (y * this.width)) * 4
    const exposures = Math.ceil(this.paths / this.pathsPerFrame)
    const rgb = color.array
    for (let i = 0; i < 3; i++) {
      this.buffer[index + i] += rgb[i]
      this.image.data[index + i] = this._gamma(this.buffer[index + i] / exposures, 2.2)
    }
    this.image.data[index + 3] = 255
  }
  _gamma(brightness, g) {
    return Math.pow(brightness / 255, (1 / g)) * 255
  }
  get pixel () {
    const path = this.paths % this.pathsPerFrame
    const x = path % this.width
    const y = Math.floor(path / this.width)
    return { x, y }
  }
  _indexForPath (path) {
    return path % this.pathsPerFrame
  }
  _pixelForIndex (index) {
    const x = index % this.width
    const y = Math.floor(index / this.width)
    return { x, y }
  }
  _rayForPixel (pixel) {
    const viewX = (pixel.x + Math.random()) / this.width  // map pixel X to 0:1 with random jitter
    const viewY = (pixel.y + Math.random()) / this.height // map pixel Y to 0:1 with random jitter
    const screenX = (2 * viewX - 1) * this.aspect;  // map 0:1 to -aspect:aspect
    const screenY = (2 * viewY - 1) * -1;  // map 0:1 to 1:-1
    const direction = new Vector3(screenX * this.zoom, screenY * this.zoom, -1).normalized;
    return new Ray3(this.origin, direction)
  }
  _trace (ray, bounces) {
    if (ray && bounces >= 0) {
      const hit = this.scene.intersect(ray)       // TODO: something like const { hit, normal, material }
      if (!hit) return this.scene.background(ray)
      const material = hit.object.material
      if (hit.entering) {
        const samples = material.bsdf(ray.direction, hit.normal)
        const light = samples.reduce((total, sample) => {
          if (sample.pdf.length === 0) return total
          const throughput = sample.attenuation.scaledBy(sample.pdf)  // TODO: add russian roulette here
          const sampleRay = new Ray3(hit.point, sample.direction)
          const sampleLight = this._trace(sampleRay, bounces - 1)
          return total.plus(sampleLight.scaledBy(throughput))
        }, material.light)
        if (light.array[0] < 0 && bounces === 6) {
          console.log(material)
          console.log(samples)
          debugger
        }
        return light
        //
        //
        // const bsdf = material.bsdf(ray.direction, hit.normal)
        // const light = new Vector3()
        // if (bsdf.reflected.length > this.russian) {
        //   const reflectedRay = ray.reflected(hit.point, hit.normal)
        //   const roughness = Vector3.randomInSphere().scaledBy(material.roughness / 2)
        //   const roughRay = new Ray3(reflectedRay.origin, reflectedRay.direction.plus(roughness).normalized)
        //   light.add(this._trace(roughRay, bounces - 1).scaledBy(bsdf.reflected))
        // }
        // if (bsdf.refracted.length > this.russian) {
        //   const refractedRay = new Ray3(hit.point, ray.direction).refracted(hit.normal1, 1 / material.refraction)
        //   light.add(this._trace(refractedRay, bounces - 1).scaledBy(bsdf.refracted))
        // }
        // if (bsdf.diffused.length > this.russian) {
        //   const diffusedRay = new Ray3(hit.point, hit.normal.randomInHemisphere)
        //   const brdf = diffusedRay.direction.dot(hit.normal)
        //   light.add(this._trace(diffusedRay, bounces - 1).scaledBy(material.color).scaledBy(brdf))
        // }
        // return light
      }
      else {
        const direction = ray.direction.refracted(hit.normal.scaledBy(-1), material.refraction, 1)
        const refractedRay = new Ray3(hit.point, direction)
        return this._trace(refractedRay, bounces - 1)
      }
    }
    return BLACK
  }
}
