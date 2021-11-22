import * as THREE from 'three'

export default (
  container: HTMLElement
) => {
  if (!container) return null
  let canvas: HTMLElement | null = container.querySelector('canvas')

  if (!canvas) {
    canvas = document.createElement('canvas')
    container.appendChild(canvas)
  }

  const renderer: any = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  })

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
  // renderer.outputEncoding = THREE.sRGBEncoding
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.gammaFactor = 5
  container.appendChild(renderer.domElement)

  return renderer
}