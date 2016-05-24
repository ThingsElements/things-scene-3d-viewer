export default class Cube {

  constructor(viewer, model) {
    this._viewer = viewer

    this._model = {
      cx : 0,
      cy : 0,
      cz : 0
    }

    Object.assign(this._model, model)

    this._transforms = {}; // All of the matrix transforms
    this._locations = {}; //All of the shader locations
    // this._buffers = []

    // Get the rest going
    // this._buffers.push(this.createBuffersForCube(viewer._gl, this.createCubeData() ))
    this._buffers = this.createBuffersForCube(viewer._gl, this.createModelData() );
    // this._buffers = Object.assign(this._buffers, this.createBuffersForCube(viewer._gl, this.createCubeOutlineData()))
    this.setAttributesAndUniforms()
    // this._webglProgram = viewer.setupProgram(this);

    this._rotateX = 0
    this._rotateY = 0
    this._rotateZ = 0

    this.draw()

  }

  draw() {
    var gl = this._viewer._gl;

    // Compute our matrices
    this.computeModelMatrix( );
    this.computeViewMatrix();
    this.computePerspectiveMatrix( 0.5 );

    // Update the data going to the GPU
    this.updateAttributesAndUniforms();

    // Perform the actual draw
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    // gl.drawArrays(gl.LINE_STRIP, 0, 24)

    // Run the draw as a loop
    requestAnimationFrame( this.draw.bind(this) );
  }

  setAttributesAndUniforms() {

    var webglProgram = this._viewer._webglProgram
    var gl = this._viewer._gl

    // Save the attribute and uniform locations
    this._locations.model = gl.getUniformLocation(webglProgram, "model");
    this._locations.view = gl.getUniformLocation(webglProgram, "view");
    this._locations.projection = gl.getUniformLocation(webglProgram, "projection");

    this._locations.position = gl.getAttribLocation(webglProgram, "position");
    this._locations.color = gl.getAttribLocation(webglProgram, "color");
    this._locations.outlineColor = gl.getAttribLocation(webglProgram, "outlineColor");
  }

  computeModelMatrix() {

    //Scale up
    var scale = this._viewer.scaleMatrix(this._model.width, this._model.height, this._model.depth);

    // Rotate a slight tilt
    var rotateX = this._viewer.rotateXMatrix( this._rotateX );

    // Rotate according to time
    var rotateY = this._viewer.rotateYMatrix( this._rotateY );

    var rotateZ = this._viewer.rotateZMatrix( this._rotateZ );

    // Move slightly down
    var position = this._viewer.translateMatrix(this._model.cx, this._model.cy, this._model.cz);

    // Multiply together, make sure and read them in opposite order
    this._transforms.model = this._viewer.multiplyArrayOfMatrices([
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

  computeViewMatrix() {

    var zoomInAndOut = 0.01 * this._viewer._zoom;

    var moveLeftAndRight = 0.001 * this._viewer._deltaX;

    var moveTopAndBottom = 0.001 * this._viewer._deltaY

    var rotateX = this._viewer.rotateXMatrix( this._viewer.rotateX );

    // Rotate according to time
    var rotateY = this._viewer.rotateYMatrix( this._viewer.rotateY );

    var rotateZ = this._viewer.rotateZMatrix( this._viewer.rotateZ );

    // Move the camera around
    var position = this._viewer.translateMatrix(moveLeftAndRight, moveTopAndBottom, 20 + zoomInAndOut );
    // var position = this._viewer.translateMatrix(moveLeftAndRight, moveTopAndBottom, zoomInAndOut );


    // Multiply together, make sure and read them in opposite order
    var matrix = this._viewer.multiplyArrayOfMatrices([
      // //Exercise: rotate the camera view
      // position
      position,
      rotateZ,
      rotateY,  // step 3
      rotateX
    ]);

    // Inverse the operation for camera movements, because we are actually
    // moving the geometry in the scene, not the camera itself.
    this._transforms.view = this._viewer.invertMatrix( matrix );

  }

  computePerspectiveMatrix() {

    var fieldOfViewInRadians = (Math.PI / 180 * 120);
    // var fieldOfViewInRadians = Math.PI * 0.5;
    // var fieldOfViewInRadians = 120;

    // var fieldOfViewInRadians = 1;
    // var aspectRatio = this._viewer._canvas.width / this._viewer._canvas.height
    var aspectRatio = window.innerWidth / window.innerHeight
    var nearClippingPlaneDistance = 1;
    var farClippingPlaneDistance = 500;

    this._transforms.projection = this._viewer.perspectiveMatrix(
      fieldOfViewInRadians,
      aspectRatio,
      nearClippingPlaneDistance,
      farClippingPlaneDistance
    );
  }

  updateAttributesAndUniforms() {

    var gl = this._viewer._gl;

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
    gl.vertexAttribPointer(this._locations.color, 4, gl.FLOAT, gl.TRUE, 0, 0);

    // Set the outline colors attribute
    gl.enableVertexAttribArray(this._locations.outlineColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.outlineColors);
    gl.vertexAttribPointer(this._locations.outlineColor, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.elements );

  }

  createModelData() {

      var positions = this.createPositions();
      var colors = this.createColors();
      var elements = this.createElements();

      var outlineColors = [];

      for (var i=0; i<24; i++) {
        outlineColors = outlineColors.concat([0.0, 0.0, 0.0, 1.0])
      }

      return {
        positions: positions,
        elements: elements,
        colors: colors,
        outlineColors : outlineColors
      }

  }

  createPositions() {
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

    return positions;
  }

  createColors() {

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

    return colors;

  }

  createElements() {
    var elements = [
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23    // left
    ]

    return elements;
  }

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

    var outlineColors = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, outlineColors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.outlineColors), gl.STATIC_DRAW);

    return {
      positions: positions,
      colors: colors,
      elements: elements,
      outlineColors : outlineColors
    }
  }

  createCubeOutlineData() {

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
        [0.0,  0.0,  0.0,  1.0],    // Front face: black
        [0.0,  0.0,  0.0,  1.0],    // Back face: black
        [0.0,  0.0,  0.0,  1.0],    // Top face: black
        [0.0,  0.0,  0.0,  1.0],    // Bottom face: black
        [0.0,  0.0,  0.0,  1.0],    // Right face: black
        [0.0,  0.0,  0.0,  1.0]     // Left face: black
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

}
