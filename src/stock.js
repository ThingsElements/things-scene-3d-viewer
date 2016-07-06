import THREE from './threejs'
import hilbert3D from './threejs/hilbert3D'
// import THREEx from './threejs/threeX'

export default class Stock extends THREE.Mesh {

  constructor(model) {

    super();

    this._model = model;

    this.createObject(model);

  }

  createObject(model) {

    this.createStock(model.width, model.height, model.depth)

  }

  createStock(w, h, d) {

    this.geometry = new THREE.BoxGeometry(w, d, h);
    this.material = new THREE.MeshLambertMaterial( { color : '#ccaa76', side: THREE.FrontSide } );
    this.type = 'stock'

  }

}
