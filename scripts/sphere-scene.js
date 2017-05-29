class SphereScene extends Scene {
  constructor () {
    super()
    const materials = this.materials
    this.environment = 'images/stpeters-probe.png'
    this.objects = [
      // new Sphere(new Vector3(-0.5, 0, -4), 0.25, materials.redPlastic),
      // new Sphere(new Vector3(0, 0, -2), 0.25, materials.redPlastic),
      // new Sphere(new Vector3(0.25, 0, -1), 0.25, materials.redPlastic)
      new Sphere(new Vector3(-2.25, -0.51, -5.5), 1, materials.gold),
      // new Sphere(new Vector3(0, -1, -7), 0.5, materials.redPlastic),
      new Sphere(new Vector3(0.8, -0.5, -5), 1, materials.greenGlass),
      new Sphere(new Vector3(3, -0.51, -10), 1, materials.redPlastic),
      new Sphere(new Vector3(6, -0.51, -12), 1, materials.glowPlastic),
      new Sphere(new Vector3(0.5, -1001.5, -8), 1000, materials.shinyBlack),
      new Sphere(new Vector3(-0.5, 4, -20), 5, materials.copper)
    ]
  }
  // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
  get materials () {
    return {
      shinyBlack: new Material({
        color: new Vector3(0, 0, 0),
        fresnel: new Vector3(0, 0, 0),
        roughness: 0.1
      }),
      redPlastic: new Material({
        color: new Vector3(1, 0.1, 0.1),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        roughness: 0.1
      }),
      gold: new Material({
        fresnel: new Vector3(1.022, 0.782, 0.344),
        color: new Vector3(1, 0.782, 0.344),
        metal: 0.9,
        roughness: 0
      }),
      copper: new Material({
        fresnel: new Vector3(0.955,0.638,0.538),
        metal: 0.9,
        roughness: 0
      }),
      silver: new Material({
        fresnel: new Vector3(0.972,0.960,0.915),
        color: new Vector3(0.972,0.960,0.915),
        metal: 0.9,
        roughness: 0
      }),
      glass: new Material({
        refraction: 1.6,
        transparency: new Vector3(1, 1, 1),
        fresnel: new Vector3(0.04, 0.04, 0.04)
      }),
      greenGlass: new Material({
        refraction: 1.52,
        transparency: new Vector3(0.8, 1, 0.9),
        fresnel: new Vector3(0.04, 0.04, 0.04)
      }),
      glowPlastic: new Material({
        fresnel: new Vector3(0.04, 0.04, 0.04),
        roughness: 0.3,
        light: new Vector3(100, 500, 2500)
      })
    }
  }
}
