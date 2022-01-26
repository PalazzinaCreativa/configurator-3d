// TODO: Manage rejects
// TODO: Readme + Documentation
// TODO: Organize main.ts
// TODO: Intellisense
// TODO: unique ids
// TODO: Tests
// TODO: Confgure JSDocs

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
import { ViewerParams, Callback, ModelParams, screenshotOptions, UpdateTextureParams, UpdateColorParams } from './interfaces'
import modelLoader from './methods/modelLoader'
import merge from 'lodash/merge'
import { consoleInfo, consoleWarn, consoleError } from './utils/consoleLog'
import getColorFromRGB from './utils/getColorFromRGB'

/**
 * Show and controls a 3D Viewer rendered on HTML Canvas.
 * @constructor
 * @param params - Informations of the viewer.
 * @param {string || HTMLElement} params.el - HTML Element used as wrapper for the 3D Viewer.
 * @param {} params.scene - Scene options.
 * @param {} params.model - Single model options.
 * @param {} params.models - Multiple model options.
 * @param {} params.camera - Camera options.
 * @param {} params.lights - Lights options.
 * @param {} params.renderer - Renderer options.
 * @param {() => void} params.onReady - Callback.
 */
export default class {
  domElement: HTMLElement | null
  onReady?: Callback
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  // TODO: Controls type
  controls: any
  model: THREE.Object3D
  base: THREE.Object3D
  // TODO: Lights type
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
      consoleError('Viewer 3D: You need to specify a DOM Element.')
      return null
    }

    // Initialize scene, renderer and camera with props
    this.scene = await initScene(params.scene)
    this.renderer = await initRenderer(this.domElement, params.renderer || {})
    this.camera = initCamera(params.camera, this.renderer.domElement)

    // TODO: Refactor model / models (acceot both or unify terms)
    // Initialize model
    if (params.model) {
      // If single model
      this.model = new THREE.Group()
      this.model.rotation.y = Math.PI
      const model = await modelLoader(params.model)
      this.model.add(model)
    } else if (params.models) {
      // if multiple models
      this.model = await initModel(params.models)
    }
    this.model.name = 'MainModel'
    this.scene.add(this.model)

    // Init Orbit Controls
    this.controls = initControls(this.camera, this.renderer, this.model)

    // Init lights
    this.lights = initLights(this.scene)

    // Actions based on window/element size
    onWindowResize(this.camera, this.renderer)
    // window.addEventListener('resize', () => {
    //   onWindowResize(this.camera, this.renderer)
    // }, false)

    // Init ground
    initGround(this.scene)

    // Render
    this.render()

    // Viewer is ready, do callback
    if (params.onReady) params.onReady()

    consoleInfo('Viewer 3D is ready. Enjoy your 3D :)')

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

  /**
  * Remove "toRemove" mesh and add "toAdd" mesh.
  * @param {string} toRemove - Name of the mesh to remove.
  * @param {} toAdd - Options of the model to add.
  * @param {callback} callback - Callback.
  * @return {} The updated model.
  */
  replaceMesh (toRemove: string, toAdd: ModelParams | ModelParams[] | any, callback?: Callback) {
    return new Promise(async (resolve) => {
      const removeMesh = this.getMesh(toRemove)
      if (!removeMesh) {
        consoleError("Viewer 3D: Can't replace mesh. No model found with name " + toRemove)
        return null
      }

      this.model.remove(removeMesh)

      const newModel = await modelLoader(toAdd)
      this.model.add(newModel)

      if (callback) callback()
      return resolve(newModel)
    })
  }

  /**
  * Add a new mesh.
  * @param {} params - Options of the new mesh.
  * @param {callback} callback - Callback.
  * @return {} The new mesh.
  */
  async addMesh (params: ModelParams, callback?: Callback) {
    const newMesh = await modelLoader(params)
    this.model.add(newMesh)
    if (callback) callback()
    return newMesh
  }

  /**
   * Update an existing mesh.
   * @param {string} name - Name of the mesh that have to be updated.
   * @param {[key: string]: any} options - Update's options.
   * @param {callback} callback - Callback.
   */
  async updateMesh (name: string, options: { [key: string]: any }, callback?: Callback) {
    const model = this.getMesh(name)
    if (!model) {
      consoleError("Viewer 3D: Can't update mesh. No model found with name " + name)
      return
    }
    merge(model, options)
    if (callback) callback()
  }

  /**
   * Get a mesh.
   * @param {string} name - Name of the mesh.
   * @return {} The mesh.
   */
  getMesh (name: string) {
    const mesh = this.model?.children?.find((m: THREE.Object3D) => m.name === name)
    if (!mesh) {
      consoleError('Viewer 3D: No mesh found with name ' + name)
      return null
    }
    return this.model?.children?.find((m: THREE.Object3D) => m.name === name)
  }

  /**
   * Update texture on selected material.
   * @param {} params - Options.
   * @param {string} params.material - Name of the material to be updated.
   * @param {string} params.texturePath - Path of the texture.
   * @param {callback} callback - Callback.
   */
  updateTexture (params: UpdateTextureParams, callback: Callback) {
    const defaultOptions = {
      repeat: 4,
      model: this.model
    }

    const options = merge({}, defaultOptions, params)

    const { material, texturePath, repeat, model, name, exclude } = options
    return new Promise(resolve => {
      new THREE.TextureLoader().load(texturePath, (texture) => {
        let count
        texture.name = name || texturePath
        texture.repeat.set(repeat, repeat)
        model.traverse(child => {
          if (!child.material || child.name.indexOf(material) === -1) return
          if (exclude && exclude.indexOf(child.name) > -1) return
          // FIXME: Default options
          child.material.needsUpdate = true
          child.material.map = texture
          child.material.map.flipY = false
          child.material.map.anisotropy = 16
          child.material.map.wrapS = 1000
          child.material.map.wrapT = 1000
          child.material.map.minFilter = 1006
          child.material.map.encoding = 3001

          count++
        })

        if (!count) {
          consoleWarn('Viewer 3D: No mesh has been updated. No material ' + material + ' found.')
        }

        if (callback) callback()
        resolve(texture)
      })
    })
  }

  /**
   * Update color on selected material.
   * @param {} params - Options.
   * @param {string} params.material - Name of the material to be updated.
   * @param {[number, number, number]} params.rgb - New color in RGB Format.
   * @param {callback} callback - Callback.
   */
  async updateColor (params: UpdateColorParams, callback?: Callback) {
    const defaultOptions = {
      color: [255, 255, 255],
      model: this.model
    }

    const options = merge({}, defaultOptions, params)

    const { material, color, model } = options
    const [r, g, b] = color
    const newColor = getColorFromRGB(r, g, b)

    let count = 0
    model.traverse(child => {
      if (!child.material || child.name.indexOf(material) === -1) return
      child.material.needsUpdate = true
      child.material.color = newColor
      count++
    })

    // Log error if no meshes has been updated
    if (!count) {
      consoleWarn('Viewer 3D: No mesh has been updated. No material ' + material + ' found.')
    }

    if (callback) callback()
  }

  /**
   * Update material
   * @param {string} name – Name of the material to be updated.
   * @param {} options - Options.
   * @param {callback} callback - Callback.
   */
  async updateMaterial (material: string, options: { [Props: string]: any }, callback?: Callback) {
    const model = options.model || this.model
    if (typeof options !== 'object') return
    model.traverse(child => {
      if (!child.material || child.name.indexOf(material) === -1) return
      child.material.needsUpdate = true
      Object.keys(options).forEach((opt) => {
        child.material[opt] = parseFloat(options[opt])
      })
    })

    if (callback) callback()
  }

  // Return a base64 image of current canvas on a given position
  getScreenshot ( props: screenshotOptions ) {
    const defaultOptions = {
      position: { x: 0.5, y: 1, z: 2 },
      format: 'image/jpeg'
    }
    const options = merge({}, props, defaultOptions)
    const { position, format } = options

    return new Promise((resolve) => {
      let backupBg
      if (options.background) {
        backupBg = this.scene.background
        ? this.scene.background.clone()
        : null
        this.scene.background = options.background
      }
      const cameraPositionBackup = this.camera.position.clone()
      this.camera.position.set(position.x, position.y, position.z)
      this.controls.update()
      window.requestAnimationFrame(async () => {
        const imgData = this.renderer.domElement.toDataURL(format)
        this.camera.position.set(cameraPositionBackup.x, cameraPositionBackup.y, cameraPositionBackup.z)
        if (backupBg) this.scene.background = backupBg
        this.controls.update()
        return resolve(imgData)
      })
    })
  }

  destroy () {
    this.scene.remove.apply(this.scene, this.scene.children)
  }
}