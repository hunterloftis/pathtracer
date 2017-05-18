class SphereScene extends Scene {
  background (ray) {
    const d = Math.sqrt(ray.direction.x * ray.direction.x + ray.direction.y * ray.direction.y)
    const r = 0.159154943 * Math.acos(ray.direction.z) / d
    const u = 0.5 + ray.direction.x * r
    const v = 0.5 + ray.direction.y * -r
    const x = u * 1500
    const y = v * 1500
    const pixel = this.context.getImageData(x, y, 1, 1).data
    return new Vector3(pixel[0], pixel[1], pixel[2]).scaledBy(0.5)
  }
  _create() {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1500
    const context = this.context = canvas.getContext('2d')
    const image = new Image()
    const self = this
    image.addEventListener('load', () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      self.onload()
    }, false)
    image.src = 'stpeters-probe.png'

    // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
    const blackPlastic = new Material({
      color: new Vector3(0, 0, 0),
      fresnel: new Vector3(0.04, 0.04, 0.04),
      roughness: 0.5
    })
    const blueLambert = new Material({
      color: new Vector3(0.18, 0.2, 0.8),
      fresnel: new Vector3(0, 0, 0),
      roughness: 0.5
    })
    const chromium = new Material({
      fresnel: new Vector3(0.549, 0.556, 0.554),
      metal: 0.9
    })
    const gold = new Material({
      fresnel: new Vector3(1.022, 0.782, 0.344),
      color: new Vector3(1.022, 0.782, 0.344),
      metal: 0.9,
      roughness: 0.5
    })
    const copper = new Material({
      fresnel: new Vector3(0.955,0.638,0.538),
      metal: 0.8
    })
    const silver = new Material({
      fresnel: new Vector3(0.972,0.960,0.915),
      color: new Vector3(0.972,0.960,0.915),
      metal: 0.9,
      roughness: 0.3
    })
    const mirror = new Material({
      fresnel: new Vector3(0.972,0.960,0.915),
      color: new Vector3(0.5, 0.5, 0.5),
      metal: 0.9
    })
    const glass = new Material({
      refraction: 1.6,
      transparency: new Vector3(0.8, 1, 0.9),
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
      new Sphere(new Vector3(-2.25, -0.01, -4.5), 0.75, gold),
      new Sphere(new Vector3(-0.8, 0, -5.5), 0.75, blueLambert),
      new Sphere(new Vector3(0.8, 0, -6), 0.75, mirror),
      new Sphere(new Vector3(2, 0, -5), 0.75, glass),
      new Sphere(new Vector3(0.5, -1000.748, -7), 1000, blackPlastic), // ground
      new Sphere(new Vector3(-50, 100, -25), 50, sunlight),        // key light
      // new Sphere(new Vector3(100, 250, -8), 50, twilight)           // fill light
    ]
  }
}
