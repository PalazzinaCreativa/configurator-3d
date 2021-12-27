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
import { ViewerParams, Callback, ModelParams, Axes, screenshotOptions } from './interfaces'
import modelLoader from './methods/modelLoader'
import merge from 'lodash/merge'
import saveScreenshot from './utils/saveScreenshot'

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

    const targetModelLights = this.lights
      .filter(l => l.targetModel)
      .map(l => l.light)

    targetModelLights
      .forEach((l: THREE.HemisphereLight | THREE.SpotLight) => {
        l.target = this.model
      })

    initGround(this.scene)
    this.render()

    console.log('initialized')
    console.log('Scene', this.scene)
    return {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      lights: this.lights,
      model: this.model
    }
  }

  render () {
    const followCameraLights = this.lights
    .filter(l => l.followCamera)
    .map(l => l.light)

    animate(this.controls, this.renderer, this.scene, this.camera, followCameraLights)
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
          child.material.map.flipY = false
          child.material.map.anisotropy = 16
          child.material.map.wrapS = 1000
          child.material.map.wrapT = 1000
          child.material.map.minFilter = 1006
          child.material.map.encoding = 3001
        }
      })
    })
  }

  updateColor (material: string, color: [number, number, number] = [255, 255, 255], model: THREE.Object3D = this.model) {
    const [r, g, b] = color
    const newColor = new THREE.Color(Math.round(r / 255 * 100) / 100, Math.round(g / 255 * 100) / 100, Math.round(b / 255 * 100) / 100)
    model.traverse(child => {
      if (child.material && child.name.indexOf(material) > -1) {
        child.material.needsUpdate = true
        child.material.color = newColor
        console.log(child.material)
      }
    })
  }

  updateMaterial (material: string, options: any, model: THREE.Object3D = this.model) {
    if (typeof options !== 'object') return
    model.traverse(child => {
      if (child.material && child.name.indexOf(material) > -1) {
        child.material.needsUpdate = true
        Object.keys(options).forEach((opt) => {
          child.material[opt] = parseFloat(options[opt])
        })
      }
    })
  }

  getScreenshot ( props: screenshotOptions ) {
    const defaultOptions = {
      position: { x: 0.5, y: 1, z: 2 },
      format: 'image/jpeg'
    }
    const options = merge({}, props, defaultOptions)
    const { position, format } = options

    return new Promise((resolve) => {
      const cameraPosition = this.camera.position.clone()
      this.camera.position.set(position.x, position.y, position.z)
      this.controls.update()
      window.requestAnimationFrame(async () => {
        const imgData = this.renderer.domElement.toDataURL(format)
        this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
        this.controls.update()
        return resolve(imgData)
      })
    })
  }
}