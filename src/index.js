import WebGL3dViewer from './webgl-3d-Viewer'
import Cube from './cube'
import Floor from './floor'
import Rack from './rack'
import ForkLift from './forkLift'
import Person from './person'

var ThingsScene3dViewer = {
  WebGL3dViewer,
  Cube,
  Floor,
  Rack,
  ForkLift,
  Person
}

if(typeof window !== 'undefined')
  window.ThingsScene3dViewer = ThingsScene3dViewer

if (typeof global !== 'undefined') {
  global.ThingsScene3dViewer  = ThingsScene3dViewer
}

export default ThingsScene3dViewer
