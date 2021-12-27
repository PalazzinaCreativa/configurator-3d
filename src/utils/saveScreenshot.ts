import * as THREE from 'three'

export default (renderer: THREE.WebGLRenderer, downloadFileName: string = 'canvas.jpg') => {
  return new Promise((resolve, reject) => {
    try {
      const fileType = "image/jpeg"
      const imgData = renderer.domElement.toDataURL(fileType)

      const fakeLink = document.createElement('a')
      document.body.appendChild(fakeLink)
      fakeLink.download = downloadFileName
      fakeLink.href = imgData.replace(fileType, 'image/octet-stream')
      fakeLink.click()
      document.body.removeChild(fakeLink)
      return resolve(true)
    } catch (e) {
        console.error(e)
        return reject()
    }
  })
}