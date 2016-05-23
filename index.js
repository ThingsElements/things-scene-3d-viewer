import * as ThingsScene3dViewer from './src'

export default ThingsScene3dViewer

if(typeof window !== 'undefined')
  window.ThingsScene3dViewer = ThingsScene3dViewer

if (typeof global !== 'undefined') {
  global.ThingsScene3dViewer  = ThingsScene3dViewer
}
