import * as THREE from 'three'

export type Callback = () => void

export interface Axes {
  x?: number
  y?: number
  z?: number
}

export interface FogOptions {
  color?: number | undefined
  near?: number
  far?: number
}

export interface SceneOptions {
  background?: number | THREE.Color
  fog?: FogOptions | boolean,
  helper?: boolean,
  hdri?: boolean | string
}

export interface LightOptions {
  type: 'AmbientLight' | 'AmbientLightProbe' | 'DirectionalLight' | 'HemisphereLight' | 'HemisphereLightProbe' | 'Light' | 'LightProbe' | 'PointLight' | 'RectAreaLight' | 'SpotLight'
  name?: string
  color?: number
  intensity?: number
  position?: Axes
  defaultShadows?: boolean
  followCamera?: boolean
  targetModel?: boolean
  skyColor?: number
  groundColor?: number
  helper?: boolean | number
  [propName: string]: any
}

export interface ViewerParams {
  el: HTMLElement | string
  model?: ModelParams|string
  models?: {
      objects?: ModelParams[]
      positioning?: 'above' | 'below' | 'left' | 'right'
      space?: number
    }
    | ModelParams[]
  onReady?: Callback
  scene?: SceneOptions
  camera?: CameraOptions
  lights?: LightOptions[],
  renderer?: RendererOptions
}

export interface CameraOptions {
  fov?: number
  near?: number
  far?: number
  x?: number
  y?: number
  z?: number
}

export interface ModelParams {
  path: string
  name?: string | null
  onLoad?: Callback
  position?: Axes
  rotation?: Axes
  scale?: number
  texture?: string
  shadows?: boolean
}

export interface ControlsOptions {
  maxPolarAngle?: number,
  minPolarAngle?: number,
  enableDamping?: boolean,
  enablePan?: boolean,
  dampingFactor?: number,
  minDistance?: number,
  maxDistance?: number,
  [propName: string]: any
}

export interface screenshotOptions {
  position: Axes,
  format: string
}

export interface RendererOptions {
  [Props: string]: any
}