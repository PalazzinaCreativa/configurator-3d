import * as THREE from 'three'
import { ModelParams } from '../interfaces'
import merge from 'lodash/merge'
import loader from '../utils/loader'

const defaultOptions: ModelParams = {
  path: '',
  name: undefined,
  position: {
    x: 0,
    y: 0,
    z: 0
  },
  rotation: {
    x: 0,
    y: 0,
    z: 0
  },
  scale: 1,
  shadows: true
}

export default (props: ModelParams = defaultOptions) => {
  if (!props.path) {
    console.error('Viewer 3D: You need to specify the model path')
    return null
  }

  const options = merge({}, defaultOptions, props)

  return new Promise((resolve, reject) => {
    loader.load(options.path, gltf => {
      const model = gltf.scene || gltf
      if (options.name) {
        model.name = options.name
      } else {
        console.warn('Viewer 3D: Is better to specify a name for every model.')
      }

      const { scale, position, rotation } = options
      if (scale) model.scale.set(scale, scale, scale)
      if (rotation) model.rotation.set(rotation.x, rotation.y, rotation.z)
      if (position) model.position.set(position.x, position.y, position.z)

      let texture = undefined
      if (options.texture) {
        texture = new THREE.TextureLoader().load( 'textures/dark.png' )
      }
      model.traverse(o => {
        if (!o.isMesh) return
        o.castShadow = true
        o.receiveShadow = true
        if (o.material.map) {
          if (texture) o.material.map = texture
          o.material.map.anisotropy = 16
        }
        if (o.material && o.material.name.indexOf('poliuretano') > -1) {
          o.material.envMapIntensity = 0.3
          o.material.toneMapped = false
        }
      })

      if (options.onLoad) options.onLoad(model)
      resolve(model)

    }, undefined, error => {
      console.error(error)
      reject(error)
    })
  })
}