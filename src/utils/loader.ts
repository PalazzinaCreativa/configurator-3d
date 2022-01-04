import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
loader.setDRACOLoader( dracoLoader )
dracoLoader.setDecoderPath("three/examples/js/libs/draco")

export default loader