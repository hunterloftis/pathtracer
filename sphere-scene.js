class SphereScene extends Scene {
  _create() {
    // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
    const redPlastic = new Material({
      color: new Vector3(1, 0.05, 0.05),
      // refraction: 1,
      fresnel: new Vector3(0.04, 0.04, 0.04)
    })
    const yellowLambert = new Material({
      color: new Vector3(1, 0.9, 0.1)
    })
    const chromium = new Material({
      //color: new Vector3(0.18, 0.2, 0.8),
      // color: new Vector3(0.549, 0.556, 0.554),
      // refraction: 3,
      fresnel: new Vector3(0.549, 0.556, 0.554),
      metal: 0.9
    })
    const gold = new Material({
      fresnel: new Vector3(1.022, 0.782, 0.344),
      color: new Vector3(1.022, 0.782, 0.344),
      metal: 0.9
    })
    const copper = new Material({
      fresnel: new Vector3(0.955,0.638,0.538),
      metal: 0.8
    })
    const silver = new Material({
      fresnel: new Vector3(0.972,0.960,0.915),
      color: new Vector3(0.972,0.960,0.915),
      metal: 0.9
    })
    const pearl = new Material({
      color: new Vector3(1, 1, 1),
      // refraction: 1.8
    })
    const glass = new Material({
      color: new Vector3(1, 1, 1),
      refraction: 1.6,
      transparency: 1,
      fresnel: new Vector3(0.04, 0.04, 0.04)
    })
    const sunlight = new Material({
      color: new Vector3(192, 191, 173),
      light: 3
    })
    const twilight = new Material({
      color: new Vector3(182, 126, 91),
      light: 1
    })
    return [
      new Sphere(new Vector3(-2.5, -0.25, -11), 0.75, yellowLambert),
      new Sphere(new Vector3(-0.8, -0.25, -11), 0.75, gold),
      new Sphere(new Vector3(0.8, -0.25, -11), 0.75, silver),
      new Sphere(new Vector3(2.5, -0.25, -11), 0.75, glass),
      new Sphere(new Vector3(0.5, -1001, -9.25), 1000, redPlastic),        // ground
      new Sphere(new Vector3(-200, 250, -8), 200, sunlight),    // key light
      new Sphere(new Vector3(100, 250, -8), 50, twilight)      // fill light
    ]
  }
}
