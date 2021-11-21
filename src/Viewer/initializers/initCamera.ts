import * as THREE from 'three'
import { CameraOptions } from '../interfaces'
import merge from 'lodash/merge'

const defaultOptions: CameraOptions = {
  fov: 50,
  near: 0.1,
  far: 100,
  x: 0.5,
  y: 1,
  z: 2
}
export default (props: CameraOptions = defaultOptions) => {
  const options = merge({}, defaultOptions, props)
  const { fov, near, far, x, y, z } = options
  const camera: any = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, near, far)
  camera.position.set(x, y, z)

  return camera
}