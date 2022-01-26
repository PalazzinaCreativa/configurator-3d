import * as THREE from 'three'

export default (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
  camera.aspect = renderer.domElement.parentNode.offsetWidth / renderer.domElement.parentNode.offsetHeight
  camera.updateProjectionMatrix()
  renderer.domElement.setAttribute('width', renderer.domElement.parentNode.offsetWidth)
  renderer.domElement.setAttribute('height', renderer.domElement.parentNode.offsetHeight)
  renderer.setSize( renderer.domElement.parentNode.offsetWidth, renderer.domElement.parentNode.offsetHeight )
}