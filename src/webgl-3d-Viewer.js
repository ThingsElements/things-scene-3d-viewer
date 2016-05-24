export default class WebGL3dViwer {

  constructor(canvas) {

    this._canvas = canvas

    // Grab a context
    this._gl = this.createContext(canvas)

    this._webglProgram = this.setupProgram();

    this._model = [
      new ThingsScene3dViewer.Cube(this, {
        cx : 3, cy : 3, cz: 3, width : 0.5, height : 0.5, depth : 0.5
      }),
      new ThingsScene3dViewer.Cube(this, {
        cx : 0, cy : 0, cz: 0, width : 1, height : 1, depth : 1
      }),
      new ThingsScene3dViewer.Cube(this, {
        cx : -5, cy : 0, cz: -3, width : 0.7, height : 0.4, depth : 1
      })
    ]

    // this._transforms = {}; // All of the matrix transforms
    // this._locations = {}; //All of the shader locations

    // Get the rest going
    // this._buffers = this.createBuffersForCube(this._gl, this.createCubeData() );

    this._rotateX = 0
    this._rotateY = 0
    this._rotateZ = 0

    this._deltaX = 0
    this._deltaY = 0
    this._zoom = 0
    
    // this.draw({
    //   cx: 0, cy: 0, cz: 0, width: 1, height: 1, depth: 1
    // });
    //
    // this.draw({
    //   cx: 5, cy: 5, cz: 5, width: 0.5, height: 0.5, depth: 0.5
    // });

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
    this.computeModelMatrix( option );
    this.computeViewMatrix();
    this.computePerspectiveMatrix( 0.5 );

    // Update the data going to the GPU
    this.updateAttributesAndUniforms();

    // Perform the actual draw
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    // Run the draw as a loop
    requestAnimationFrame( this.draw.bind(this, option) );

  }


  setupProgram(model) {

    var self = model || this;
    var gl = this._gl;

    // Setup a WebGL program
    var webglProgram = this.createWebGLProgramFromIds(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(webglProgram);

    // // Save the attribute and uniform locations
    // self._locations.model = gl.getUniformLocation(webglProgram, "model");
    // self._locations.view = gl.getUniformLocation(webglProgram, "view");
    // self._locations.projection = gl.getUniformLocation(webglProgram, "projection");
    //
    // self._locations.position = gl.getAttribLocation(webglProgram, "position");
    // self._locations.color = gl.getAttribLocation(webglProgram, "color");

    // Tell WebGL to test the depth when drawing
    gl.enable(gl.DEPTH_TEST);

    return webglProgram;

  }

  computePerspectiveMatrix() {

    // var fieldOfViewInRadians = (Math.PI / 180 * 45);
    // var fieldOfViewInRadians = Math.PI * 0.5;
    var fieldOfViewInRadians = 1;
    // var aspectRatio = this._canvas.width / this._canvas.height
    var aspectRatio = window.innerWidth / window.innerHeight
    var nearClippingPlaneDistance = 1;
    var farClippingPlaneDistance = 50;

    this._transforms.projection = this.perspectiveMatrix(
      fieldOfViewInRadians,
      aspectRatio,
      nearClippingPlaneDistance,
      farClippingPlaneDistance
    );
  }


  computeViewMatrix() {

    var zoomInAndOut = 0.01 * this._zoom;

    var moveLeftAndRight = 0.001 * this._deltaX;

    var moveTopAndBottom = 0.001 * this._deltaY

    var rotateX = this.rotateXMatrix( this.rotateX );

    // Rotate according to time
    var rotateY = this.rotateYMatrix( this.rotateY );

    var rotateZ = this.rotateZMatrix( this.rotateZ );

    // Move the camera around
    var position = this.translateMatrix(moveLeftAndRight, moveTopAndBottom, -20 + zoomInAndOut );


    // Multiply together, make sure and read them in opposite order
    this._transforms.view = this.multiplyArrayOfMatrices([
      // //Exercise: rotate the camera view
      // position
      position,
      rotateZ,
      rotateY,  // step 3
      rotateX
    ]);

    // Inverse the operation for camera movements, because we are actually
    // moving the geometry in the scene, not the camera itself.
    // this._transforms.view = MDN.invertMatrix( matrix );

  }

  computeModelMatrix(option) {

    //Scale up
    var scale = this.scaleMatrix(option.width, option.height, option.depth);

    // Rotate a slight tilt
    var rotateX = this.rotateXMatrix( this.rotateX );

    // Rotate according to time
    var rotateY = this.rotateYMatrix( this.rotateY );

    var rotateZ = this.rotateZMatrix( this.rotateZ );

    // Move slightly down
    var position = this.translateMatrix(option.cx, option.cy, option.cz);

    // Multiply together, make sure and read them in opposite order
    this._transforms.model = this.multiplyArrayOfMatrices([
      position, // step 4
      // rotateZ,
      // rotateY,  // step 3
      // rotateX,  // step 2
      scale     // step 1
    ]);


    // Performance caveat: in real production code it's best not to create
    // new arrays and objects in a loop. This example chooses code clarity
    // over performance.

  }


  updateAttributesAndUniforms() {

    var gl = this._gl;

    // Setup the color uniform that will be shared across all triangles
    gl.uniformMatrix4fv(this._locations.model, false, new Float32Array(this._transforms.model));
    gl.uniformMatrix4fv(this._locations.projection, false, new Float32Array(this._transforms.projection));
    gl.uniformMatrix4fv(this._locations.view, false, new Float32Array(this._transforms.view));

    // Set the positions attribute
    gl.enableVertexAttribArray(this._locations.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.positions);
    gl.vertexAttribPointer(this._locations.position, 3, gl.FLOAT, false, 0, 0);

    // Set the colors attribute
    gl.enableVertexAttribArray(this._locations.color);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.colors);
    gl.vertexAttribPointer(this._locations.color, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.elements );

  }


  /* MDN Library */


  // Define the data that is needed to make a 3d cube
  createCubeData() {

    var positions = [
      // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0
    ];

    var colorsOfFaces = [
      [0.3,  1.0,  1.0,  1.0],    // Front face: cyan
      [1.0,  0.3,  0.3,  1.0],    // Back face: red
      [0.3,  1.0,  0.3,  1.0],    // Top face: green
      [0.3,  0.3,  1.0,  1.0],    // Bottom face: blue
      [1.0,  1.0,  0.3,  1.0],    // Right face: yellow
      [1.0,  0.3,  1.0,  1.0]     // Left face: purple
    ];

    var colors = [];

    for (var j=0; j<6; j++) {
      var polygonColor = colorsOfFaces[j];

      for (var i=0; i<4; i++) {
        colors = colors.concat( polygonColor );
      }
    }

    var elements = [
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23    // left
    ]

    return {
      positions: positions,
      elements: elements,
      colors: colors
    }
  }

  // Take the data for a cube and bind the buffers for it.
  // Return an object collection of the buffers
  createBuffersForCube( gl, cube ) {

    var positions = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positions);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.positions), gl.STATIC_DRAW);

    var colors = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.colors), gl.STATIC_DRAW);

    var elements = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube.elements), gl.STATIC_DRAW);

    return {
      positions: positions,
      colors: colors,
      elements: elements
    }
  }

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

    return gl;
  }

}
