import * as THREE from 'three'

export default (
  model: THREE.Object3D
) => {
  const boundingBox = new THREE.Box3().setFromObject(model)
  return boundingBox.max.y - boundingBox.min.y
}