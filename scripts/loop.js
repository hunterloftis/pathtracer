function loop (duration, each, final) {
  requestAnimationFrame(frame)
  function frame () {
    const end = performance.now() + duration
    do { each() } while (performance.now() < end)
    final()
    requestAnimationFrame(frame)
  }
}