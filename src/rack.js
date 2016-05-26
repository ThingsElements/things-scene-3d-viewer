import THREE from './threejs'
import hilbert3D from './threejs/hilbert3D'
// import THREEx from './threejs/threeX'

export default class Rack {

  constructor(viewer, model) {
    this._viewer = viewer;
    this._model = model;

    this.createObject();
  }

  createObject() {
    var viewer = this._viewer
    var scene = viewer._scene
    var model = this._model;

    var canvasSize = {
      width : 1200,
      height: 800
    }

    var colorR = 0
    var colorG = 99
    var colorB = 50

    for (var i = 0; i < model.shelves; i++) {
      colorR += 15;
      colorG -= 11;
      colorB += 1;

      let cx = (model.left + (model.width/2)) - canvasSize.width/2;
      let cy = (model.top + (model.height/2)) - canvasSize.height/2;
      let cz = (i + 0.5) * model.depth + 3

      var object = this.createRackFrame(model.width, model.height, model.depth)
      // object._type = model.type;
      object._model = model;
      // object._location = model.location + "_" + (i+1)
      object.position.set(cx, cz, cy)

      scene.add(object)

      var board = this.createRackBoard(model.width, model.height)
      board.position.set(cx, cz + model.depth/2, cy)
    	board.rotation.x = Math.PI / 2;
      scene.add(board)

      var board = this.createRackBoard(model.width, model.height)
      board.position.set(cx, cz - model.depth/2, cy)
    	board.rotation.x = Math.PI / 2;
      scene.add(board)

      var board = this.createRackBoard(model.width, model.depth)
      board.position.set(cx, cz , cy- model.height/2)
      // board.rotation.x = Math.PI / 2;
      board._location = model.location + "_" + (i+1)
      board._type = model.type
      scene.add(board)

    }
  }

  createRackFrame(w, h, d) {

    var geometryCube = this.cube({
      width: w,
      height : d,
      depth : h
    })

    return new THREE.LineSegments( geometryCube, new THREE.LineDashedMaterial( { color: 0xccaa00, dashSize: 3, gapSize: 1, linewidth: 5 } ) );;

  }

  createRackBoard(w, h) {

  	var boardMaterial = new THREE.MeshBasicMaterial( { color : 'rgba(100, 200, 100, 0)', side: THREE.DoubleSide } );
  	var boardGeometry = new THREE.PlaneGeometry(w, h, 10, 10);
  	var board = new THREE.Mesh(boardGeometry, boardMaterial);

    return board
  }

  cube( size ) {

    var w = size.width * 0.5;
    var h = size.height * 0.5;
    var d = size.depth * 0.5;

		var geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3( -w, -h, -d ),
			new THREE.Vector3( -w, h, -d ),
			new THREE.Vector3( -w, h, -d ),
			new THREE.Vector3( w, h, -d ),
			new THREE.Vector3( w, h, -d ),
			new THREE.Vector3( w, -h, -d ),
			new THREE.Vector3( w, -h, -d ),
			new THREE.Vector3( -w, -h, -d ),
			new THREE.Vector3( -w, -h, d ),
			new THREE.Vector3( -w, h, d ),
			new THREE.Vector3( -w, h, d ),
			new THREE.Vector3( w, h, d ),
			new THREE.Vector3( w, h, d ),
			new THREE.Vector3( w, -h, d ),
			new THREE.Vector3( w, -h, d ),
			new THREE.Vector3( -w, -h, d ),
			new THREE.Vector3( -w, -h, -d ),
			new THREE.Vector3( -w, -h, d ),
			new THREE.Vector3( -w, h, -d ),
			new THREE.Vector3( -w, h, d ),
			new THREE.Vector3( w, h, -d ),
			new THREE.Vector3( w, h, d ),
			new THREE.Vector3( w, -h, -d ),
			new THREE.Vector3( w, -h, d )
		 );
		return geometry;
	}


}
