class SphereScene extends Scene {
  constructor () {
    super()
    const materials = this.materials
    this.environment = 'images/stpeters-probe.png'
    this.objects = [
      new Sphere(new Vector3(-5.3, 1, -5), 1, materials.gold),
      new Sphere(new Vector3(-3.2, 1, -5.3), 1, materials.whiteLambert),
      new Sphere(new Vector3(-1.1, 1, -5), 1, materials.bluePlastic),
      new Sphere(new Vector3(1, 1, -5), 1, materials.silver),
      new Sphere(new Vector3(3.2, 1, -4.6), 1, materials.greenGlass),
      new Sphere(new Vector3(-10, 2, 0), 2, materials.brightLight),
      new Sphere(new Vector3(0.5, -1000, -8), 1000, materials.whiteLambert)
    ]
  }
  // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
  get materials () {
    return {
      whiteLambert: new Material({
        color: new Vector3(1, 1, 1),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        roughness: 1
      }),
      shinyBlack: new Material({
        color: new Vector3(0, 0, 0),
        fresnel: new Vector3(0, 0, 0),
        roughness: 0.1
      }),
      bluePlastic: new Material({
        color: new Vector3(0.1, 0.1, 1),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        roughness: 0.8
      }),
      redPlastic: new Material({
        color: new Vector3(1, 0, 0),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        roughness: 0.8
      }),
      gold: new Material({
        fresnel: new Vector3(1.022, 0.782, 0.344),
        color: new Vector3(0, 0, 0),
        metal: 1,
        roughness: 0.3
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
        transparency: 1,
        fresnel: new Vector3(0.04, 0.04, 0.04)
      }),
      greenGlass: new Material({
        refraction: 1.52,
        transparency: 0.9,
        color: new Vector3(0, 1, 0),
        fresnel: new Vector3(0.05, 0.05, 0.05)
      }),
      glowPlastic: new Material({
        fresnel: new Vector3(0.04, 0.04, 0.04),
        roughness: 0.3,
        light: new Vector3(100, 500, 2400),
        transparency: new Vector3(0.4, 0.4, 0.4)
      }),
      brightLight: new Material({
        light: new Vector3(10000, 10000, 10000)
      })
    }
  }
}
