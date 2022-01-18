import * as THREE from 'three'

export default (r: number, g: number, b: number) => {
  return new THREE.Color(
    Math.round(r / 255 * 100) / 100,
    Math.round(g / 255 * 100) / 100,
    Math.round(b / 255 * 100) / 100)
}