import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
loader.setDRACOLoader( dracoLoader )
dracoLoader.setDecoderPath("https://raw.githubusercontent.com/PalazzinaCreativa/configurator-3d/main/public/libs/draco/")

export default loader