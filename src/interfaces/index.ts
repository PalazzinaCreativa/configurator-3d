// TODO: Organize interfaces in groups
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
  background?: number | THREE.Color | null
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
  meshes?: Mesh[]
  onReady?: Callback
  scene?: SceneOptions
  camera?: CameraOptions
  lights?: LightOptions[],
  renderer?: RendererOptions
}

export interface Mesh {
  type: 'BoxGeomtry' | 'CircleGeometry' | 'ConeGeometry' | 'CylinderGeometry' | 'DodecahedronGeometry' | 'PlaneGeometry' | 'RingGeometry' | 'SphereGeometry' | 'TetrahedronGeometry' | 'TorusGeometry' | 'TorusKnotGeometry' | 'WireframeGeometry'
  args: number[],
  material: Material,
  name?: string,
  position?: Axes,
  rotation?: Axes,
  options?: {
    [Props: string]: any
  }
}

export interface Material {
  type:  'LineBasicMaterial' | 'LineDashedMaterial' | 'Material' | 'MeshBasicMaterial' | 'MeshDepthMaterial' | 'MeshDistanceMaterial' | 'MeshLambertMaterial' | 'MeshMatcapMaterial' | 'MeshNormalMaterial' | 'MeshPhongMaterial' | 'MeshPhysicalMaterial' | 'MeshStandardMaterial' | 'MeshToonMaterial' | 'PointsMaterial' | 'RawShaderMaterial' | 'ShaderMaterial' | 'ShadowMaterial' | 'SpriteMaterial',
  options: {
    [Props: string]: any
  }
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
  position?: Axes,
  format?: string,
  background?: number
}

export interface RendererOptions {
  [Props: string]: any
}

export interface UpdateTextureParams {
  material: string,
  texturePath: string,
  repeat?: number,
  model?: THREE.Object3D,
  exclude: string[],
  name?: string
}

export interface UpdateColorParams {
  material?: string,
  mesh?: string,
  color: [number, number, number],
  model?: THREE.Object3D
}