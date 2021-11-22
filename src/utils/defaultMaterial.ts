import * as THREE from 'three'

export default new THREE.MeshPhongMaterial( { color: 0xf1f1f1, shininess: 10 } )

export const customMaterial = ( color: number = 0xf1f1f1, shininess: number = 10 ) => {
  return new THREE.MeshPhongMaterial( { color, shininess } )
}