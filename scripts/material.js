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
  bsdf (direction, normal, length) {
    const entering = direction.enters(normal)
    if (entering) {
      const cosWeight = direction.scaledBy(-1).dot(normal)
      const emit = this.light.scaledBy(cosWeight)
      const reflected = this._reflect(direction, normal)
      const refracted = this._refract(direction, normal, reflected)
      const diffused = this._diffuse(normal, reflected, refracted)
      return {
        emit,
        samples: Object.values([ reflected, refracted, diffused ])
      }  // TODO: unify into a single array with emit
    }
    else {
      return {
        emit: new Vector3(),
        samples: Object.values([ this.volume() ])
      }
    }
  }
  _reflect (direction, normal) {
    const pdf = this._schlick(direction, normal)
    if (pdf.max === 0) return
    const rough = Vector3.randomInSphere.scaledBy(this.roughness / 2)
    return {
      pdf,
      direction: reflected(normal).plus(rough).normalized,
      energy: new Vector3(1, 1, 1)
    }
  }
  _refract (direction, normal, reflected) {
    const dialectric = 1 - this.metal
    const pdf = (new Vector3(1,1,1).minus(reflected.pdf).floor(0)).scaledBy(this.transparency * dialectric)
    if (pdf === 0) return
    const rough = Vector3.randomInSphere.scaledBy(this.roughness / 2)
    return {
      pdf,
      direction: direction.refracted(normal, 1, this.refraction).plus(rough).normalized,
      energy: new Vector3(1, 1, 1)
    }  
  }
  _diffuse (normal, reflected, refracted) {
    const dialectric = 1 - this.metal
    const pdf = (new Vector3(1,1,1).minus(reflected.pdf).minus(refracted.pdf).floor(0)).scaledBy(dialectric)
    if (pdf.max === 0) return
    const direction = normal.randomInHemisphere
    const lambert = Math.max(direction.dot(normal), 0)
    return {
      pdf,
      direction,
      energy: this.color.scaledBy(lambert)
    }
  }
  // TODO: more robust volumetric effects
  _volume () {
    const exitDirection = direction.refracted(normal.scaledBy(-1), this.refraction, 1)
    if (!exitDirection) return
    const volume = Math.min((1 - this.transparency) * length * length, 1)
    return {
      pdf: new Vector3(1, 1, 1),
      direction: exitDirection,
      energy: new Vector3(1, 1, 1).lerp(this.color, volume)
    }
  }
  // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
  // http://graphics.stanford.edu/courses/cs348b-10/lectures/reflection_i/reflection_i.pdf
  _schlick (incident, normal) {
    const cosIncident = incident.scaledBy(-1).dot(normal)
    return this.fresnel.plus((new Vector3(1,1,1).minus(this.fresnel)).scaledBy(Math.pow(1 - cosIncident, 5)))
  }
}
