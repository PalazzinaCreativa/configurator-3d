import * as THREE from 'three'
import loader from '../utils/loader'

type Callback = () => void
interface axis {
  x: number,
  y: number,
  z: number
}

interface Options {
  scale?: number,
  position?: axis,
  rotation?: axis,
  shadows?: boolean
}
export default (scene, meshId: string, onReady?: Callback, options: Options = { shadows: true }) => {
  if (!scene || !meshId) return null
  const rootPath = '/models/'
  const initialMaterial = new THREE.MeshPhongMaterial( { color: 0xf1f1f1, shininess: 10 } )
  const filePath = `${rootPath}base-${meshId}.gltf`

  return new Promise((resolve, reject) => {
    loader.load(filePath, gltf => {
      const mesh = gltf.scene.children[0]

      const box = new THREE.Box3().setFromObject(mesh)
      const meshHeight = box.max.z - box.min.z

      const model = scene.children.find(c => c.name === 'mainModel')
      const main = model.children.find(c => c.name === 'ANNETTE_CHAIR')
      main.position.set(0, -meshHeight * main.scale.x, 0)

      const { scale, position, rotation } = options
      if (scale) mesh.scale.set(scale, scale, scale)
      if (rotation) mesh.rotation.set(rotation.x, rotation.y, rotation.z)
      if (position) mesh.position.set(position.x, position.y, position.z)
      mesh.traverse(o => {
        if (!o.isMesh) return
        if (options.shadows) {
          o.castShadow = true
          o.receiveShadow = true
        }
        o.material = initialMaterial
      })

      model.remove(
        model.children.find(c => c.name !== 'ANNETTE_CHAIR')
      )
      model.add(mesh)
      if (onReady) onReady()
      resolve(mesh)
    }, undefined, error => {
      console.error(error)
      reject(error)
    })
  })
}