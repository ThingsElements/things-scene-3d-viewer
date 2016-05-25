import '../node_modules/gl-matrix/dist/gl-matrix-min'

export default class WebGL3dViwer {

  constructor(canvas) {

    this._canvas = canvas

    // Grab a context
    this._gl = this.createContext(canvas)
    this.setViewport(0, 0, canvas.width, canvas.height)

    this._transforms = {}; // All of the matrix transforms
    this._locations = {}; //All of the shader locations

    this._mouse = {}

    this._webglProgram = this.setupProgram();


    // Get the rest going
    // this._buffers = this.createBuffersForCube(this._gl, this.createCubeData() );

    this._rotateSeq = [{
      rotateX :  45, rotateY :  45, rotateZ :   45
    },
    {
      rotateX :   0, rotateY :  45, rotateZ :   90
    },
    {
      rotateX : -45, rotateY :  45, rotateZ :  135
    },
    {
      rotateX : -45, rotateY :   0, rotateZ :  180
    },
    {
      rotateX : -45, rotateY : -45, rotateZ :  225
    },
    {
      rotateX :   0, rotateY : -45, rotateZ :  270
    },
    {
      rotateX :  45, rotateY : -45, rotateZ :  315
    },
    {
      rotateX :  45, rotateY :   0, rotateZ :    0
    }]

    this._curRotateSeq = 0;

    this.rotateX = 45 * (Math.PI / 180)
    this.rotateY = 45 * (Math.PI / 180)
    this.rotateZ = 45 * (Math.PI / 180)

    this._deltaX = 0
    this._deltaY = 0
    this._zoom = -400

    this.draw();

    this._model = [
      new ThingsScene3dViewer.Floor(this, {
        width : 1, height : 1, depth : 0.001
      })
      ,
      new ThingsScene3dViewer.Rack(this, {
        cx : -0.95, cy : 0.95, cz: 0.05, width : 0.05, height : 0.05, depth : 0.05
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : -0.95, cy : 0.75, cz: 0.05, width : 0.05, height : 0.05, depth : 0.05
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : -0.95, cy : 0.55, cz: 0.05, width : 0.05, height : 0.05, depth : 0.05
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : -0.95, cy : 0.35, cz: 0.05, width : 0.05, height : 0.05, depth : 0.05
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : -0.95, cy : 0.15, cz: 0.05, width : 0.05, height : 0.05, depth : 0.05
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : -0.95, cy : -0.05, cz: 0.05, width : 0.05, height : 0.05, depth : 0.05
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : -0.95, cy : -0.25, cz: 0.05, width : 0.05, height : 0.05, depth : 0.05
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : -0.95, cy : -0.45, cz: 0.05, width : 0.05, height : 0.05, depth : 0.05
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : -0.95, cy : -0.65, cz: 0.05, width : 0.05, height : 0.05, depth : 0.05
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : -0.95, cy : -0.85, cz: 0.05, width : 0.05, height : 0.05, depth : 0.05
      }),

      new ThingsScene3dViewer.Rack(this, {
        cx : 0.95, cy : 0.95, cz: 0.15, width : 0.05, height : 0.05, depth : 0.15
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : 0.95, cy : 0.75, cz: 0.15, width : 0.05, height : 0.05, depth : 0.15
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : 0.95, cy : 0.55, cz: 0.15, width : 0.05, height : 0.05, depth : 0.15
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : 0.95, cy : 0.35, cz: 0.15, width : 0.05, height : 0.05, depth : 0.15
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : 0.95, cy : 0.15, cz: 0.15, width : 0.05, height : 0.05, depth : 0.15
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : 0.95, cy : -0.05, cz: 0.15, width : 0.05, height : 0.05, depth : 0.15
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : 0.95, cy : -0.25, cz: 0.15, width : 0.05, height : 0.05, depth : 0.15
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : 0.95, cy : -0.45, cz: 0.15, width : 0.05, height : 0.05, depth : 0.15
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : 0.95, cy : -0.65, cz: 0.15, width : 0.05, height : 0.05, depth : 0.15
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : 0.95, cy : -0.85, cz: 0.15, width : 0.05, height : 0.05, depth : 0.15
      }),


      new ThingsScene3dViewer.Rack(this, {
        cx : 0, cy : 0, cz: 0.1, width : 0.1, height : 0.1, depth : 0.1
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : 0.5, cy : 0.93, cz: 0.1, width : 0.07, height : 0.04, depth : 0.1
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : 0.5, cy : -0.93, cz: 0.1, width : 0.07, height : 0.04, depth : 0.1
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : -0.5, cy : 0.93, cz: 0.1, width : 0.07, height : 0.04, depth : 0.1
      }),
      new ThingsScene3dViewer.Rack(this, {
        cx : -0.5, cy : -0.93, cz: 0.1, width : 0.07, height : 0.04, depth : 0.1
      })
    ]


    this.bindEvent()

  }

  /* getter / setter */

  get rotateX() {
    return this._rotateX
  }

  set rotateX(angle) {

    this._rotateX = angle
  }

  get rotateY() {
    return this._rotateY
  }

  set rotateY(angle) {
    this._rotateY = angle
  }

  get rotateZ() {
    return this._rotateZ
  }

  set rotateZ(angle) {
    this._rotateZ = angle
  }

  get deltaX() {
    return this._deltaX
  }

  set deltaX(deltaX) {
    this._deltaX = deltaX
  }

  get deltaY() {
    return this._deltaY
  }

  set deltaY(deltaY) {
    this._deltaY = deltaY
  }

  get zoom() {
    return this._zoom
  }

  set zoom(zoom) {
    this._zoom = zoom
  }


  /* method */

  draw(option) {

    var gl = this._gl;

    // Compute our matrices
    this.computeViewMatrix();
    this.computePerspectiveMatrix( 45 );

    // Update the data going to the GPU
    this.updateAttributesAndUniforms();

    // Run the draw as a loop
    requestAnimationFrame( this.draw.bind(this, option) );

  }

  setViewport(l, b, w, h) {

    var gl = this._gl;
    gl.viewport(l, b, w, h);

  }


  setupProgram() {

    var gl = this._gl;

    // Setup a WebGL program
    var webglProgram = this.createWebGLProgramFromIds(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(webglProgram);

    // // Save the attribute and uniform locations
    this._locations.view = gl.getUniformLocation(webglProgram, "view");
    this._locations.projection = gl.getUniformLocation(webglProgram, "projection");

    // Tell WebGL to test the depth when drawing
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.BLEND)

    return webglProgram;

  }

  computePerspectiveMatrix(fov) {

    var fieldOfViewInRadians = glMatrix.toRadian(fov || 45);
    var aspectRatio = this._canvas.width / this._canvas.height
    var nearClippingPlaneDistance = 0.01;
    var farClippingPlaneDistance = 2000;

    var pMat = this.perspectiveMatrix(
      fieldOfViewInRadians,
      aspectRatio,
      nearClippingPlaneDistance,
      farClippingPlaneDistance
    );



    // mat4.lookAt(pMat, [1,1,1], [0,0,-1], [0, 1, 0])

    // this._transforms.projection = this.perspectiveMatrix(
    //   fieldOfViewInRadians,
    //   aspectRatio,
    //   nearClippingPlaneDistance,
    //   farClippingPlaneDistance
    // );

    this._transforms.projection = pMat
  }


  computeViewMatrix() {

    var zoomInAndOut = 0.01 * this.zoom;

    var moveLeftAndRight = 0.001 * this._deltaX;

    var moveTopAndBottom = 0.001 * this._deltaY;

    var rotateX = this.rotateXMatrix( this.rotateX );

    // Rotate according to time
    var rotateY = this.rotateYMatrix( this.rotateY );

    var rotateZ = this.rotateZMatrix( this.rotateZ );

    // Move the camera around
    var position = this.translateMatrix(moveLeftAndRight, moveTopAndBottom, zoomInAndOut );
    // var position = this.translateMatrix(moveLeftAndRight, moveTopAndBottom, 0 );

    // mat4.lookAt(position, [0,0,this.zoom*0.0001], [0,0,-1], [0, 1, 0])

    // Multiply together, make sure and read them in opposite order
    var matrix = this.multiplyArrayOfMatrices([
      // //Exercise: rotate the camera view
      // position
      position,
      rotateZ,
      rotateY,  // step 3
      rotateX
    ]);


    // Inverse the operation for camera movements, because we are actually
    // moving the geometry in the scene, not the camera itself.
    // this._transforms.view = this._viewer.invertMatrix( matrix );
    this._transforms.view = matrix;

  }


  updateAttributesAndUniforms() {

    var gl = this._gl;

    // Setup the color uniform that will be shared across all triangles
    gl.uniformMatrix4fv(this._locations.projection, false, new Float32Array(this._transforms.projection));
    gl.uniformMatrix4fv(this._locations.view, false, new Float32Array(this._transforms.view));

  }


  /* Event */

  bindEvent() {
    var self = this;

    this._canvas.onmousemove = function(e){

      self._mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      self._mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    }
  }

  incRotateSeq() {
    var seq = (this._curRotateSeq + 1) % (this._rotateSeq.length );

    this.rotateX = this._rotateSeq[seq].rotateX * Math.PI / 180
    this.rotateY = this._rotateSeq[seq].rotateY * Math.PI / 180
    this.rotateZ = this._rotateSeq[seq].rotateZ * Math.PI / 180

    this._curRotateSeq = seq;
  }

  // decRotateSeq() {
  //   var seq = (this._curRotateSeq + 1) % (this._rotateSeq.length );
  //
  //   this.rotateX = this._rotateSeq[seq].rotateX * Math.PI / 180
  //   this.rotateY = this._rotateSeq[seq].rotateY * Math.PI / 180
  //   this.rotateZ = this._rotateSeq[seq].rotateZ * Math.PI / 180
  //
  //   this._curRotateSeq = seq;
  // }


  /* MDN Library */

  matrixArrayToCssMatrix(array) {
    return "matrix3d(" + array.join(',') + ")";
  }

  multiplyPoint(matrix, point) {

    var x = point[0], y = point[1], z = point[2], w = point[3];

    var c1r1 = matrix[ 0], c2r1 = matrix[ 1], c3r1 = matrix[ 2], c4r1 = matrix[ 3],
    c1r2 = matrix[ 4], c2r2 = matrix[ 5], c3r2 = matrix[ 6], c4r2 = matrix[ 7],
    c1r3 = matrix[ 8], c2r3 = matrix[ 9], c3r3 = matrix[10], c4r3 = matrix[11],
    c1r4 = matrix[12], c2r4 = matrix[13], c3r4 = matrix[14], c4r4 = matrix[15];

    return [
      x*c1r1 + y*c1r2 + z*c1r3 + w*c1r4,
      x*c2r1 + y*c2r2 + z*c2r3 + w*c2r4,
      x*c3r1 + y*c3r2 + z*c3r3 + w*c3r4,
      x*c4r1 + y*c4r2 + z*c4r3 + w*c4r4
    ];
  }

  multiplyMatrices  (a, b) {

    // TODO - Simplify for explanation
    // currently taken from https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/mat4.js#L306-L337

    var result = [];

    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
    a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
    a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
    a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    result[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    result[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    result[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    result[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    result[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    result[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    result[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    result[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    result[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    result[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    result[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    result[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    result[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    result[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    result[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    result[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    return result;
  }

  multiplyArrayOfMatrices(matrices) {

    var inputMatrix = matrices[0];

    for(var i=1; i < matrices.length; i++) {
      inputMatrix = this.multiplyMatrices(inputMatrix, matrices[i]);
    }

    return inputMatrix;
  }

  rotateXMatrix(a) {

    var cos = Math.cos;
    var sin = Math.sin;

    return [
      1,       0,        0,     0,
      0,  cos(a),  -sin(a),     0,
      0,  sin(a),   cos(a),     0,
      0,       0,        0,     1
    ];
  }

  rotateYMatrix(a) {

    var cos = Math.cos;
    var sin = Math.sin;

    return [
      cos(a),   0, sin(a),   0,
      0,   1,      0,   0,
      -sin(a),   0, cos(a),   0,
      0,   0,      0,   1
    ];
  }

  rotateZMatrix(a) {

    var cos = Math.cos;
    var sin = Math.sin;

    return [
      cos(a), -sin(a),    0,    0,
      sin(a),  cos(a),    0,    0,
      0,       0,    1,    0,
      0,       0,    0,    1
    ];
  }

  translateMatrix(x, y, z) {
    return [
      1,    0,    0,   0,
      0,    1,    0,   0,
      0,    0,    1,   0,
      x,    y,    z,   1
    ];
  }

  scaleMatrix(w, h, d) {
    return [
      w,    0,    0,   0,
      0,    h,    0,   0,
      0,    0,    d,   0,
      0,    0,    0,   1
    ];
  }

  perspectiveMatrix(fieldOfViewInRadians, aspectRatio, near, far) {

    // Construct a perspective matrix

    /*
    Field of view - the angle in radians of what's in view along the Y axis
    Aspect Ratio - the ratio of the canvas, typically canvas.width / canvas.height
    Near - Anything before this point in the Z direction gets clipped (outside of the clip space)
    Far - Anything after this point in the Z direction gets clipped (outside of the clip space)
    */

    var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
    var rangeInv = 1 / (near - far);

    return [
      f / aspectRatio, 0,                          0,   0,
      0,               f,                          0,   0,
      0,               0,    (near + far) * rangeInv,  -1,
      0,               0,  near * far * rangeInv * 2,   0
    ];
  }

  orthographicMatrix(left, right, bottom, top, near, far) {

    // Each of the parameters represents the plane of the bounding box

    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);

    var row4col1 = (left + right) * lr;
    var row4col2 = (top + bottom) * bt;
    var row4col3 = (far + near) * nf;

    return [
      -2 * lr,        0,        0, 0,
      0,  -2 * bt,        0, 0,
      0,        0,   2 * nf, 0,
      row4col1, row4col2, row4col3, 1
    ];
  }

  createShader(gl, source, type) {

    // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER

    var shader = gl.createShader( type );
    gl.shaderSource( shader, source );
    gl.compileShader( shader );

    if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {

      var info = gl.getShaderInfoLog( shader );
      throw "Could not compile WebGL program. \n\n" + info;
    }

    return shader
  }

  linkProgram(gl, vertexShader, fragmentShader) {

    var program = gl.createProgram();

    gl.attachShader( program, vertexShader );
    gl.attachShader( program, fragmentShader );

    gl.linkProgram( program );

    if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
      var info = gl.getProgramInfoLog(program);
      throw "Could not compile WebGL program. \n\n" + info;
    }

    return program;
  }

  createWebGLProgram(gl, vertexSource, fragmentSource) {

    // Combines createShader() and linkProgram()

    var vertexShader = this.createShader( gl, vertexSource, gl.VERTEX_SHADER );
    var fragmentShader = this.createShader( gl, fragmentSource, gl.FRAGMENT_SHADER );

    return this.linkProgram( gl, vertexShader, fragmentShader );
  }

  createWebGLProgramFromIds(gl, vertexSourceId, fragmentSourceId) {

    var vertexSourceEl = document.getElementById(vertexSourceId);
    var fragmentSourceEl = document.getElementById(fragmentSourceId);

    return this.createWebGLProgram(
      gl,
      vertexSourceEl.innerHTML,
      fragmentSourceEl.innerHTML
    );
  }

  createContext(canvas) {

    var gl;

    try {
      // Try to grab the standard context. If it fails, fallback to experimental.
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}

    // If we don't have a GL context, give up now
    if (!gl) {
      var message = "Unable to initialize WebGL. Your browser may not support it.";
      alert(message);
      throw new Error(message);
      gl = null;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    return gl;
  }

  invertMatrix( matrix ) {

    // Adapted from: https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js

    // Performance note: Try not to allocate memory during a loop. This is done here
    // for the ease of understanding the code samples.
    var result = [];

    var n11 = matrix[0], n12 = matrix[4], n13 = matrix[ 8], n14 = matrix[12];
    var n21 = matrix[1], n22 = matrix[5], n23 = matrix[ 9], n24 = matrix[13];
    var n31 = matrix[2], n32 = matrix[6], n33 = matrix[10], n34 = matrix[14];
    var n41 = matrix[3], n42 = matrix[7], n43 = matrix[11], n44 = matrix[15];

    result[ 0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    result[ 4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    result[ 8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    result[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    result[ 1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
    result[ 5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
    result[ 9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
    result[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
    result[ 2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
    result[ 6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
    result[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
    result[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
    result[ 3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
    result[ 7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
    result[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
    result[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

    var determinant = n11 * result[0] + n21 * result[4] + n31 * result[8] + n41 * result[12];

    if ( determinant === 0 ) {
      throw new Error("Can't invert matrix, determinant is 0");
    }

    for( var i=0; i < result.length; i++ ) {
      result[i] /= determinant;
    }

    return result;
  }

}
