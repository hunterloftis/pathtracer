class Material {
  constructor ({ color, transparency, refraction, light, fresnel, metal, roughness }) {
    this.color = color || new Vector3()
    this.refraction = refraction || 0
    this.transparency = transparency || new Vector3(0, 0, 0)
    this.light = light || 0
    this.fresnel = fresnel || null  // F0 (reflectance at normal incidence)
    this.metal = metal || 0
    this.roughness = roughness || 0
  }
  bsdf (direction, normal) {
    const notMetal = 1 - this.metal
    const reflected = this.schlick(direction, normal)
    const refracted = new Vector3(1,1,1).minus(reflected).scaledBy(this.transparency).scaledBy(notMetal)
    const diffused = new Vector3(1,1,1).minus(reflected.plus(refracted)).scaledBy(notMetal)
    return { reflected, refracted, diffused }
  }
  // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
  // http://graphics.stanford.edu/courses/cs348b-10/lectures/reflection_i/reflection_i.pdf
  schlick (incident, normal) {
    if (!this.fresnel) return new Vector3(0, 0, 0)
    const cosIncident = incident.scaledBy(-1).dot(normal)
    return this.fresnel.plus((new Vector3(1,1,1).minus(this.fresnel)).scaledBy(Math.pow(1 - cosIncident, 5)))
  }
}
