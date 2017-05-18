class FirstScene extends Scene {
  _create() {
    const light = new Material({
      color: new Vector3(255, 255, 255),
      light: 1
    })
    return [
      new Sphere(new Vector3(0, 0, -5), 1, light)
    ]
  }
}
