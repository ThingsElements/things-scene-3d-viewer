import Cube from './cube'

export default class Floor extends Cube {

  createColors() {

    var colorsOfFaces = [
      [0.3,  1.0,  1.0,  0.0],    // Front face: cyan
      [1.0,  0.3,  0.3,  1.0],    // Back face: red
      [0.3,  1.0,  0.3,  0.0],    // Top face: green
      [0.3,  0.3,  1.0,  0.0],    // Bottom face: blue
      [1.0,  1.0,  0.3,  0.0],    // Right face: yellow
      [1.0,  0.3,  1.0,  0.0]     // Left face: purple
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

}
