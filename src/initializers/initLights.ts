import * as THREE from 'three'
import { LightOptions } from '../interfaces'

const defaultOptions: LightOptions[] = [
  {
    type: 'HemisphereLight',
    skyColor: 0xffffff,
    groundColor: 0x999999,
    intensity: 1.2,
    position: {
      x: 0,
      y: 100,
      z: 0
    }
  },
  {
    type: 'SpotLight',
    color: 0xffffff,
    intensity: 0.2,
    // angle: Math.PI / 2,
    defaultShadows: true,
    position: {
      x: 0,
      y: 6,
      z: 0
    },
    targetModel: true
  },
  // {
  //   type: 'SpotLight',
  //   color: 0xffffff,
  //   intensity: 0.1,
  //   penumbra: 0.2,
  //   followCamera: true,
  //   targetModel: true,
  //   angle: Math.PI / 6,
  //   position: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   }
  // }
]

const addProperties = (target: any, params: object) => {
  const excludeFromLoop = ['type', 'followCamera', 'targetModel', 'skyColor', 'groundColor', 'defaultShadows', 'position', 'color', 'intensity', 'helper']
  Object
    .keys(params)
    .forEach((p: string) => {
      if (excludeFromLoop.indexOf(p) > -1) return
      if (typeof params[p] === 'object') {
        addProperties(target[p], params[p])
        return
      }
      target[p] = params[p]
    })
}
const createLight = (params: LightOptions) => {
  let light
  if (params.type === 'HemisphereLight') {
    light = new THREE.HemisphereLight(params.skyColor || 0xffffff, params.groundColor || 0xffffff, params.intensity || 1)
  } else {
    light = new THREE[params.type](params.color || 0xffffff, params.intensity || 1)
  }
  if (params.position) light.position.set(params.position?.x || 0, params.position?.y || 0, params.position?.z || 0)
  if (params.defaultShadows) {
    light.castShadow = true
    light.shadow.bias = 0.001
    light.penumbra = 0.4
    // light.shadow.camera.near = 8
    // light.shadow.camera.far = 200
    light.shadow.mapSize = new THREE.Vector2(256, 256)
    light.shadow.radius = 6
  }

  addProperties(light, params)

  return light
}

export default (
  scene: THREE.Scene,
  props: LightOptions[] = defaultOptions
) => {
  if (!scene) return

  let lights: {
    light: THREE.HemisphereLight | THREE.SpotLight | THREE.DirectionalLight
    followCamera?: boolean,
    targetModel?: boolean
  }[] = []

  props
    .forEach((params: LightOptions) => {
      const light = createLight(params)
      scene.add(light)
      lights.push({
        light,
        followCamera: params.followCamera,
        targetModel: params.targetModel
      })

      if (params.helper) {
        const helper = new THREE[params.type + 'Helper'](light, 5)
        if (typeof params.helper === 'number') helper.color = params.helper
        scene.add(helper)
      }
    })

  return lights
}