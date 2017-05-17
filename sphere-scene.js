class SphereScene extends Scene {
  _create() {
    const redPlastic = new Material({
      color: new Vector3(1, 0.05, 0.05),
      refraction: 1
    })
    const yellowLambert = new Material({
      color: new Vector3(1, 0.9, 0.1)
    })
    const blueChrome = new Material({
      color: new Vector3(0.18, 0.2, 0.8),
      refraction: 3
    })
    const pearl = new Material({
      color: new Vector3(1, 1, 1),
      refraction: 1.8
    })
    const glass = new Material({
      color: new Vector3(1, 1, 1),
      refraction: 1.6,
      transparency: 1
    })
    const sunlight = new Material({
      color: new Vector3(192, 191, 173),
      light: 5
    })
    const twilight = new Material({
      color: new Vector3(182, 126, 91),
      light: 2
    })
    return [
      new Sphere(new Vector3(-2.5, -0.25, -11), 0.75, yellowLambert),
      new Sphere(new Vector3(-0.8, -0.25, -11), 0.75, pearl),
      new Sphere(new Vector3(0.8, -0.25, -11), 0.75, blueChrome),
      new Sphere(new Vector3(2.5, -0.25, -11), 0.75, glass),
      new Sphere(new Vector3(0.5, -1001, -9.25), 1000, redPlastic),        // ground
      new Sphere(new Vector3(-200, 250, -8), 200, sunlight),    // key light
      new Sphere(new Vector3(100, 250, -8), 50, twilight)      // fill light
    ]
  }
}
