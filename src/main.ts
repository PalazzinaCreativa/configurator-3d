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
    background: 0xffffff,
    fog: {
      color: 0xffffff,
      near: 10,
      far: 50
    },
    hdri: '/hdri/i_Phone_Boxes_Reflection.exr'
  },
  models: [
    {
      path: '/models/base-d1.gltf',
      name: 'Base',
      position: {
        y: 0
      }
    },
    {
      path: '/models/annette.gltf',
      name: 'Model',
      position: {
        y: 0.50004
      }
    }
  ]
})

console.log(viewer)

const data = {
  annette: {
    'base-d1': {
      position: {
        y: 0.52559
      }
    },
    'base-l3': {
      position: {
        y: 0.52559
      }
    },
    'base-l12': {
      position: {
        y: 0.54628
      }
    },
    'base-l17': {
      position: {
        y: 0.52559
      }
    }
  },
  nina: {
    'base-d1': {
      position: {
        y: 0.50004
      }
    },
    'base-l3': {
      position: {
        y: 0.50004
      }
    },
    'base-l12': {
      position: {
        y: 0.51282
      }
    },
    'base-l17': {
      position: {
        y: 0.50004
      }
    }
  }
}
document
  .querySelectorAll('.menu button')
  .forEach(el => {
    el
      .addEventListener('click', async () => {
        // Change mesh
        if (el.getAttribute('data-type') === 'Model' || el.getAttribute('data-type') === 'Base') {
          const toRemove = el.getAttribute('data-type')

          if (!toRemove) return

          const toAdd = {
            path: `/models/${el.getAttribute('data-name')}.gltf`,
            name: el.getAttribute('data-type')
          }

          await viewer
            .replaceMesh(toRemove, toAdd, () => {
              document
                .querySelector(`.menu button[data-type=${el.getAttribute('data-type')}].active`)
                ?.classList.remove('active')
              el.classList.add('active')
            })

          const currentModel = document.querySelector('.menu button[data-type=Model].active')?.getAttribute('data-name') || ''
          const currentBase = document.querySelector('.menu button[data-type=Base].active')?.getAttribute('data-name') || ''
          viewer
            .updateMesh('Model', data[currentModel][currentBase])

          if (el.getAttribute('data-finish') === 'texture') {
            document.querySelector('.colors').style.display = 'none'
            document.querySelector('.textures').style.display = 'block'
          } else if (el.getAttribute('data-finish') === 'color') {
            document.querySelector('.colors').style.display = 'block'
            document.querySelector('.textures').style.display = 'none'
          }
        } else if (el.getAttribute('data-type') === 'Color') {
          const color = el.getAttribute('data-color')?.split(',').map(n => parseInt(n) || 0) || [0, 0, 0]
          viewer.updateColor('_change_color_', color)
          document.querySelectorAll('[data-type=Color').forEach(dtc => dtc.classList.remove('active'))
          el.classList.add('active')

          // viewer.updateTexture('_change_color_', el.getAttribute('data-color') || '')
        } else if (el.getAttribute('data-type') === 'Texture') {
          const texture = `/textures/${el.getAttribute('data-texture')}.png`
          viewer.updateTexture('_change_texture_', texture, parseInt(el.getAttribute('data-repeat')) || 1)
          document.querySelectorAll('[data-type=Texture').forEach(dtt => dtt.classList.remove('active'))
          el.classList.add('active')
        }

        viewer.updateTexture('wood_mat', '/textures/faggio-wegne.png')
      })
  })