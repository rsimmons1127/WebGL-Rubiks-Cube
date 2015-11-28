//SIMMONS: helper file to create shapes. For each shape we pass
// back the vertices, indexes, normals, and texture coords. All
// of these can be overwritten on the fly as needed.


function plane(width, height)  {
    var shape = [];
    shape.vertices = [
        vec3(-width/2, -height/2, 0),
        vec3(-width/2, height/2, 0),
        vec3(width/2, -height/2, 0),
        vec3(width/2, height/2, 0),
    ];
    shape.indexes = [
        0,1,2,  1,2,3
    ];
    shape.normals = [
        vec3(0,0,1),
        vec3(0,0,1),
        vec3(0,0,1),
        vec3(0,0,1)   
    ];
    shape.texCoords = [
        vec2(0,0),
        vec2(0,1),
        vec2(1,0),
        vec2(1,1)
    ];
    return shape;
}

function cylinder(radius, height, sample)  {
    return cone(radius, radius, height, sample);
}

function cone(radiusTop, radiusBottom, height, sample)  {
    var coneAngle = Math.atan(height/(radiusBottom-radiusTop));
    var shape = [];
    shape.vertices = [];
    shape.indexes = [];
    shape.normals = [];
    shape.texCoords = [];
    for(i = 0; i <= 360; i += 360/sample) {
        shape.vertices.push(vec3(Math.cos(radians(i%360)) * radiusTop, height/2, Math.sin(radians(i%360)) * radiusTop));
        shape.vertices.push(vec3(Math.cos(radians(i%360)) * radiusBottom, -height/2, Math.sin(radians(i%360)) * radiusBottom));
        shape.normals.push(vec3(Math.cos(radians(90)-coneAngle)*Math.cos(radians(i%360)),Math.sin(radians(90)-coneAngle),Math.cos(radians(90)-coneAngle)*Math.sin(radians(i%360))));
        shape.normals.push(vec3(Math.cos(radians(90)-coneAngle)*Math.cos(radians(i%360)),Math.sin(radians(90)-coneAngle),Math.cos(radians(90)-coneAngle)*Math.sin(radians(i%360))));
    }
    for(i = 0; i < shape.vertices.length-2; i++) {
        shape.indexes.push(i);
        shape.indexes.push(i+1);
        shape.indexes.push(i+2);
    }
    for(i = 0; i <= 360; i += 360/sample) {
        shape.texCoords.push(vec2(i/360, 1));
        shape.texCoords.push(vec2(i/360, 0)); 
    }
    return shape;
}
function cube(size) {
    return prism(size, size, size);
}

function roundedCube(size, radius, sample) {
    var shape = [];
    shape.vertices = [
        vec3(-size/2 + radius, -size/2 + radius, size/2),  vec3(-size/2 + radius, size/2 - radius, size/2),   vec3(size/2 - radius, -size/2 + radius, size/2),   vec3(size/2 - radius, size/2 - radius, size/2),
        vec3(size/2, -size/2 + radius, size/2 - radius),   vec3(size/2, size/2 - radius, size/2 - radius),    vec3(size/2, -size/2 + radius, -size/2 + radius),  vec3(size/2, size/2 - radius, -size/2 + radius),
        vec3(size/2 - radius, -size/2 + radius, -size/2),  vec3(size/2 - radius, size/2 - radius, -size/2),   vec3(-size/2 + radius, -size/2 + radius, -size/2), vec3(-size/2 + radius, size/2 - radius, -size/2),
        vec3(-size/2, -size/2 + radius, -size/2 + radius), vec3(-size/2, size/2 - radius, -size/2 + radius),  vec3(-size/2, -size/2 + radius, size/2 - radius),  vec3(-size/2, size/2 - radius, size/2 - radius),
        vec3(-size/2 + radius, size/2, size/2 - radius),   vec3(-size/2 + radius, size/2, -size/2 + radius),  vec3(size/2 - radius, size/2, size/2 - radius),    vec3(size/2 - radius, size/2, -size/2 + radius),
        vec3(-size/2 + radius, -size/2, size/2 - radius),  vec3(-size/2 + radius, -size/2, -size/2 + radius), vec3(size/2 - radius, -size/2, size/2 - radius),   vec3(size/2 - radius, -size/2, -size/2 + radius)
    ];
    for(i = 0; i <= 90; i += 90/sample) {
        shape.vertices.push(size/2, vec3(Math.cos(radians(i%360)) * radius, Math.sin(radians(i%360)) * radius));
        shape.vertices.push(-size/2, vec3(Math.cos(radians(i%360)) * radius, Math.sin(radians(i%360)) * radius));





        shape.normals.push(vec3(Math.cos(radians(90)-coneAngle)*Math.cos(radians(i%360)),Math.sin(radians(90)-coneAngle),Math.cos(radians(90)-coneAngle)*Math.sin(radians(i%360))));
        shape.normals.push(vec3(Math.cos(radians(90)-coneAngle)*Math.cos(radians(i%360)),Math.sin(radians(90)-coneAngle),Math.cos(radians(90)-coneAngle)*Math.sin(radians(i%360))));
    }
    for(i = 0; i < shape.vertices.length-2; i++) {
        shape.indexes.push(i);
        shape.indexes.push(i+1);
        shape.indexes.push(i+2);
    }
    for(i = 0; i <= 360; i += 360/sample) {
        shape.texCoords.push(vec2(i/360, 1));
        shape.texCoords.push(vec2(i/360, 0)); 
    }

    shape.indexes = [
        0,1,2,      1,2,3,
        4,5,6,      5,6,7,
        8,9,10,     9,10,11,
        12,13,14,   13,14,15,
        16,17,18,   17,18,19,
        20,21,22,   21,22,23
    ];
    shape.normals = [
        vec3(0,0,1), vec3(0,0,1), vec3(0,0,1), vec3(0,0,1),
        vec3(1,0,0), vec3(1,0,0), vec3(1,0,0), vec3(1,0,0),
        vec3(0,0,-1), vec3(0,0,-1), vec3(0,0,-1), vec3(0,0,-1),
        vec3(-1,0,0), vec3(-1,0,0), vec3(-1,0,0), vec3(-1,0,0),
        vec3(0,1,0), vec3(0,1,0), vec3(0,1,0), vec3(0,1,0),
        vec3(0,-1,0), vec3(0,-1,0), vec3(0,-1,0), vec3(0,-1,0)
    ];
    shape.texCoords = [
        vec2(0,0), vec2(0,1), vec2(1,0), vec2(1,1),
        vec2(0,0), vec2(0,1), vec2(1,0), vec2(1,1),
        vec2(0,0), vec2(0,1), vec2(1,0), vec2(1,1),
        vec2(0,0), vec2(0,1), vec2(1,0), vec2(1,1),
        vec2(0,0), vec2(0,1), vec2(1,0), vec2(1,1),
        vec2(0,0), vec2(0,1), vec2(1,0), vec2(1,1),
    ]
    return shape;
}

function prism(w, h, l) {
    var shape = [];
    shape.vertices = [
        vec3(-w/2, -h/2, l/2),  vec3(-w/2, h/2, l/2),   vec3(w/2, -h/2, l/2),   vec3(w/2, h/2, l/2),
        vec3(w/2, -h/2, l/2),   vec3(w/2, h/2, l/2),    vec3(w/2, -h/2, -l/2),  vec3(w/2, h/2, -l/2),
        vec3(w/2, -h/2, -l/2),  vec3(w/2, h/2, -l/2),   vec3(-w/2, -h/2, -l/2), vec3(-w/2, h/2, -l/2),
        vec3(-w/2, -h/2, -l/2), vec3(-w/2, h/2, -l/2),  vec3(-w/2, -h/2, l/2),  vec3(-w/2, h/2, l/2),
        vec3(-w/2, h/2, l/2),   vec3(-w/2, h/2, -l/2),  vec3(w/2, h/2, l/2),    vec3(w/2, h/2, -l/2),
        vec3(-w/2, -h/2, l/2),  vec3(-w/2, -h/2, -l/2), vec3(w/2, -h/2, l/2),   vec3(w/2, -h/2, -l/2)
    ];
    shape.indexes = [
        0,1,2,      1,2,3,
        4,5,6,      5,6,7,
        8,9,10,     9,10,11,
        12,13,14,   13,14,15,
        16,17,18,   17,18,19,
        20,21,22,   21,22,23
    ];
    shape.normals = [
        vec3(0,0,1), vec3(0,0,1), vec3(0,0,1), vec3(0,0,1),
        vec3(1,0,0), vec3(1,0,0), vec3(1,0,0), vec3(1,0,0),
        vec3(0,0,-1), vec3(0,0,-1), vec3(0,0,-1), vec3(0,0,-1),
        vec3(-1,0,0), vec3(-1,0,0), vec3(-1,0,0), vec3(-1,0,0),
        vec3(0,1,0), vec3(0,1,0), vec3(0,1,0), vec3(0,1,0),
        vec3(0,-1,0), vec3(0,-1,0), vec3(0,-1,0), vec3(0,-1,0)
    ];
    shape.texCoords = [
        vec2(0,0), vec2(0,1), vec2(1,0), vec2(1,1),
        vec2(0,0), vec2(0,1), vec2(1,0), vec2(1,1),
        vec2(0,0), vec2(0,1), vec2(1,0), vec2(1,1),
        vec2(0,0), vec2(0,1), vec2(1,0), vec2(1,1),
        vec2(0,0), vec2(0,1), vec2(1,0), vec2(1,1),
        vec2(0,0), vec2(0,1), vec2(1,0), vec2(1,1),
    ]
    return shape;
}

//SIMMONS: I tried very hard to get this on my own and got close, but couldn't. The below code
// is from http://learningwebgl.com/blog/?p=1253 and changed slightly
function sphere(radius, sample)  {
    var latitudeBands = sample;
    var longitudeBands = sample;

    var shape = [];
    shape.vertices = [];
    shape.indexes = [];
    shape.normals = [];
    shape.texCoords = [];
    
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / longitudeBands);
        var v = 1 - (latNumber / latitudeBands);

        shape.normals.push(vec3(x,y,z));

        shape.texCoords.push(vec2(u,v));

        shape.vertices.push(radius * x);
        shape.vertices.push(radius * y);
        shape.vertices.push(radius * z);
      }
    }

    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        shape.indexes.push(first);
        shape.indexes.push(second);
        shape.indexes.push(first + 1);

        shape.indexes.push(second);
        shape.indexes.push(second + 1);
        shape.indexes.push(first + 1);
      }
    }

    return shape;
}