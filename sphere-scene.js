class SphereScene extends Scene {
  _create() {
    // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
    const redPlastic = new Material({
      color: new Vector3(1, 0.05, 0.05),
      // refraction: 1,
      // fresnel: new Vector3(0.4, 0.4, 0.4)
      fresnel: 0.04
    })
    const yellowLambert = new Material({
      color: new Vector3(1, 0.9, 0.1)
    })
    const chromium = new Material({
      //color: new Vector3(0.18, 0.2, 0.8),
      // color: new Vector3(0.549, 0.556, 0.554),
      // refraction: 3,
      // fresnel: new Vector3(0.549, 0.556, 0.554),
      fresnel: 0.95,
      metal: true
    })
    const gold = new Material({
      // fresnel: new Vector3(1.022, 0.782, 0.344),
      fresnel: 0.82,
      metal: true
    })
    const pearl = new Material({
      color: new Vector3(1, 1, 1),
      // refraction: 1.8
    })
    const glass = new Material({
      color: new Vector3(1, 1, 1),
      refraction: 1.6,
      transparency: 1,
      // fresnel: new Vector3(0.045, 0.045, 0.045)
      fresnel: 0.045
    })
    const sunlight = new Material({
      color: new Vector3(192, 191, 173),
      light: 20
    })
    const twilight = new Material({
      color: new Vector3(182, 126, 91),
      light: 2
    })
    return [
      new Sphere(new Vector3(-2.5, -0.25, -11), 0.75, yellowLambert),
      new Sphere(new Vector3(-0.8, -0.25, -11), 0.75, gold),
      new Sphere(new Vector3(0.8, -0.25, -11), 0.75, chromium),
      new Sphere(new Vector3(2.5, -0.25, -11), 0.75, glass),
      new Sphere(new Vector3(0.5, -1001, -9.25), 1000, redPlastic),        // ground
      new Sphere(new Vector3(-200, 250, -8), 200, sunlight),    // key light
      new Sphere(new Vector3(100, 250, -8), 50, twilight)      // fill light
    ]
  }
}
