class CanvasRenderer {
  constuctor (tracer, canvas) {
    Object.assign(this, { tracer, canvas })
    this._context = canvas.getContext('2d')
    this._running = false
    this._frame = this._frame.bind(this)
    requestAnimationFrame(this._frame)
  }
  _frame () {
    if (!this._running) return
    const imageData = tracer.getData()
    this._context.putImageData(imageData, 0, 0)
    requestAnimationFrame(this._frame)
  }
}