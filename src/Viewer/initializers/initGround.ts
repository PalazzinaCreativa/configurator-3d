import * as THREE from 'three'

export default (scene) => {
  const groundGeometry: any = new THREE.PlaneGeometry(3000, 3000)
  const groundMaterial: any = new THREE.ShadowMaterial( { opacity: 0.1 } )
  // const groundMaterial: any = new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false})

  const ground: any = new THREE.Mesh(groundGeometry, groundMaterial)

  ground.name = 'Ground'
  ground.rotation.x = -Math.PI / 2
  ground.position.y = 0
  ground.receiveShadow = true

  scene.add(ground)
}