import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ControlsOptions } from '../interfaces'
import getObject3dHeight from '../utils/getObject3dHeight'

export default (
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  model: THREE.Object3D,
  // TODO: Controls Options Props
  options: ControlsOptions = {
    enableDamping: true,
    enablePan: false,
    maxPolarAngle: Math.PI / 2.2,
    minPolarAngle: Math.PI / 4,
    dampingFactor: 0.2,
    minDistance: 1,
    maxDistance: 3.2,
  }
) => {
  if (!camera || !renderer) return
  const controls = new OrbitControls( camera, renderer.domElement )

  Object.keys(options)
    .forEach((key: string) => {
      if (typeof options[key] === 'undefined') return
      controls[key] = options[key]
    })

  const modelHeight = getObject3dHeight(model)

  controls.target = new THREE.Vector3(0, modelHeight / 2, 0)

  return controls
}