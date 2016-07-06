import THREE from './threejs'
import hilbert3D from './threejs/hilbert3D'
// import THREEx from './threejs/threeX'

THREE.Loader.Handlers.add( /\.tga$/i, new THREE.TGALoader() );

let objLoader = new THREE.OBJLoader();
let mtlLoader = new THREE.MTLLoader();
objLoader.setPath('obj/Fork_lift/')
mtlLoader.setPath('obj/Fork_lift/')

var extObj


mtlLoader.load('ForkLift.mtl', function(materials){
  materials.preload();
  objLoader.setMaterials(materials)
  materials.side = THREE.frontSide

  objLoader.load('ForkLift.obj', function(obj){
    extObj = obj
  })
})



export default class ForkLift extends THREE.Object3D {

  constructor(model, canvasSize) {

    super();

    this._model = model;

    this.createObject(model, canvasSize);

  }

  static get extObject() {
    return extObj
  }

  createObject(model, canvasSize) {

    if(!ForkLift.extObject){
      setTimeout(this.createObject.bind(this, model, canvasSize), 50)
      return;
    }

    let cx = (model.left + (model.width/2)) - canvasSize.width/2
    let cy = (model.top + (model.height/2)) - canvasSize.height/2
    let cz = 0.5 * model.depth

    let left = model.left - canvasSize.width/2
    let top = model.top - canvasSize.height/2

    let rotation = model.rotation

    this.type = 'forklift'

    this.add(ForkLift.extObject.clone())
    this.scale.set(10, 10, 10)
    // this.scale.set(model.width, model.depth, model.height)
    this.position.set(cx, 0, cy)
    this.rotation.y = model.rotation || 0



    // this.loadExtMtl('obj/Fork_lift/', 'ForkLift.mtl', '', function(materials){
    //   materials.preload();
    //
    //   this.loadExtObj('obj/Fork_lift/', 'ForkLift.obj', materials, function(object){
    //     object.traverse(function(child){
    //       if(child instanceof THREE.Mesh) {
    //         // child.matrix.scale(model.width, model.depth, model.height)
    //       }
    //     })
    //
    //     // console.log(object.matrixWorld, object.matrix)
    //     // this.matrixWorld.makeScale(model.width, model.depth, model.height)
    //     // object.scale.normalize()
    //     // object.scale.set(model.width, model.depth, model.height)
    //     // object.matrix.scale(model.width, model.depth, model.height)
    //     // console.log(object)
    //     this.scale.set(1, 1, 1)
    //     this.position.set(cx, 0, cy)
    //     this.add(object)
    //     this.rotation.y = model.rotation || 0
    //     // console.log(model)
    //   })
    // })



    // this.scale.set(model.width, model.depth, model.height)
    // console.log(this.matrixWorld, this.matrix)
    // this.matrixWorld.makeScale(model.width, model.depth, model.height)



  }

  loadExtMtl(path, filename, texturePath, funcSuccess) {

    var self = this;
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(path)
    if(texturePath)
      mtlLoader.setTexturePath(texturePath)

    mtlLoader.load(filename, funcSuccess.bind(self))

  }

  loadExtObj(path, filename, materials, funcSuccess) {
    var self = this;
    var loader = new THREE.OBJLoader(this._loadManager);

    loader.setPath(path)

    if(materials)
      loader.setMaterials(materials);

    loader.load(filename,
      funcSuccess.bind(self)
      , function(){
    }, function(){
      console.log("error")
    })


  }

}
