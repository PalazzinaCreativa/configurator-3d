// TODO: Enhance colors and typography

export const consoleHead: () => void = () => {
  console.log('%c Vɪᴇᴡᴇʀ 3ᴅ', 'background-color: #2bbfcc; color: #1d2324;')
}

export const consoleInfo: (string) => void = (msg: string) => {
  consoleHead()
  console.info(msg)
}

export const consoleWarn: (string) => void = (msg: string) => {
  consoleHead()
  console.warn(msg)
}

export const consoleError: (string) => void = (msg: string) => {
  consoleHead()
  console.error(msg)
}
