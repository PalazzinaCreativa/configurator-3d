import * as THREE from 'three'
import { RendererOptions } from '../interfaces'

export default async (
  container: HTMLElement,
  options: RendererOptions
) => {
  if (!container) return null
  let canvas: HTMLElement | null = container.querySelector('canvas')

  if (!canvas) {
    canvas = document.createElement('canvas')
    container.appendChild(canvas)
  }

  const renderer: any = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    preserveDrawingBuffer: true,
    ...options
  })

  renderer.setPixelRatio(container.offsetWidth / container.offsetHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
  // renderer.outputEncoding = THREE.sRGBEncoding
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  renderer.gammaFactor = 5
  container.appendChild(renderer.domElement)

  return renderer
}