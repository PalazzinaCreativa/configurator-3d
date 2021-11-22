import * as THREE from 'three'
import initScene from './initializers/initScene'
import initRenderer from './initializers/initRenderer'
import initCamera from './initializers/initCamera'
import initModel from './initializers/initModel'
import initControls from './initializers/initControls'
import initLights from './initializers/initLights'
import initGround from './initializers/initGround'
import animate from './methods/animate'
import onWindowResize from './utils/onWindowResize'
import { ViewerParams, Callback, ModelParams } from './interfaces'
import modelLoader from './methods/modelLoader'
import merge from 'lodash/merge'

export default class {
  domElement: HTMLElement | null
  onReady?: Callback
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  controls: any
  model: THREE.Object3D
  base: THREE.Object3D
  lights: any

  constructor (
    params: ViewerParams
  ) {
    this.domElement = typeof params.el === 'string'
      ? document.querySelector(params.el)
      : params.el
    this.init(params)
  }

  async init (params: ViewerParams) {
    if (!this.domElement) {
      console.error('3D Viewer: You need to specify a DOM Element.')
      return null
    }
    this.scene = await initScene(params.scene)
    this.renderer = initRenderer(this.domElement)
    this.camera = initCamera(params.camera)

    if (params.model) {
      this.model = await modelLoader(params.model)
    } else {
      this.model = await initModel(params.models)
    }
    this.model.name = 'MainModel'

    this.scene.add(this.model)

    this.controls = initControls(this.camera, this.renderer, this.model)

    this.lights = initLights(this.scene)

    window.addEventListener('resize', () => {
      onWindowResize(this.camera, this.renderer)
    }, false)

    const followCameraLights = this.lights
      .filter(l => l.followCamera)
      .map(l => l.light)

    const targetModelLights = this.lights
      .filter(l => l.targetModel)
      .map(l => l.light)

    targetModelLights
      .forEach((l: THREE.HemisphereLight | THREE.SpotLight) => {
        l.target = this.model
      })

    initGround(this.scene)
    animate(this.controls, this.renderer, this.scene, this.camera, followCameraLights)

    console.log('initialized')
    return {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      lights: this.lights,
      model: this.model
    }
  }

  replaceMesh (toRemove: string, toAdd: ModelParams | ModelParams[] | any, callback?: Callback) {
    return new Promise(async (resolve) => {
      const removeMesh = this.getMesh(toRemove)
      if (!removeMesh) {
        console.error("Viewer 3D: Can't find the mesh to remove")
        return null
      }

      this.model.remove(removeMesh)

      const newModel = await modelLoader(toAdd)
      this.model.add(newModel)

      if (callback) callback()
      return resolve(newModel)
    })
  }

  destroy () {
    this.scene.remove.apply(this.scene, this.scene.children)
  }

  updateMesh (name: string, options: { [key: string]: any }) {
    const model = this.getMesh(name)
    merge(model, options)
  }

  getMesh (name: string) {
    return this.model?.children?.find((m: THREE.Object3D) => m.name === name)
  }

  updateTexture (material: string, texturePath: string, repeat: number = 4, model: THREE.Object3D = this.model) {
    new THREE.TextureLoader().load(texturePath, (texture) => {
      texture.name = texturePath
      texture.repeat.set(repeat, repeat)
      model.traverse(child => {
        if (child.material && child.name.indexOf(material) > -1) {
          child.material.needsUpdate = true
          child.material.map = texture
        }
      })
    })
  }

  updateColor (material: string, color: [number, number, number] = [255, 255, 255], model: THREE.Object3D = this.model) {
    const [r, g, b] = color
    const newColor = new THREE.Color(Math.round(r / 255 * 100) / 100, Math.round(g / 255 * 100) / 100, Math.round(b / 255 * 100) / 100)
    console.log(newColor)
    model.traverse(child => {
      if (child.material && child.name.indexOf(material) > -1) {
        child.material.needsUpdate = true
        child.material.color = newColor
        console.log(child.material)
      }
    })
  }
}