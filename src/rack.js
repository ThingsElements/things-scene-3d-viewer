import THREE from './threejs'
import hilbert3D from './threejs/hilbert3D'
// import THREEx from './threejs/threeX'

export default class Rack extends THREE.Object3D {

  constructor(model) {
    super();

    this._model = model;

    this.createObject(model);
  }

  static createRacks(model, canvasSize) {

    let rotation = model.rotation || {}

    var racks = [];

    for (var i = 0; i < model.shelves; i++) {

      var m = {
        type : model.type,
        cx : (model.left + (model.width/2)) - canvasSize.width/2,
        cy : (model.top + (model.height/2)) - canvasSize.height/2,
        cz : (i + 0.5) * model.depth,
        width : model.width,
        height : model.height,
        depth: model.depth,
        rotation : rotation,
        location : model.location + "_" + (i+1),
        status: model.status
      }

      racks.push(new Rack(m))
    }

    return racks;
  }

  createObject(model) {

    let cx = model.cx;
    let cy = model.cy;
    let cz = model.cz;

    let rotation = model.rotation || {}

    this.type = model.type

    var frame = this.createRackFrame(model.width, model.height, model.depth)

    this.add(frame)

    var board = this.createRackBoard(model.width, model.height)
    board.position.set(0, -model.depth/2, 0)
    board.rotation.x = Math.PI / 2;

    this.add(board)

    var board = this.createRackBoard(model.width, model.height)
    board.position.set(0, model.depth/2, 0)
    board.rotation.x = Math.PI / 2;

    this.add(board)

    var stock = this.createStock(model.width, model.height, model.depth)

    this.add(stock)

    this.position.set(cx, cz, cy)
    this.rotation.x = rotation.x || 0
    this.rotation.y = rotation.y || 0
    this.rotation.z = rotation.z || 0
    this.userData = {
      type : 'rack',
      location : model.location,
      stock : stock
    }
    this.name = model.location
  }

  createRackFrame(w, h, d) {

    this.geometry = this.cube({
      width: w,
      height : d,
      depth : h
    })

    // return new THREE.LineSegments( this.geometry, new THREE.LineDashedMaterial( { color: 0xccaa00, dashSize: 3, gapSize: 1, linewidth: 2 } ) );
    return new THREE.LineSegments( this.geometry, new THREE.LineDashedMaterial( { color: 'gray', dashSize: 3, gapSize: 1, linewidth: 2 } ) );
  }

  createRackBoard(w, h) {



    // var boardTexture = new THREE.TextureLoader().load('textures/textured-white-plastic-close-up.jpg');
    // boardTexture.wrapS = boardTexture.wrapT = THREE.RepeatWrapping;
  	// boardTexture.repeat.set( 100, 100 );

  	// var boardMaterial = new THREE.MeshBasicMaterial( { map: boardTexture, side: THREE.DoubleSide } );
  	var boardMaterial = new THREE.MeshBasicMaterial( { color: '#3c3c3c', side: THREE.DoubleSide } );
  	var boardGeometry = new THREE.PlaneGeometry(w, h, 10, 10);
  	var board = new THREE.Mesh(boardGeometry, boardMaterial);

    return board
  }

  createStock(w, h, d) {

    let scale = 0.8;

    var stockGeometry = new THREE.BoxGeometry(w * scale, d * scale, h * scale);
    var stockMaterial = new THREE.MeshBasicMaterial( { color : '#cfcfcf', side: THREE.DoubleSide } );

    var stock = new THREE.Mesh(stockGeometry, stockMaterial)
    stock.position.set(0, -(1-scale) * 0.5 * d , 0)

    return stock;
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



  raycast(raycaster, intersects) {

  }

}
