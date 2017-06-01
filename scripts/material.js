class Material {
  constructor ({ color, transparency, refraction, light, fresnel, metal, roughness }) {
    this.color = color || new Vector3()
    this.refraction = refraction || 1
    this.transparency = transparency || new Vector3(0, 0, 0)
    this.light = light || new Vector3(0, 0, 0)
    this.fresnel = fresnel || new Vector3(0.04, 0.04, 0.04)  // F0 (reflectance at normal incidence)
    this.metal = metal || 0
    this.roughness = roughness || 0
  }
  // TODO: take length of ray into account (and reduce energy by that amount here, instead of in bsdf - first step towards participating media / volumetric fog)
  bsdf (direction, normal, distance) {
    const samples = []
    const entering = direction.enters(normal)
    if (entering) {
      const dialectric = 1 - this.metal
      const rough = Vector3.randomInSphere.scaledBy(this.roughness / 2)
      const reflect = {
        pdf: this._schlick(direction, normal),
        direction: direction.reflected(normal).plus(rough).normalized,
        energy: new Vector3(1, 1, 1)
      }
      // TODO: add roughness to refractions so you can have things like frosted glass
      const refract = {
        pdf: (new Vector3(1,1,1).minus(reflect.pdf).floor(0)).scaledBy(this.transparency * dialectric),
        direction: direction.refracted(normal, 1, this.refraction),
        energy: new Vector3(1, 1, 1)
      }
      const diffuse = {
        pdf: (new Vector3(1,1,1).minus(reflect.pdf).minus(refract.pdf).floor(0)).scaledBy(dialectric),
        direction: normal.randomInHemisphere,
        energy: this.color
      }
      samples.push(reflect, refract, diffuse)
    }
    else {
      const exitDirection = direction.refracted(normal.scaledBy(-1), this.refraction, 1)
      if (exitDirection) {
        const volume = Math.min((1 - this.transparency) * distance * distance, 1)
        const refract = {
          pdf: new Vector3(1, 1, 1),
          direction: exitDirection,
          energy: new Vector3(1, 1, 1).lerp(this.color, volume)
        }
        samples.push(refract)
      }
    }
    return {
      samples: samples.filter(s => s.pdf.min > 0),
      emit: this.light.scaledBy(direction.scaledBy(-1).dot(normal))
    }
  }
  // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
  // http://graphics.stanford.edu/courses/cs348b-10/lectures/reflection_i/reflection_i.pdf
  _schlick (incident, normal) {
    const cosIncident = incident.scaledBy(-1).dot(normal)
    return this.fresnel.plus((new Vector3(1,1,1).minus(this.fresnel)).scaledBy(Math.pow(1 - cosIncident, 5)))
  }
}
