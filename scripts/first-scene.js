class FirstScene extends Scene {
  constructor () {
    super()
    const light = new Material({
      light: new Vector3(3000, 3000, 3000),
      transparency: 1,
      fresnel: new Vector3(0, 0, 0)
    })
    this.objects = [ new Sphere(new Vector3(0, 0, -5), 1, light) ]
  }
}
