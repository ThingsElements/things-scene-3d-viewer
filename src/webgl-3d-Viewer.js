import THREE from './threejs'
import THREEx from './threejs/threeX'
import Rack from './rack'

export default class WebGL3dViwer {


  constructor(targetDomId, model) {

    // PROPERTY
    this._mouse = { x: 0, y: 0 }
    this.INTERSECTED

    this.FLOOR_WIDTH = model.width
    this.FLOOR_HEIGHT = model.height

    // SCENE
    this._scene = new THREE.Scene();

    // CAMERA
    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;
    this.VIEW_ANGLE = 45;
    this.ASPECT = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
    this.NEAR = 0.1;
    this.FAR = 20000;

    this._camera = new THREE.PerspectiveCamera( this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
    this._scene.add(this._camera);
    this._camera.position.set(0,150,400);
    this._camera.lookAt(this._scene.position);

  	// RENDERER
		this._renderer = new THREE.WebGLRenderer( {antialias:true} );
  	this._renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);

  	this._container = document.getElementById( targetDomId );
  	this._container.appendChild( this._renderer.domElement );
  	// EVENTS
  	THREEx.WindowResize(this._renderer, this._camera);
  	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

    // KEYBOARD
    this._keyboard = new THREEx.KeyboardState();

  	// CONTROLS
  	this._controls = new THREE.OrbitControls( this._camera, this._renderer.domElement );

  	// LIGHT
  	var light = new THREE.PointLight(0xffffff);
  	light.position.set(0,250,0);
  	this._scene.add(light);

    this.createFloor()

  	////////////
  	// CUSTOM //
  	////////////
    this.createObjects(model.components)

  	// initialize object to perform world/screen calculations
  	this._projector = new THREE.Projector();

    this.init()

    this.bindEvents()

    this.animate()
  }

  createFloor() {

    // FLOOR
    var floorTexture = new THREE.TextureLoader().load('Light-gray-rough-concrete-wall-Seamless-background-photo-texture.jpg');

  	// var floorTexture = new THREE.ImageUtils.loadTexture( 'checkerboard.jpg' );
  	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  	floorTexture.repeat.set( 10, 10 );
  	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
  	var floorGeometry = new THREE.PlaneGeometry(this.FLOOR_WIDTH, this.FLOOR_HEIGHT, 10, 10);
  	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  	floor.position.y = -0.5;
  	floor.rotation.x = Math.PI / 2;
  	this._scene.add(floor);

  }

  createSkyBox() {

    // SKYBOX/FOG
  	var skyBoxGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
  	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
  	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  	this._scene.add(skyBox);

  }

  createObjects(models) {

    models.forEach(model => {
      if(model.type === 'rack')
        new Rack(this, model)
    })

  }

  init() {

  }

  animate() {

    requestAnimationFrame( this.animate.bind(this) );
  	this.render();
  	this.update();

  }

  update() {

    	// find intersections

    	// create a Ray with origin at the mouse position
    	//   and direction into the scene (camera direction)
    	var vector = new THREE.Vector3( this._mouse.x, this._mouse.y, 1 );
    	vector.unproject( this._camera );
    	var ray = new THREE.Raycaster( this._camera.position, vector.sub( this._camera.position ).normalize() );

    	// create an array containing all objects in the scene with which the ray intersects
    	var intersects = ray.intersectObjects( this._scene.children );

    	// INTERSECTED = the object in the scene currently closest to the camera
    	//		and intersected by the Ray projected from the mouse position

    	// if there is one (or more) intersections
    	if ( intersects.length > 0 )
    	{
    		// if the closest object intersected is not the currently stored intersection object
    		if ( intersects[ 0 ].object != this.INTERSECTED )
    		{
    		    // restore previous intersection object (if it exists) to its original color
    			if ( this.INTERSECTED )
    				this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
    			// store reference to closest object as current intersection object
    			this.INTERSECTED = intersects[ 0 ].object;
    			// store color of closest object (for later restoration)
    			this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
    			// set a new color for closest object
    			// this.INTERSECTED.material.color.setHex( 0xffff00 );
          var tooltip = document.getElementById("tooltip");

          if( this.INTERSECTED._type === 'rack' ) {
            tooltip.textContent = '이것의 location은 ' + this.INTERSECTED._location + " 입니다."

            var mouseX = (this._mouse.x + 1) / 2 * window.innerWidth
            var mouseY = (-this._mouse.y + 1 ) / 2 * window.innerHeight

            tooltip.style.left = mouseX+'px';
            tooltip.style.top = mouseY+'px';
            tooltip.style.display = 'block'
          } else {
            tooltip.style.display = 'none'
          }


    		}
    	}
    	else // there are no intersections
    	{
    		// restore previous intersection object (if it exists) to its original color
    		if ( this.INTERSECTED )
    			this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
    		// remove previous intersection object reference
    		//     by setting current intersection object to "nothing"
    		this.INTERSECTED = null;
    	}


    	if ( this._keyboard.pressed("z") )
    	{
    		// do something
    	}

    	this._controls.update();

  }

  render()
  {
  	this._renderer.render( this._scene, this._camera );
  }

  bindEvents() {
    var self = this;
    // when the mouse moves, call the given function
  	document.addEventListener( 'mousemove', self.onMouseMove.bind(self), false );
  }

  onMouseMove(e) {
    // the following line would stop any other event handler from firing
  	// (such as the mouse's TrackballControls)
  	// event.preventDefault();

  	// update the mouse variable
  	this._mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    this._mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
  }

}
