//Original code by Inigo Quilez 2009 <http://www.iquilezles.org/apps/shadertoy/>

BrandingLoginWebGL = {

	startTime: false,
	mEffect: false,
	mGLContext: false,
	mCanvas: false,
	
	getContents: function(aURL){
	  var ioService=Components.classes["@mozilla.org/network/io-service;1"]
	    .getService(Components.interfaces.nsIIOService);
	  var scriptableStream=Components
	    .classes["@mozilla.org/scriptableinputstream;1"]
	    .getService(Components.interfaces.nsIScriptableInputStream);
	
	  var channel=ioService.newChannel(aURL,null,null);
	  var input=channel.open();
	  scriptableStream.init(input);
	  var str=scriptableStream.read(input.available());
	  scriptableStream.close();
	  input.close();
	  return str;
	},

	readURI: function(uri) {
	  var ioservice = Cc['@mozilla.org/network/io-service;1'].
	    getService(Ci.nsIIOService);
	  var channel = ioservice.newChannel(uri, 'UTF-8', null);
	  var stream = channel.open();
	
	  var cstream = Cc['@mozilla.org/intl/converter-input-stream;1'].
	    createInstance(Ci.nsIConverterInputStream);
	  cstream.init(stream, 'UTF-8', 0, 0);
	
	  var str = {};
	  var data = '';
	  var read = 0;
	  do {
	    read = cstream.readString(0xffffffff, str);
	    data += str.value;
	  } while (read != 0);
	
	  cstream.close();
	
	  return data;
	},
        
	initGL: function(texture, shader) {
		try
		{
			this.mCanvas = document.getElementById('glcanvas');
			this.mGLContext = this.mCanvas.getContext("experimental-webgl");
		}
		catch(e) {
			this.mGLContext = false;
		}
		if (this.mGLContext) {
			this.mEffect = new Effect(this.mGLContext, this.mCanvas.width, this.mCanvas.height);
			this.mEffect.NewTexture(0,texture);
			var value = this.readURI(shader);
			if (value) {
				this.mEffect.NewShader(value);
				this.startTime = (new Date()).getTime();
				this.renderLoop(this);
			}	
		}
		else {
			var imageObj = new Image();
			var context = this.mCanvas.getContext('2d');
			
			imageObj.onload = function() {
	        	context.drawImage(imageObj, 0, 0);
	      	};
			imageObj.src = 'chrome://sforg/content/placeholder.jpg';
		}
	},

	renderLoop: function(oThis)
	{
    var time = (new Date()).getTime();
		var ltime = time - oThis.startTime;
    oThis.mEffect.Paint(ltime/1000.0, 0, 0, 0, 0);
    oThis.mGLContext.flush();
    setTimeout(oThis.renderLoop, 20, oThis );
	}
};
