import * as THREE from 'three'
import modelLoader from '../methods/modelLoader'
import getObject3dHeight from '../utils/getObject3dHeight'
import getObject3dWidth from '../utils/getObject3dWidth'
import { ModelParams } from "../interfaces"

interface Props {
  objects?: ModelParams[]
  positioning?: 'above' | 'below' | 'left' | 'right'
  space?: number
}

export default (props?: Props | ModelParams[]) => {
  if (!props) {
    console.error('Viewer 3D: No models specified')
    return null
  }
  let model


  return new Promise(async (resolve, reject) => {
    const iterableModels: any = "objects" in props
      ? props?.objects
      : props

    if (!iterableModels) {
      return reject()
    }

    const models: THREE.Object3D[] = await Promise.all(
      iterableModels
        .map(async (m) => {
          const model: THREE.Object3D = await modelLoader(m)
          model.name = m.name
          return model
        })
    )

    model = new THREE.Group()
    model.rotation.y = Math.PI
    model.name = 'MainModel'

    models
      .forEach((m: THREE.Object3D, i: number) => {
        if ("positioning" in props && i !== 0) {
          const positioning = props?.positioning
          const prevModelHeight: number = getObject3dHeight(models[i - 1])
          const prevModelWidth: number = getObject3dWidth(models[i - 1])
          const space = props?.space || 0
          const x: number = positioning === 'right'
            ? prevModelWidth + models[i - 1].position.x + space
            : positioning === 'left'
              ? -prevModelWidth - models[i - 1].position.x - space
              : 0

          const y: number = positioning === 'above'
            ? prevModelHeight + models[i - 1].position.y + space
            : positioning === 'below'
              ? -prevModelHeight - models[i - 1].position.y - space
              : 0

          m.position.set(x, y, 0)
        }
        model.add(m)
      })

    resolve(model)
  })
}