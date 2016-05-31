import THREE from './threejs'
import hilbert3D from './threejs/hilbert3D'
// import Stock from './stock'
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

    let rotation = model.rotation

    this.type = model.type

    var frame = this.createRackFrame(model.width, model.height, model.depth)

    this.add(frame)

    var board = this.createRackBoard(model.width, model.height)
    board.position.set(0, -model.depth/2, 0)
    board.rotation.x = Math.PI / 2;
    board.material.opacity = 0.5
    board.material.transparent = true

    this.add(board)

    var board = this.createRackBoard(model.width, model.height)
    board.position.set(0, model.depth/2, 0)
    board.rotation.x = Math.PI / 2;
    board.material.opacity = 0.5
    board.material.transparent = true

    this.add(board)

    // var stock = new Stock(model)
    var stock = this.createStock(model.width, model.height, model.depth)
    stock.visible = false
    // var raycast = stock.raycast
    //
    // stock.raycast = function(raycaster, intersects){
    //
    //   if(this.material.transparent && this.material.opacity === 0) {
    //     return
    //   } else {
    //     raycast()
    //   }
    //
    // }
    this.add(stock)

    this.position.set(cx, cz, cy)
    this.rotation.y = rotation || 0
    console.log(rotation)
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

    return new THREE.LineSegments(
      this.geometry,
      new THREE.LineDashedMaterial( { color: 0xcccccc, dashSize: 3, gapSize: 1, linewidth: 1 } )
    );

  }

  createRackBoard(w, h) {

    // var boardTexture = new THREE.TextureLoader().load('textures/textured-white-plastic-close-up.jpg');
    // boardTexture.wrapS = boardTexture.wrapT = THREE.RepeatWrapping;
    // boardTexture.repeat.set( 100, 100 );

    // var boardMaterial = new THREE.MeshBasicMaterial( { map: boardTexture, side: THREE.DoubleSide } );
    var boardMaterial = new THREE.MeshBasicMaterial( { color: '#dedede', side: THREE.DoubleSide } );
    var boardGeometry = new THREE.PlaneGeometry(w, h, 10, 10);
    var board = new THREE.Mesh(boardGeometry, boardMaterial);

    return board
  }

  createStock(w, h, d) {

    let scale = 0.7;

    var stockGeometry = new THREE.BoxGeometry(w * scale, d * scale, h * scale);
    // var stockMaterial = new THREE.MeshBasicMaterial( { color : '#ff9900', side: THREE.DoubleSide } );
    var stockMaterial = new THREE.MeshLambertMaterial( { color : '#ff9900', side: THREE.DoubleSide } );

    var stock = new THREE.Mesh(stockGeometry, stockMaterial)
    stock.type = 'stock'
    stock.position.set(0, -(1-scale) * 0.5 * d , 0)
    stock.material.transparent = true;
    stock.material.opacity = 0.9

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
