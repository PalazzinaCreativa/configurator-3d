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
    this.scene = initScene(params.scene)
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

  async replaceMesh (toRemove: string, toAdd: ModelParams | ModelParams[] | any, callback?: Callback) {
    const removeMesh = this.scene.children.find(m => m.name === toRemove)
      || this.scene.children.find(m => m.name === 'MainModel').find(m => m.name === toRemove)
    if (!removeMesh) {
      console.error("Viewer 3D: Can't find the mesh to remove")
      return null
    }

    const newModel = await modelLoader(toAdd)
    if (callback) callback()
    return newModel
  }

  destroy () {
    this.scene.remove.apply(this.scene, this.scene.children)
  }
}