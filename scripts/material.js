class Material {
  constructor ({ color, transparency, refraction, light, fresnel, metal, roughness }) {
    this.color = color || new Vector3()
    this.refraction = refraction || 1
    this.transparency = transparency || new Vector3(0, 0, 0)
    this.light = light || new Vector3(0, 0, 0)
    this.fresnel = fresnel || null  // F0 (reflectance at normal incidence)
    this.metal = metal || 0
    this.roughness = roughness || 0
  }
  bsdf (direction, normal) {
    const dialectric = 1 - this.metal
    const rough = Vector3.randomInSphere.scaledBy(this.roughness / 2)
    const reflect = {
      pdf: this._schlick(direction, normal),
      direction: direction.reflected(normal).plus(rough).normalized,
      attenuation: new Vector3(1, 1, 1)
    }
    // TODO: add roughness to refractions so you can have things like frosted glass
    const refract = {
      pdf: (new Vector3(1,1,1).minus(reflect.pdf).floor(0)).scaledBy(this.transparency).scaledBy(dialectric),
      direction: direction.refracted(normal, 1, this.refraction),
      attenuation: new Vector3(1, 1, 1)
    }
    const diffuse = {
      pdf: (new Vector3(1,1,1).minus(reflect.pdf).minus(refract.pdf).floor(0)).scaledBy(dialectric),
      direction: normal.randomInHemisphere,
      attenuation: this.color
    }
    const samples = [ reflect, refract, diffuse ]
    return {
      samples: samples.filter(s => s.pdf.min > 0),
      emit: this.light.scaledBy(direction.scaledBy(-1).dot(normal))
    }
  }
  // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
  // http://graphics.stanford.edu/courses/cs348b-10/lectures/reflection_i/reflection_i.pdf
  _schlick (incident, normal) {
    if (!this.fresnel) return new Vector3(0, 0, 0)
    const cosIncident = incident.scaledBy(-1).dot(normal)
    return this.fresnel.plus((new Vector3(1,1,1).minus(this.fresnel)).scaledBy(Math.pow(1 - cosIncident, 5)))
  }
}
