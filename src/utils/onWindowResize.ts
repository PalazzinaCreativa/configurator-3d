import * as THREE from 'three'

export default (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
  camera.aspect = renderer.domElement.offsetWidth / renderer.domElement.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize( renderer.domElement.offsetWidth, renderer.domElement.offsetHeight )
}