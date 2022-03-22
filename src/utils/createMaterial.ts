import * as THREE from 'three'
import { Material } from "../interfaces"

export default ({ type, options}: Material) => {
  return new THREE[type](options)
}