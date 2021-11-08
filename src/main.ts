import './style.css'
import Viewer from './Viewer'

const app = document.querySelector<HTMLDivElement>('#app')!


app.innerHTML = `
<div class="container"><canvas></canvas></div>
`

const test = () => {
  console.log('callback')
}
const viewer: Viewer = new Viewer({
  el: '.container',
  onReady: test,
  scene: {
    background: 0xdedede,
    fog: {
      color: 0xdedede,
      near: 10,
      far: 50
    }
  },
  models: {
    objects: [
      {
        path: '/models/base-l12.gltf',
        name: 'Base'
      },
      {
        path: '/models/nina.gltf',
        name: 'Model'
      }
    ],
    positioning: 'above',
    space: 0
  }
})

console.log(viewer)


const data = {
  case1: {
    base: 'l12',
    model: 'nina'
  },
  case2: {
    base: 'l5',
    model: 'annette'
  },
  case3: {
    base: 'l12',
    model: 'annette'
  },
  case4: {
    base: 'l3',
    model: 'nina'
  }
}

const current = data['case1']

document.querySelector('button')
  ?.addEventListener('click', () => {
    let next

    while (!next) {
      const random = Math.floor(Math.random() * Object.keys(data).length + 1) + 1
      next = data['case' + random]
    }

    const sameModel = current.model === next.model

    const toRemove = sameModel
      ? 'Base'
      : 'mainModel'

    const toAdd = sameModel
      ? {
          path: '/models/base-' + next.base + '.gltf',
          name: 'Base'
        }
      : {
        objects: [
          {
            path: '/model/' + next.model + '.gltf',
            name: 'Model'
          },
          {
            path: '/models/base-' + next.base + '.gltf',
            name: 'Base'
          }
        ],
        positioning: 'above',
        space: 0
      }

    viewer
      .replaceMesh(toRemove, toAdd, () => {
        console.log('fatto')
      })
  })