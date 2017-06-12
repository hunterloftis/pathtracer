class CanvasRenderer {
  constructor (tracer, canvas) {
    const context = canvas.getContext('2d')
    frame()
    
    function frame() {
      context.putImageData(tracer.data, 0, 0)
      requestAnimationFrame(frame)
    }
  }
}