class SphereScene extends Scene {
  background (ray) {
    const d = Math.sqrt(ray.direction.x * ray.direction.x + ray.direction.y * ray.direction.y)
    const r = 0.159154943 * Math.acos(ray.direction.z) / d
    const u = 0.5 + ray.direction.x * r
    const v = 0.5 + ray.direction.y * -r
    const x = u * 1500
    const y = v * 1500
    const pixel = this.context.getImageData(x, y, 1, 1).data
    const rgb = new Vector3(pixel[0], pixel[1], pixel[2])
    const scale = rgb.length > 440 ? 1 : 0.5
    return new Vector3(pixel[0], pixel[1], pixel[2]).scaledBy(scale)
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
    image.src = 'images/stpeters-probe.png'

    // http://blog.selfshadow.com/publications/s2015-shading-course/hoffman/s2015_pbs_physics_math_slides.pdf
    const shinyBlack = new Material({
      color: new Vector3(0, 0, 0),
      fresnel: new Vector3(0, 0, 0),
      roughness: 0.1
    })
    const redPlastic = new Material({
      color: new Vector3(0.9, 0.2, 0.1),
      fresnel: new Vector3(0.04, 0.04, 0.04),
      roughness: 0.1
    })
    const purpleSilicon = new Material({
      color: new Vector3(0.8, 0.1, 0.9),
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
      roughness: 0
    })
    const copper = new Material({
      fresnel: new Vector3(0.955,0.638,0.538),
      metal: 0.8,
      roughness: 0.1
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
    const redlight = new Material({
      color: new Vector3(255, 50, 100),
      light: 5
    })
    const greenlight = new Material({
      color: new Vector3(100, 255, 50),
      light: 5
    })
    const bluelight = new Material({
      color: new Vector3(50, 100, 255),
      light: 5
    })
    return [
      new Sphere(new Vector3(-2.25, -0.01, -4.5), 0.5, gold),
      new Sphere(new Vector3(-0.8, 0, -5.5), 0.5, redPlastic),
      new Sphere(new Vector3(0.8, 0.5, -4), 1, glass),
      new Sphere(new Vector3(2.5, 0.49, -6), 1, copper),
      new Sphere(new Vector3(-3, -0.01, -10), 0.5, shinyBlack),
      new Sphere(new Vector3(0.5, -1000.5, -7), 1000, shinyBlack),
      // new Sphere(new Vector3(0, 600, 0), 100, sunlight)
    ]
  }
}
