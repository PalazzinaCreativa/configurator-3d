import * as THREE from 'three'
import { OrbitControls } from 'three-stdlib'
import getObject3dHeight from '../utils/getObject3dHeight'

interface Options {
  maxPolarAngle?: number,
  minPolarAngle?: number,
  enableDamping?: boolean,
  enablePan?: boolean,
  dampingFactor?: number,
  minDistance?: number,
  maxDistance?: number
}
export default (
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
  model: THREE.Object3D,
  options: Options = {
    enableDamping: true,
    enablePan: true,
    dampingFactor: 0.2,
    minDistance: 1,
    maxDistance: 4
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