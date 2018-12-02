var createSkyBox = function(gl, width, height){  

	targets = [ 	 gl.TEXTURE_CUBE_MAP_POSITIVE_X,
                     gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                     gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
                     gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                     gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
                     gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]; 
                     
    (function InitFBOCube(that){
		    // WebGLFramebuffer
		    that.fboShader = gl.createFramebuffer();
		    gl.bindFramebuffer(gl.FRAMEBUFFER, that.fboShader);
		    that.fboShader.width = 512;
		    that.fboShader.height = 512;
		    
		    gl.activeTexture(gl.TEXTURE0); console.log("开启纹理单元"+gl.TEXTURE0);
		    
		    that.cubeTexID = gl.createTexture();
		    gl.bindTexture(gl.TEXTURE_CUBE_MAP, that.cubeTexID);
		    
		    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		
		    for (var i = 0; i < targets.length; i++) {
		        gl.texImage2D(targets[i], 0, gl.RGBA, that.fboShader.width, that.fboShader.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		    }
		  //  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		   
		})(this);
		
	this.renderFBO = function(program) {
		gl.disable(gl.DEPTH_TEST);
	    gl.viewport(0, 0, width, height);
	    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboShader);
	    
	    for (var i = 0; i < targets.length; i++) {
	        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, targets[i], this.cubeTexID, null);
	        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	    }
	
	    var per = SetPerspective(45, 1, 0.1, 200.0); 
	    for (var i = 0; i < targets.length; i++) {
	        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, targets[i], this.cubeTexID, null);
	        var lookat = [0.0, 0.0, 0.0];
	        var up = [0.0, 0.0, 0.0];
	        up[1] = 1.0;
	        if (i == 0) {
	            lookat[0] = -1.0;
	        } else if (i == 1) {
	            lookat[0] = 1.0;             
	        } else if (i == 2) {
	            lookat[1] = -1.0;
	            up[0] = 1.0;
	        } else if (i == 3) {
	            lookat[1] = 1.0;
	            up[0] = 1.0;
	        } else if (i == 4) {
	            lookat[2] = -1.0;         
	        } else if (i == 5) {
	            lookat[2] = 1.0;            
	        };          
	        
	      //   if(i == 4) console.log(lookat + '\\' + up); 
		   var look = LookAt(0.0 ,0.0, 0.0, lookat[0], lookat[1], lookat[2], up[0], up[1], up[2]);
		       
		   var u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
		   gl.uniformMatrix4fv(u_MvpMatrix, false, multiply(look, per));
		
		   gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0); 
	    } 
	    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	    gl.enable(gl.DEPTH_TEST);
	    
	}
}
 

var testcube = function(gl) {
 
	this.program = createProgram(gl, "boxVertex", "boxFragment");
	var vertices = new Float32Array([   // Coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
  	]); 
    var textures = new Float32Array([
     0.0, 1.0,   1.0, 1.0,   1.0, 0.0,   0.0, 0.0,
     0.0, 1.0,   1.0, 1.0,   1.0, 0.0,   0.0, 0.0,
     1.0, 0.0,   0.0, 0.0,   0.0, 1.0,   1.0, 1.0,      
     0.0, 1.0,   1.0, 1.0,   1.0, 0.0,   0.0, 0.0,
     0.0, 1.0,   1.0, 1.0,   1.0, 0.0,   0.0, 0.0,
     0.0, 1.0,   1.0, 1.0,   1.0, 0.0,   0.0, 0.0
    ]);
    
    var tangents = new Float32Array([
     -2,0,0, -2,0,0, -2,0,0, -2,0,0,
     0,-2,0, 0,-2,0,0,-2,0,0,-2,0,
     0,0,-2,0,0,-2,0,0,-2,0,0,-2,
     
     0,0,-2,0,0,-2,0,0,-2,0,0,-2,
     2,0,0,2,0,0,2,0,0,2,0,0,
     -2,0,0,-2,0,0,-2,0,0,-2,0,0
    ]);
    
    var normals = new Float32Array([    // Normal
	    0.0, 0.0,-1.0,  0.0, 0.0, -1.0,   0.0, 0.0, -1.0,   0.0, 0.0, -1.0,  // v0-v1-v2-v3 front
	   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,   -1.0, 0.0, 0.0,   -1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
	    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
	    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
	    0.0,1.0, 0.0,   0.0,1.0, 0.0,   0.0,1.0, 0.0,   0.0,1.0, 0.0,  // v7-v4-v3-v2 down
	    0.0, 0.0,1.0,   0.0, 0.0,1.0,   0.0, 0.0,1.0,   0.0, 0.0,1.0   // v4-v7-v6-v5 back
	  ]);

  var colors = new Float32Array([    // Colors 
     0, 1, 0,   0, 1, 0,   0, 1, 0,  0, 1, 0,     // v0-v1-v2-v3 front  1
     1, 1, 0,   1, 1, 0,   1, 1, 0,  1, 1, 0,     // v0-v3-v4-v5 right  1
     1, 0, 1,   1, 0, 1,   1, 0, 1,  1, 0, 1,     // v0-v5-v6-v1 up     
     0, 0, 1,   0, 0, 1,   0, 0, 1,  0, 0, 1,     // v1-v6-v7-v2 left   1
     1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 1, 0,     // v7-v4-v3-v2 down   1
     0, 1, 1,   0, 1, 1,   0, 1, 1,  0, 1, 1　        // v4-v7-v6-v5 back   1
 ]);

  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
 ]);
  var verticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  var textureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, textures, gl.STATIC_DRAW);
//  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  var tangentBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, tangents, gl.STATIC_DRAW);
 // gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
//  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
//  gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
//  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  
  
  var pers = SetPerspective(90, canvas.width/canvas.height, 0.01, 10000);
  var look = LookAt(0.0, 0.0, 40.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0); 
  var last = multiply(rotateX(40), multiply(look, pers));
  
  this.init = function(u_MvpMatrix){
  	gl.useProgram(this.program);
//顶点  	
  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  	gl.vertexAttribPointer(this.program.a_Position, 3, gl.FLOAT, false, 0, 0);  
  	gl.enableVertexAttribArray(this.program.a_Position);
//纹理坐标
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(this.program.a_Texture, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.program.a_Texture);
//切向量 
    gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
    gl.vertexAttribPointer(this.program.a_Tangent, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.program.a_Tangent);
//法向量
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(this.program.a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.program.a_Normal);
//颜色 
  	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  	gl.vertexAttribPointer(this.program.a_Color, 3, gl.FLOAT, false, 0, 0);
  	gl.enableVertexAttribArray(this.program.a_Color);
 	
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  	
  	gl.uniformMatrix4fv(this.program.u_MvpMatrix, false, u_MvpMatrix);
  
  	gl.uniform3f(this.program.u_PointLight, 3.0, 3.0, 3.0);
  }
   
  this.draw = function(last){

  gl.uniformMatrix4fv(this.program.u_MvpMatrix, false, last);
  	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0); 
  }
}



	
