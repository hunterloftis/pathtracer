class Material {
  constructor ({ color, refraction, transparency, light, fresnel, metal }) {
    this.color = color || new Vector3()
    this.refraction = refraction || 0
    this.transparency = transparency || 0
    this.light = light || 0
    // F0 (reflectance at normal incidence)
    this.fresnel = fresnel || null
    this.metal = metal || false
    // https://www.gamedev.net/topic/616839-choose-path-in-path-tracing/
    this.specMask = Math.pow(this.refraction - 1, 2) / Math.pow(this.refraction + 1, 2)
    // console.log('specMask of', this.refraction, 'is', this.specMask)
  }
  bsdf (direction, normal) {
    if (this.metal) {
      const schlick = this.schlick(direction, normal)

      return {
        reflected: schlick,
        refracted: 0,
        diffused: 0
      }
    }
    const reflected = this.schlick(direction, normal)
    const refracted = (1 - reflected) * this.transparency //new Vector3(1,1,1).minus(reflected).scaledBy(this.transparency)
    const diffused = 1 - (reflected + refracted) //new Vector3(1,1,1).minus(reflected.plus(refracted))
    const total = reflected + refracted + diffused //Vector3.sum(reflected, refracted, diffused)
    // if (!total.equals(new Vector3(1,1,1))) debugger
    if (total !== 1) debugger
    return { reflected, refracted, diffused }
  }
  // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
  // http://graphics.stanford.edu/courses/cs348b-10/lectures/reflection_i/reflection_i.pdf
  schlick (incident, normal) {
    if (!this.fresnel) return 0
    // http://stackoverflow.com/a/570749/1911432
    const cosIncident = incident.scaledBy(-1).dot(normal)
    return this.fresnel + (1 - this.fresnel) * Math.pow(1 - cosIncident, 5)
    // if (!this.fresnel) return new Vector3(0, 0, 0)
    // const cosIncident = incident.scaledBy(-1).dot(normal)
    // return this.fresnel.plus(new Vector3(1,1,1).minus(this.fresnel)).scaledBy(Math.pow(1 - cosIncident, 5))
  }
}
