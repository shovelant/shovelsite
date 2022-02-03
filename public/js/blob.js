let clicked = false
let x = 0
let y = 0
let z = 0
let dx = 0.01
let dy = 0.01
let dz = 0.01
let xBoundary = Math.random() * 4 + 1
let yBoundary = Math.random() * 4 + 1
let zBoundary = Math.random() * 4 + 1
let rotation = 0

function blob() {
    if (clicked) { // Allow clicking the easter egg only once
        return
    }
    clicked = true

    let canvas = document.getElementById('canvas')
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight
    gl = canvas.getContext('experimental-webgl')

    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec2 aTextureCoord;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        varying highp vec2 vTextureCoord;
        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vTextureCoord = aTextureCoord;
        }
    `

    const fsSource = `
        varying highp vec2 vTextureCoord;
        uniform sampler2D uSampler;
        void main(void) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
        }
    `

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        }
    }

    const texture = loadTexture(gl, 'img/blobfish.png')
    const buffers = initBuffers(gl)
    let last = 0
    function render(time) {
        time *= 0.001
        drawScene(gl, programInfo, buffers, texture, time - last)
        requestAnimationFrame(render)
        buffers.vertices = updateVertices(buffers.vertices)
        last = time
    }
    requestAnimationFrame(render)
}

function initBuffers(gl) {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getVertices(x, y, z)), gl.DYNAMIC_DRAW)

    const textureCoordinates = [
        0, 0, // Front
        1, 0,
        1, 1,
        0, 1,
        0, 0, // Back
        1, 0,
        1, 1,
        0, 1,
        0, 0, // Top
        1, 0,
        1, 1,
        0, 1,
        0, 0, // Bottom
        1, 0,
        1, 1,
        0, 1,
        0, 0, // Right
        1, 0,
        1, 1,
        0, 1,
        0, 0, // Left
        1, 0,
        1, 1,
        0, 1,
    ]

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)

    const indices = [
        0,   1,  2,  0,  2,  3, // Front
        4,   5,  6,  4,  6,  7, // Back
        8,   9, 10,  8, 10, 11, // Top
        12, 13, 14, 12, 14, 15, // Bottom
        16, 17, 18, 16, 18, 19, // Right
        20, 21, 22, 20, 22, 23, // Left
    ]

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
    
    return { vertices: vertexBuffer, textureCoord: textureCoordBuffer, indices: indexBuffer }
}

function updateVertices(vertices) { // Probably pretty inefficient
    x += dx
    y += dy
    z += dz

    if (x <= -xBoundary || x > xBoundary) {
        dx *= -1
        xBoundary = Math.random() * 4 + 1
    }
    if (y <= -yBoundary || y > yBoundary) {
        dy *= -1
        yBoundary = Math.random() * 4 + 1
    }
    if (z <= -zBoundary || z > zBoundary) {
        dz *= -1
        zBoundary = Math.random() * 4 + 1
    }

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getVertices(x, y, z)), gl.DYNAMIC_DRAW)

    return vertexBuffer
}

function getVertices(x, y, z) {
    let vertices = [
        -1, -1,  1, // Front
         1, -1,  1,
         1,  1,  1,
        -1,  1,  1,
        -1, -1, -1, // Back
        -1,  1, -1,
         1,  1, -1,
         1, -1, -1,
        -1,  1, -1, // Top
        -1,  1,  1,
         1,  1,  1,
         1,  1, -1,
        -1, -1, -1, // Bottom
         1, -1, -1,
         1, -1,  1,
        -1, -1,  1,
         1, -1, -1, // Right
         1,  1, -1,
         1,  1,  1,
         1, -1,  1,
        -1, -1, -1, // Left
        -1, -1,  1,
        -1,  1,  1,
        -1,  1, -1,
    ]

    for (let vertex = 0; vertex < 24; vertex++) {
        vertices[vertex * 3] += x
        vertices[vertex * 3 + 1] += y
        vertices[vertex * 3 + 2] += z
    }
    return vertices
}

function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.generateMipmap(gl.TEXTURE_2D); // Image width and height must be powers of 2
    }
    image.src = url
    return texture
}

function drawScene(gl, programInfo, buffers, texture, deltaTime) {
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const projectionMatrix = mat4.create();
    const modelViewMatrix = mat4.create();
    mat4.perspective(projectionMatrix, 45 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100)
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6])
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0, 0, 1])
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.5, [0, 1, 0])

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.uniform1i(programInfo.uniformLocations.uSampler, 0)
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    rotation += deltaTime;
}

function initShaderProgram(gl, vsSource, fsSource) {
    const shaderProgram = gl.createProgram()
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}