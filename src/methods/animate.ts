import * as THREE from 'three'

export default (
  controls: any,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  lights: any
): void => {
  // Fix Pixelation and stretching
  const resizeRendererToDisplaySize = (
    renderer: THREE.WebGLRenderer
  ): boolean => {
    const canvas: HTMLCanvasElement = renderer.domElement
    const width: number = canvas.offsetWidth
    const height: number = canvas.offsetHeight
    const canvasPixelWidth: number = canvas.offsetWidth / window.devicePixelRatio
    const canvasPixelHeight: number = canvas.offsetHeight / window.devicePixelRatio

    const needResize: boolean = canvasPixelWidth !== width || canvasPixelHeight !== height

    if (needResize) renderer.setSize(width, height, false)

    return needResize
  }


  const animate = (): void => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    controls.update()

    lights
      .forEach((l: THREE.HemisphereLight | THREE.SpotLight) => {
        l.position.set(
          camera.position.x + 0.2,
          camera.position.y + 0.2,
          camera.position.z + 0.2
        )
      })

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
  }

  animate()
}