class Material {
  constructor ({ color, refraction, transparency, light }) {
    this.color = color || new Vector3()
    this.refraction = refraction || 0
    this.transparency = transparency || 0
    this.light = light || 0
    // https://www.gamedev.net/topic/616839-choose-path-in-path-tracing/
    this.specMask = Math.pow(this.refraction - 1, 2) / Math.pow(this.refraction + 1, 2)
    // console.log('specMask of', this.refraction, 'is', this.specMask)
  }
  bsdf (direction, normal) {
    const reflected = this.specular(direction, normal)
    const refracted = (1 - reflected) * this.transparency
    const diffused = 1 - (reflected + refracted)
    if (reflected + refracted + diffused !== 1) debugger
    return { reflected, refracted, diffused }
  }
  specular (incident, normal) {
    if (!this.refraction) return 0
    const cosIncident = incident.scaledBy(-1).dot(normal)
    return this.specMask + (1 - this.specMask) * Math.pow(1 - cosIncident, 5)
  }
}
