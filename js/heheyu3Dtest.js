function dragAnimate(canvas){
  		this.dx = 0;
		this.dy = 0;
		this.dlength = 0;
			
			var dragging = false;         // Dragging or not
		  var lastX = 0, lastY = 0;   // Last position of the mouse
		  var that = this;
		  
		  canvas.onmousedown = function(ev) {   // Mouse is pressed
		    var x = ev.clientX, y = ev.clientY;
		    // Start dragging if a moue is in <canvas>
		    var rect = ev.target.getBoundingClientRect();
		    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom){
		    	
		      lastX = x; lastY = y;
		      dragging = true;
		    }
		  };
		  canvas.onmouseup = function(ev) { dragging = false;  }; // Mouse is released
		  canvas.onmousemove = function(ev) { // Mouse is moved
		    if (dragging) { 
		  
		      var factor = 100 / canvas.height; // The rotation ratio
		      that.dx = factor * (ev.clientX - lastX);
		     
		      that.dy = factor * (ev.clientY - lastY);
		      that.dlength = Math.sqrt(that.dx * that.dx + that.dy * that.dy) * 0.1;
		   
		    lastX = ev.clientX, lastY = ev.clientY;
		    }  
		  };
};

var keyDetect = function(){
	  		this.keys = [0, 0, 0, 0];
	  		var that = this;
			document.onkeydown = function(ev){
				var ev
				switch(ev.keyCode)
				{
					case 65: that.keys[1] = 1; break;
					case 83: that.keys[2] = -1; break;
					case 87: that.keys[0] = 1; break;
					case 68: that.keys[3] = -1; break;
					default: return;
				}
			}
				
			document.onkeyup = function(ev){
				var ev
				switch(ev.keyCode)
				{
					case 65:  that.keys[1] = 0; break;
					case 83: that.keys[2] = 0; break;
					case 87: that.keys[0] = 0; break;
					case 68: that.keys[3] = 0; break;
					default: return;
				}
			}		
};
function createProgram(gl, vertex, fragment){
	  var vertexShaderScript = document.getElementById(vertex);
	  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	  gl.shaderSource(vertexShader, vertexShaderScript.text);
	  gl.compileShader(vertexShader);
	  
	  var fragmentShaderScript = document.getElementById(fragment);
	  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	  gl.shaderSource(fragmentShader, fragmentShaderScript.text);
	  gl.compileShader(fragmentShader);
	  
	  var program = gl.createProgram();

	  gl.attachShader(program, vertexShader);
	  gl.attachShader(program, fragmentShader);
	  gl.linkProgram(program);
		
	  var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < uniformCount; i++) {
            var uniformName = gl.getActiveUniform(program, i).name;
            program[uniformName] = gl.getUniformLocation(program, uniformName);
        }
    var attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for(var i = 0; i < attributeCount; i++) {
        		var attributeName = gl.getActiveAttrib(program, i).name;
        		program[attributeName] = gl.getAttribLocation(program, attributeName); 	
        }
        
      return program;
	
}

////////////////////////////////////////////////////////////////////////////////
function requestFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    }
//FireFox
    else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
//Chrome等
    else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
//IE11
    else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};

function fullscreenChange(){
  var canvas = document.getElementById('canvas');
  canvas.requestPointerLock = canvas.requestPointerLock    ||
                              canvas.mozRequestPointerLock ||
                              canvas.webkitRequestPointerLock;
    canvas.requestPointerLock();
}

function lockPointer() {
  var canvas = document.getElementById("canvas");
  canvas.requestFullscreen = canvas.requestFullscreen    ||
                           	 canvas.mozRequestFullscreen ||
                             canvas.mozRequestFullScreen || // 较旧的 API 把 ‘S’ 大写
                             canvas.webkitRequestFullscreen;
  requestFullScreen(canvas);
}
 
document.addEventListener('fullscreenchange', fullscreenChange, false);
document.addEventListener('mozfullscreenchange', fullscreenChange, false);
document.addEventListener('webkitfullscreenchange', fullscreenChange, false);

document.getElementById('button').addEventListener('click',function(){

    requestFullScreen(document.getElementById('canvas'));  
},false);
///////////////////////////////////////////////////////////////////////

function mouseEvent(){
	var that = this;
	this.dx = 0;
	this.dy = 0;
	//右正左负      上正下负
	document.addEventListener("mousemove", function(e) {
  		that.dx = e.movementX       ||
                  e.mozMovementX    ||
                  e.webkitMovementX ||
                  0;
 	    that.dy = e.movementY       ||
                  e.mozMovementY    ||
                  e.webkitMovementY ||
                  0;
}, false);	
}
