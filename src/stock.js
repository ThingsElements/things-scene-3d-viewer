import THREE from './threejs'
import hilbert3D from './threejs/hilbert3D'
// import THREEx from './threejs/threeX'

export default class Rack extends THREE.Mesh {

  constructor(model) {

    super();

    this._model = model;

    this.createObject(model);

  }

  createObject(model) {

    let cx = model.cx;
    let cy = model.cy;
    let cz = model.cz;

    this.createStock(model.width, model.height, model.depth)

  }

  createStock(w, h, d) {

    let scale = 0.7;

    this.geometry = new THREE.BoxGeometry(w * scale, d * scale, h * scale);
    // var stockMaterial = new THREE.MeshBasicMaterial( { color : '#ff9900', side: THREE.DoubleSide } );
    this.material = new THREE.MeshLambertMaterial( { color : '#ff9900', side: THREE.DoubleSide } );

    var stock = new THREE.Mesh(this.geometry, this.material)
    this.type = 'stock'
    this.position.set(0, -(1-scale) * 0.5 * d , 0)

  }

  raycast(raycaster, intersects) {

    if(this.material.transparent && this.material.opacity === 0)
      return

    super.raycast()

  }

}
