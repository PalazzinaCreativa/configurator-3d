import * as THREE from 'three'

export default (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
  camera.aspect = renderer.domElement.offsetWidth / renderer.domElement.offsetHeight
  camera.updateProjectionMatrix()
  console.log(renderer.domElement.offsetWidth)
  renderer.domElement.setAttribute('width', renderer.domElement.offsetWidth)
  renderer.domElement.setAttribute('height', renderer.domElement.offsetHeight)
  renderer.setSize( renderer.domElement.offsetWidth, renderer.domElement.offsetHeight )
}