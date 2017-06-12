class SphereScene extends Scene {
  constructor () {
    super()
    const materials = this.materials
    this.environment = 'images/stpeters-probe.png'
    this.objects = [
      new Sphere(new Vector3(-3.3, 1, -4.3), 1, materials.gold),
      new Sphere(new Vector3(-1.1, 1, -5), 1, materials.bluePlastic),
      new Sphere(new Vector3(1, 1, -5), 1, materials.silver),
      new Sphere(new Vector3(3.2, 1, -4.6), 1, materials.greenGlass),
      new Sphere(new Vector3(0.5, -1000, -8), 1000, materials.whiteLambert),
      new Sphere(new Vector3(-10, 2, 0), 2, materials.brightLight)
    ]
    this.camera = new Camera({ lens: 0.055, focus: 14, position: new Vector3(0, 6, 8), verticalAngle: 25 })
  }
  // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
  get materials () {
    return {
      whiteLambert: new Material({
        color: new Vector3(1, 1, 1),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.1
      }),
      shinyBlack: new Material({
        color: new Vector3(0, 0, 0),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.9
      }),
      bluePlastic: new Material({
        color: new Vector3(0.1, 0.1, 1),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.2
      }),
      redPlastic: new Material({
        color: new Vector3(1, 0, 0),
        fresnel: new Vector3(0.04, 0.04, 0.04),
        gloss: 0.2
      }),
      gold: new Material({
        fresnel: new Vector3(1.022, 0.782, 0.344),
        color: new Vector3(0, 0, 0),
        metal: 1,
        gloss: 0.7
      }),
      copper: new Material({
        fresnel: new Vector3(0.955,0.638,0.538),
        metal: 0.9,
        gloss: 1
      }),
      silver: new Material({
        fresnel: new Vector3(0.972, 0.960, 0.915),
        color: new Vector3(0.972, 0.960, 0.915),
        metal: 0.9,
        gloss: 1
      }),
      glass: new Material({
        refraction: 1.6,
        opacity: 0,
        transparency: 1,
        fresnel: new Vector3(0.04, 0.04, 0.04)
      }),
      greenGlass: new Material({
        refraction: 1.52,
        transparency: 0.95,
        gloss: 1,
        color: new Vector3(0, 1, 0),
        fresnel: new Vector3(0.05, 0.05, 0.05)
      }),
      brightLight: new Material({
        light: new Vector3(5000, 5000, 5000),
        transparency: 1,
        fresnel: new Vector3(0, 0, 0)
      })
    }
  }
}
