import THREE from './threejs'
import hilbert3D from './threejs/hilbert3D'
// import THREEx from './threejs/threeX'

export default class Person extends THREE.Object3D {

  constructor(model, canvasSize) {

    super();

    this._model = model;

    this.createObject(model, canvasSize);

  }

  createObject(model, canvasSize) {

    let cx = (model.left + (model.width/2)) - canvasSize.width/2
    let cy = (model.top + (model.height/2)) - canvasSize.height/2
    let cz = 0.5 * model.depth

    let left = model.left - canvasSize.width/2
    let top = model.top - canvasSize.height/2

    let rotation = model.rotation

    this.type = 'person'
    this.scale.normalize()

    this.loadExtMtl('obj/Casual_Man_02/', 'Casual_Man.mtl', '', function(materials){
      materials.preload();

      this.loadExtObj('obj/Casual_Man_02/', 'Casual_Man.obj', materials, function(object){
        object.traverse(function(child){
          if(child instanceof THREE.Mesh) {
            // child.matrix.scale(model.width, model.depth, model.height)
          }
        })

        // console.log(object.matrixWorld, object.matrix)
        // this.matrixWorld.makeScale(model.width, model.depth, model.height)
        // object.scale.normalize()
        // object.scale.set(model.width, model.depth, model.height)
        // object.matrix.scale(model.width, model.depth, model.height)
        // console.log(object)
        this.scale.set(10, 10, 10)
        this.position.set(cx, 0, cy)
        this.add(object)
        this.rotation.y = model.rotation || 0

      })
    })



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
