//ROSS: My Global Variables
var canvas;
var gl;

//ROSS: This keeps track of all the shader code
var shaderProgram;

// All textures are loaded into this array
var cubeTexture;
var skyTexture;

// Global vars that hold all info for each shape
var world;
var cubies = []

// modelview, projection, and camera matrices
var modelView;
var projection;
var camera;

// Clock for animation
var tick = 0;

// Constants for turning direction
var CLOCKWISE = 1;
var COUNTERCLOCKWISE = -1;

// Constants for faces
var RIGHT_FACE = 1;
var FRONT_FACE = 2;
var UP_FACE = 3;
var LEFT_FACE = 4;
var BACK_FACE = 5;
var DOWN_FACE = 6;

// Constants for rotations
var X_ROTATION = 7;
var Y_ROTATION = 8;
var Z_ROTATION = 9;

// Misc Constants
var THETA_PER_TICK = 10;

var theta = 0;
var degreesCompleted = 0;
var rotationAxis = [0,0,0];
var cubiesToTurn = [];
var lock = false;
var rotationDirection = 1;

function initGL() {
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) {
        alert( "WebGL isn't available" );
    }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    
}

function init_Shaders() {
    //  Load shaders and initialize attribute buffers
    shaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( shaderProgram );

    //Get and enable vertex attributes
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute );
     
    //Get and enable texture attributes
    shaderProgram.textureAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.textureAttribute);

    //Get and enable normal attributes
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    //Get uniforms for view matrices, etc.
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "MVMatrix");
    shaderProgram.projectionMatrixUniform = gl.getUniformLocation(shaderProgram, "PMatrix");
    shaderProgram.cameraMatrixUniform = gl.getUniformLocation(shaderProgram, "CMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "NMatrix");

    // Get uniform for texture
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "sampler");

    // Get uniforms for all of our lighting stuff
    shaderProgram.lightLocationUniform = gl.getUniformLocation(shaderProgram, "lightLocation");
    shaderProgram.cameraLocationUniform = gl.getUniformLocation(shaderProgram, "cameraLocation");
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "ambientColor");
    shaderProgram.diffuseColorUniform = gl.getUniformLocation(shaderProgram, "diffuseColor");
    shaderProgram.specularColorUniform = gl.getUniformLocation(shaderProgram, "specularColor");
    shaderProgram.specularIntensityUniform = gl.getUniformLocation(shaderProgram, "specularIntensity");
}

// Loads textures asynchronously
function initTextures() {
    skyTexture = gl.createTexture();
    skyTexture.image = new Image();
    skyTexture.image.onload = function() {
        handleLoadedTexture(skyTexture);
    }
    skyTexture.image.src = "textures/sky.png";

    cubeTexture = gl.createTexture();
    cubeTexture.image = new Image();
    cubeTexture.image.onload = function() {
        handleLoadedTexture(cubeTexture);
    }
    cubeTexture.image.src = "textures/cube.png";    
}

// Once loaded, textures are pushed to our global array of textures
function handleLoadedTexture(t) {
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
    // textures.push(t);
}

// Takes a shape object, binds all buffers and sets the texture
function makeObject(shape, texID) {

    var object = [];
    object.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, object.vertexPositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(shape.vertices), gl.STATIC_DRAW );

    object.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indexes), gl.STATIC_DRAW);
    object.vertexIndexBuffer.numItems = shape.indexes.length;

    object.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, object.vertexNormalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(shape.normals), gl.STATIC_DRAW );
    object.vertexNormalBuffer.numItems = shape.normals.length;

    object.textCoordBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, object.textCoordBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(shape.texCoords), gl.STATIC_DRAW );

    object.localMatrix = mat4();
    object.texture = texID;
    return object;
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    initGL(canvas);
    init_Shaders();
    initTextures();

    // Create a sphere to be our world
    world = makeObject(sphere(1, 180), skyTexture);

    // Set the locations of each sticker color in the texture image
    var texGREEN = [0,1/3, 0,2/3, 1/3,1/3, 1/3,2/3];
    var texORANGE = [0,2/3, 0,1, 1/3,2/3, 1/3,1];
    var texBLUE = [2/3,1/3, 2/3,2/3, 1,1/3, 1,2/3];
    var texRED = [1/3,1/3, 1/3,2/3, 2/3,1/3, 2/3,2/3];
    var texYELLOW = [2/3,2/3, 2/3,1, 1,2/3, 1,1];
    var texWHITE = [1/3,2/3, 1/3,1, 2/3,2/3, 2/3,1];
    var texBLACK = [0,0, 0,1/3, 1/3,0, 1/3,1/3];

    // Push and unused cubie into the array. Only used to make the numbering of
    // cubies a little easier
    cubies.push(makeObject(cube(1), cubeTexture));

    // The numbering of the cubies is as follows, viewing the cube from the top:
    //
    //        Top layer               Middle layer            Bottom layer
    //   ___________________      ___________________     ___________________
    //   |     |     |     |      |     |     |     |     |     |     |     | 
    //   |  1  |  2  |  3  |      |  10 |  11 |  12 |     |  19 |  20 |  21 |
    //   |_____|_____|_____|      |_____|_____|_____|     |_____|_____|_____|
    //   |     |     |     |      |     |     |     |     |     |     |     | 
    //   |  4  |  5  |  6  |      |  13 |  14 |  15 |     |  22 |  23 |  24 |
    //   |_____|_____|_____|      |_____|_____|_____|     |_____|_____|_____|
    //   |     |     |     |      |     |     |     |     |     |     |     | 
    //   |  7  |  8  |  9  |      |  16 |  17 |  18 |     |  25 |  26 |  27 |
    //   |_____|_____|_____|      |_____|_____|_____|     |_____|_____|_____|
    

    // Create cubies for the top layer of the cube, giving them the appropriate
    // texture coordinates and then pushing them to the cubie array.
    var c1 = cube(1);
    c1.texCoords = [texBLACK, texBLACK, texBLUE, texRED, texYELLOW, texBLACK];
    cubies.push(makeObject(c1, cubeTexture));

    var c2 = cube(1);
    c2.texCoords = [texBLACK, texBLACK, texBLUE, texBLACK, texYELLOW, texBLACK];
    cubies.push(makeObject(c2, cubeTexture));

    var c3 = cube(1);
    c3.texCoords = [texBLACK, texORANGE, texBLUE, texBLACK, texYELLOW, texBLACK];
    cubies.push(makeObject(c3, cubeTexture));
    
    var c4 = cube(1);
    c4.texCoords = [texBLACK, texBLACK, texBLACK, texRED, texYELLOW, texBLACK];
    cubies.push(makeObject(c4, cubeTexture));

    var c5 = cube(1);
    c5.texCoords = [texBLACK, texBLACK, texBLACK, texBLACK, texYELLOW, texBLACK];
    cubies.push(makeObject(c5, cubeTexture));

    var c6 = cube(1);
    c6.texCoords = [texBLACK, texORANGE, texBLACK, texBLACK, texYELLOW, texBLACK];
    cubies.push(makeObject(c6, cubeTexture));
    
    var c7 = cube(1);
    c7.texCoords = [texGREEN, texBLACK, texBLACK, texRED, texYELLOW, texBLACK];
    cubies.push(makeObject(c7, cubeTexture));

    var c8 = cube(1);
    c8.texCoords = [texGREEN, texBLACK, texBLACK, texBLACK, texYELLOW, texBLACK];
    cubies.push(makeObject(c8, cubeTexture));

    var c9 = cube(1);
    c9.texCoords = [texGREEN, texORANGE, texBLACK, texBLACK, texYELLOW, texBLACK];
    cubies.push(makeObject(c9, cubeTexture));
    
    // Create cubies for the middle layer of the cube, giving them the appropriate
    // texture coordinates and then pushing them to the cubie array.
    var c10 = cube(1);
    c10.texCoords = [texBLACK, texBLACK, texBLUE, texRED, texBLACK, texBLACK];
    cubies.push(makeObject(c10, cubeTexture));

    var c11 = cube(1);
    c11.texCoords = [texBLACK, texBLACK, texBLUE, texBLACK, texBLACK, texBLACK];
    cubies.push(makeObject(c11, cubeTexture));

    var c12 = cube(1);
    c12.texCoords = [texBLACK, texORANGE, texBLUE, texBLACK, texBLACK, texBLACK];
    cubies.push(makeObject(c12, cubeTexture));
    
    var c13 = cube(1);
    c13.texCoords = [texBLACK, texBLACK, texBLACK, texRED, texBLACK, texBLACK];
    cubies.push(makeObject(c13, cubeTexture));

    // Center of the cube needs no texture coords
    cubies.push(makeObject(cube(1), cubeTexture));

    var c15 = cube(1);
    c15.texCoords = [texBLACK, texORANGE, texBLACK, texBLACK, texBLACK, texBLACK];
    cubies.push(makeObject(c15, cubeTexture));
    
    var c16 = cube(1);
    c16.texCoords = [texGREEN, texBLACK, texBLACK, texRED, texBLACK, texBLACK];
    cubies.push(makeObject(c16, cubeTexture));

    var c17 = cube(1);
    c17.texCoords = [texGREEN, texBLACK, texBLACK, texBLACK, texBLACK, texBLACK];
    cubies.push(makeObject(c17, cubeTexture));

    var c18 = cube(1);
    c18.texCoords = [texGREEN, texORANGE, texBLACK, texBLACK, texBLACK, texBLACK];
    cubies.push(makeObject(c18, cubeTexture));
    
    // Create cubies for the bottom layer of the cube, giving them the appropriate
    // texture coordinates and then pushing them to the cubie array.
    var c19 = cube(1);
    c19.texCoords = [texBLACK, texBLACK, texBLUE, texRED, texBLACK, texWHITE];
    cubies.push(makeObject(c19, cubeTexture));

    var c20 = cube(1);
    c20.texCoords = [texBLACK, texBLACK, texBLUE, texBLACK, texBLACK, texWHITE];
    cubies.push(makeObject(c20, cubeTexture));

    var c21 = cube(1);
    c21.texCoords = [texBLACK, texORANGE, texBLUE, texBLACK, texBLACK, texWHITE];
    cubies.push(makeObject(c21, cubeTexture));
    
    var c22 = cube(1);
    c22.texCoords = [texBLACK, texBLACK, texBLACK, texRED, texBLACK, texWHITE];
    cubies.push(makeObject(c22, cubeTexture));

    var c23 = cube(1);
    c23.texCoords = [texBLACK, texBLACK, texBLACK, texBLACK, texBLACK, texWHITE];
    cubies.push(makeObject(c23, cubeTexture));

    var c24 = cube(1);
    c24.texCoords = [texBLACK, texORANGE, texBLACK, texBLACK, texBLACK, texWHITE];
    cubies.push(makeObject(c24, cubeTexture));
    
    var c25 = cube(1);
    c25.texCoords = [texGREEN, texBLACK, texBLACK, texRED, texBLACK, texWHITE];
    cubies.push(makeObject(c25, cubeTexture));

    var c26 = cube(1);
    c26.texCoords = [texGREEN, texBLACK, texBLACK, texBLACK, texBLACK, texWHITE];
    cubies.push(makeObject(c26, cubeTexture));

    var c27 = cube(1);
    c27.texCoords = [texGREEN, texORANGE, texBLACK, texBLACK, texBLACK, texWHITE];
    cubies.push(makeObject(c27, cubeTexture));

    // Move all of the cubies into their individual positions
    cubies[1].localMatrix = translate(-1, 1, -1);
    cubies[2].localMatrix = translate(0, 1, -1);
    cubies[3].localMatrix = translate(1, 1, -1);
    cubies[4].localMatrix = translate(-1, 1, 0);
    cubies[5].localMatrix = translate(0, 1, 0);
    cubies[6].localMatrix = translate(1, 1, 0);
    cubies[7].localMatrix = translate(-1, 1, 1);
    cubies[8].localMatrix = translate(0, 1, 1);
    cubies[9].localMatrix = translate(1, 1, 1);

    cubies[10].localMatrix = translate(-1, 0, -1);
    cubies[11].localMatrix = translate(0, 0, -1);
    cubies[12].localMatrix = translate(1, 0, -1);
    cubies[13].localMatrix = translate(-1, 0, 0);
    cubies[14].localMatrix = translate(0, 0, 0);
    cubies[15].localMatrix = translate(1, 0, 0);
    cubies[16].localMatrix = translate(-1, 0, 1);
    cubies[17].localMatrix = translate(0, 0, 1);
    cubies[18].localMatrix = translate(1, 0, 1);

    cubies[19].localMatrix = translate(-1, -1, -1);
    cubies[20].localMatrix = translate(0, -1, -1);
    cubies[21].localMatrix = translate(1, -1, -1);
    cubies[22].localMatrix = translate(-1, -1, 0);
    cubies[23].localMatrix = translate(0, -1, 0);
    cubies[24].localMatrix = translate(1, -1, 0);
    cubies[25].localMatrix = translate(-1, -1, 1);
    cubies[26].localMatrix = translate(0, -1, 1);
    cubies[27].localMatrix = translate(1, -1, 1);
    

    // Specify function to handle keyboard input
    document.onkeydown = handleKeyDown;   

    gl.clearColor( 0.9, 0.9, 0.9, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    render();
};

function handleKeyDown(event) {
    // Check to see if we are "locked". This happens if we are in the middle of a turn animation
    // If we are, do nothing and ignore the key. (Probably better way of doing this so we can
    // keep track of them or something) If we aren't locked, determine the key pressed
    if(lock === false) {
        // Reset the array of cubies that the render loop looks at to determine if and
        // which faces need to be tured
        cubiesToTurn = [];

        if (String.fromCharCode(event.keyCode) == "R") {
            lock = true;
            cubiesToTurn.push(
                cubies[3],  cubies[6],  cubies[9],
                cubies[12], cubies[15], cubies[18],
                cubies[21], cubies[24], cubies[27]);
            
            if(event.shiftKey) {
                rotationDirection = COUNTERCLOCKWISE;
            }

            rotationAxis = [-1 * rotationDirection, 0, 0];
            theta += THETA_PER_TICK;
            lastTurn = RIGHT_FACE;
        }
        if (String.fromCharCode(event.keyCode) == "F") {
            lock = true;
            cubiesToTurn.push(
                cubies[7],  cubies[8],  cubies[9],
                cubies[16], cubies[17], cubies[18],
                cubies[25], cubies[26], cubies[27]);

            if(event.shiftKey) {
                rotationDirection = COUNTERCLOCKWISE;
            }
            
            rotationAxis = [0,0,-1 * rotationDirection];
            theta += THETA_PER_TICK;
            lastTurn = FRONT_FACE;
        }
        if (String.fromCharCode(event.keyCode) == "U") {
            lock = true;
            cubiesToTurn.push(
                cubies[1], cubies[2], cubies[3],
                cubies[4], cubies[5], cubies[6],
                cubies[7], cubies[8], cubies[9]);

            if(event.shiftKey) {
                rotationDirection = COUNTERCLOCKWISE;
            }
            
            rotationAxis = [0,-1 * rotationDirection,0]; 
            theta += THETA_PER_TICK;
            lastTurn = UP_FACE;
       }
        if (String.fromCharCode(event.keyCode) == "L") {
            lock = true;
            cubiesToTurn.push(
                cubies[1],  cubies[4],  cubies[7],
                cubies[10], cubies[13], cubies[16],
                cubies[19], cubies[22], cubies[25]);

            if(event.shiftKey) {
                rotationDirection = COUNTERCLOCKWISE;
            }
            
            rotationAxis = [1 * rotationDirection,0,0];
            theta += THETA_PER_TICK;
            lastTurn = LEFT_FACE;
        }
        if (String.fromCharCode(event.keyCode) == "B") {
            lock = true;
            cubiesToTurn.push(
                cubies[1],  cubies[2],  cubies[3],
                cubies[10], cubies[11], cubies[12],
                cubies[19], cubies[20], cubies[21]);

            if(event.shiftKey) {
                rotationDirection = COUNTERCLOCKWISE;
            }
            
            rotationAxis = [0,0,1 * rotationDirection];
            theta += THETA_PER_TICK;
            lastTurn = BACK_FACE;
        }
        if (String.fromCharCode(event.keyCode) == "D") {
            lock = true;
            cubiesToTurn.push(
                cubies[19], cubies[20], cubies[21],
                cubies[22], cubies[23], cubies[24], 
                cubies[25], cubies[26], cubies[27]);

            if(event.shiftKey) {
                rotationDirection = COUNTERCLOCKWISE;
            }
            
            rotationAxis = [0,1 * rotationDirection,0];
            theta += THETA_PER_TICK;
            lastTurn = DOWN_FACE;
        }
        if (String.fromCharCode(event.keyCode) == "X") {
            lock = true;
            cubiesToTurn = cubies;

            if(event.shiftKey) {
                rotationDirection = COUNTERCLOCKWISE;
            }
            
            rotationAxis = [-1 * rotationDirection,0,0];
            theta += THETA_PER_TICK;
            lastTurn = X_ROTATION;
        }
        if (String.fromCharCode(event.keyCode) == "Y") {
            lock = true;
            cubiesToTurn = cubies;

            if(event.shiftKey) {
                rotationDirection = COUNTERCLOCKWISE;
            }
            
            rotationAxis = [0,-1 * rotationDirection,0];
            theta += THETA_PER_TICK;
            lastTurn = Y_ROTATION;
        }
        if (String.fromCharCode(event.keyCode) == "Z") {
            lock = true;
            cubiesToTurn = cubies;

            if(event.shiftKey) {
                rotationDirection = COUNTERCLOCKWISE;
            }
            
            rotationAxis = [0,0,-1 * rotationDirection];
            theta += THETA_PER_TICK;
            lastTurn = Z_ROTATION;
        }
    }
}

// betterRotate is a helper function to make rotations a little easier
function betterRotate(x, y, z) {
    return mult(mult(rotate(x, [1,0,0]), rotate(y, [0,1,0])), rotate(z, [0,0,1]));
}

// betterMult is a helper function to make multiple matrix multiplications a little easier
function betterMult() {
    result = mat4();
    for(i = 0; i < arguments.length; i++) {
        result = mult(result, arguments[i]);
    }
    return result;
}

// This function takes an object and draws it to the canvas
function drawShape(object) {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, flatten(object.localMatrix));

    var normalMat = normalMatrix(object.localMatrix, 1);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, flatten(normalMat));

    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0 );
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.vertexIndexBuffer);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, object.textCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureAttribute, 2, gl.FLOAT, false, 0, 0 );
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, object.texture);
    gl.uniform1i(shaderProgram.sampler, 0);

    gl.drawElements(gl.TRIANGLES, object.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    // Create the camera matrix
    //var eye = [Math.sin(radians(tick*.5%360)) * 9, Math.sin(radians(tick*.5%360)) + 4, Math.cos(radians(tick*.5%360)) * 9];
    var eye = [7 ,4 ,8];
    var at = [0, 0, 0];
    var up = [0, 1, 0];
    camera = lookAt(eye, at, up);

    // Create the projection matrix
    projection = perspective( 50, 1.0, 1, 2000 );

    // Set lighting values and positions
    var lightLoc = vec3(7, 4, 8);
    var cameraLoc = eye;
    var ambientLight = vec3(0.4, 0.4, 0.4);
    var diffuseLight = vec3(0.8, 0.8, 0.8);
    var specularLight = vec3(0.5, 0.5, 0.5);
    var specularIntensity = 100.0;
    
    // Pass uniforms for camera, projection, lighting, etc.
    gl.uniformMatrix4fv(shaderProgram.cameraMatrixUniform, false, flatten(camera));
    gl.uniformMatrix4fv(shaderProgram.projectionMatrixUniform, false, flatten(projection));
    gl.uniform3fv(shaderProgram.lightLocationUniform, lightLoc);
    gl.uniform3fv(shaderProgram.cameraLocationUniform, cameraLoc);
    gl.uniform3fv(shaderProgram.ambientColorUniform, ambientLight);
    gl.uniform3fv(shaderProgram.diffuseColorUniform, diffuseLight);
    gl.uniform3fv(shaderProgram.specularColorUniform, specularLight);
    gl.uniform1f(shaderProgram.specularIntensityUniform, specularIntensity);

    // Draw the outer sphere (the world) and give it a little animation
    world.localMatrix = betterMult(betterRotate(0, tick/20, 0), scalem(20, 20, 20));
    drawShape(world);

    // Go through all of the cubies and determine if they are in our cubiesToTurn array.
    // If so rotate them by the THETA_PER_TICK constant
    for(var i = 0; i < cubies.length; i++) {
        if(cubiesToTurn.indexOf(cubies[i]) >= 0) {
            cubies[i].localMatrix = betterMult(rotate(theta, rotationAxis), cubies[i].localMatrix)
        }
    }

    // Cycle through all of the cubies and draw them to the screen
    for(var i = 0; i < cubies.length; i++) {
        drawShape(cubies[i]);
    }

    // Check theta to see if we are turning. If we aren't it should be at 0. If we are turning,
    // increment our degreesCompleted by our THETA_PER_TICK constant
    if(theta > 0) {
        degreesCompleted+= theta;
    }

    // Check to see if we have completed a 90 degree turn. If so, reset both degreesCompleted,
    // and theta. Resetting theta will stop the turning.
    if(degreesCompleted >= 90) {
        degreesCompleted = 0;
        theta = 0;

        // Depending on which face was turned and in what direction, we need to move the
        // cubies around in our array accordingly. Also reset our lastTurn variable
        if(lastTurn == RIGHT_FACE) {
            if(rotationDirection == CLOCKWISE) {
                RTurn(cubies);
            }
            else {
                RPTurn(cubies);
            }
            lastTurn = 0;
        }
        else if(lastTurn == FRONT_FACE) {
            if(rotationDirection == CLOCKWISE) {
                FTurn(cubies);
            }
            else {
                FPTurn(cubies);
            }
            lastTurn = 0;
        }
        else if(lastTurn == UP_FACE) {
            if(rotationDirection == CLOCKWISE) {
                UTurn(cubies);
            }
            else {
                UPTurn(cubies);
            }
            lastTurn = 0;
        }
        else if(lastTurn == LEFT_FACE) {
            if(rotationDirection == CLOCKWISE) {
                LTurn(cubies);
            }
            else {
                LPTurn(cubies);
            }
            lastTurn = 0;
        }
        else if(lastTurn == BACK_FACE) {
            if(rotationDirection == CLOCKWISE) {
                BTurn(cubies);
            }
            else {
                BPTurn(cubies);
            }
            lastTurn = 0;
        }
        else if(lastTurn == DOWN_FACE) {
            if(rotationDirection == CLOCKWISE) {
                DTurn(cubies);
            }
            else {
                DPTurn(cubies);
            }
            lastTurn = 0;
        }
        else if(lastTurn == X_ROTATION) {
            if(rotationDirection == CLOCKWISE) {
                XRot(cubies);
            }
            else {
                XPRot(cubies);
            }
            lastTurn = 0;
        }
        else if(lastTurn == Y_ROTATION) {
            if(rotationDirection == CLOCKWISE) {
                YRot(cubies);
            }
            else {
                YPRot(cubies);
            }
            lastTurn = 0;
        }
        else if(lastTurn == Z_ROTATION) {
            if(rotationDirection == CLOCKWISE) {
                ZRot(cubies);
            }
            else {
                ZPRot(cubies);
            }
            lastTurn = 0;
        }

        // Finally we can unlock the cube and rest the turn direction
        rotationDirection = CLOCKWISE;
        lock = false;
    }

    
    
    window.requestAnimFrame(render);
    
    // increment our timer
    tick += 1;
}