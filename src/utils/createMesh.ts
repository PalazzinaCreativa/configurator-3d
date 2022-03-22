import * as THREE from 'three'
import { Mesh } from "../interfaces";
import createMaterial from './createMaterial';

export default ({type, args, material, position, rotation, name, options}: Mesh) => {
  const geometry = new THREE[type](...args)
  const newMaterial = createMaterial(material)
  const mesh = new THREE.Mesh(geometry, newMaterial)

  if (name) mesh.name = name
  if (position) {
    mesh.position.x = position.x || 0
    mesh.position.y = position.y || 0
    mesh.position.z = position.z || 0
  }
  if (rotation) {
    mesh.rotation.x = rotation.x || 0
    mesh.rotation.y = rotation.y || 0
    mesh.rotation.z = rotation.z || 0
  }

  if (options) {
    Object.entries(options)
      .forEach(([key, value]) => {
        mesh[key] = value
      })
  }

  return mesh
}