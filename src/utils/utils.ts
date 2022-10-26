export const getImgSrc = (name: string, ext: string = 'png') => {
  if (typeof name === 'undefined') return 'error.png'
  const path = `/src/assets/images/${name}.${ext}`
  const modules = import.meta.glob('/src/assets/images/**/*', { eager: true })
  return modules[path]?.default
}
