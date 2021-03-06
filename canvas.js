Xia.canvas = {};
//some variables used mostly for the canvas rendering
Xia.canvas.originalX = 0;
Xia.canvas.originalY = 0;
Xia.canvas.deltaX = 0;
Xia.canvas.deltaY = 0;
Xia.canvas.mouseIsDown = false;
Xia.canvas.mouseX = 0;
Xia.canvas.mouseY = 0;

Xia.canvas.textSizeCache = {};//used by the Xia.canvas.getTextSizeByWidth function

Xia.canvas.getTextSizeByWidth = function(text, maxWidth){    
	if(Xia.canvas.textSizeCache[text + "_" + maxWidth])
		return Xia.canvas.textSizeCache[text + "_" + maxWidth];

    // start with a large font size
    var fontsize = 300;
	var c2 = Xia.canvas.c2;
	var textWidth = null

    // lower the font size until the text fits the canvas
    do{
        fontsize--;
        c2.font= fontsize+"px arial";
		textWidth = c2.measureText(text).width;
    }while(textWidth > maxWidth)
		
	Xia.canvas.textSizeCache[text + "_" + maxWidth] = fontsize;
	return fontsize;
};

Xia.canvas.trackMouse = function(event){
	
	Xia.canvas.mouseX = event.clientX;
	Xia.canvas.mouseY = event.clientY;
	
	//if the mouse is down, we want to set the deltas for offsetting everything the canvas renders
	if(Xia.canvas.mouseIsDown)
	{
		Xia.canvas.deltaX = (event.clientX - Xia.canvas.originalX) + Xia.canvas.deltaX;
		Xia.canvas.deltaY = (event.clientY - Xia.canvas.originalY) + Xia.canvas.deltaY;
		Xia.canvas.originalX = event.clientX;
		Xia.canvas.originalY = event.clientY;
	}
};

//when the mouse goes down, we want to save those coordinates and also set the global variable to indicate we are in mouse down mode
Xia.canvas.mouseDown = function(event){
	Xia.canvas.originalX = event.clientX;
	Xia.canvas.originalY = event.clientY;
	Xia.canvas.mouseIsDown = true;
};

//sets the canvas element's width and height based on the window size in the browser
Xia.canvas.sizeCanvas = function(){
	Xia.canvas.canvas[0].width = document.body.clientWidth;
    Xia.canvas.canvas[0].height = document.body.clientHeight;
};

//the initial startup function that inits everything for the render loop
Xia.canvas.renderCanvas = function(){
	
	Xia.canvas.backgroundImage = new Image();
	Xia.canvas.backgroundImage.src = "image/background.png";
	
	Xia.canvas.canvas = $("<canvas></canvas>");
	Xia.canvas.sizeCanvas();
	$(document.body).append(Xia.canvas.canvas);
	
	Xia.canvas.canvas.bind("mousemove", Xia.canvas.trackMouse);
	Xia.canvas.canvas.bind("mousedown", Xia.canvas.mouseDown);
	
	$(window).bind("mouseup", function(event){
		Xia.canvas.mouseIsDown = false;
	});
	
	//this will correct the canvas if the user decides to resize the window for anything
	$(window).bind("resize", Xia.canvas.sizeCanvas);

	if(Xia.canvas.canvas[0].getContext)
    {
        Xia.canvas.c2 = Xia.canvas.canvas[0].getContext('2d');
		
		Xia.canvas.drawCanvasFrame();
    }
};

Xia.canvas.drawCanvasFrame = function(){
	
	Xia.canvas.c2.drawImage(Xia.canvas.backgroundImage, 0, 0, Xia.canvas.canvas[0].width, Xia.canvas.canvas[0].height);
	
	var activeHexes = Xia.allHex;
	for(var i = 0; i < activeHexes.length; i++)
		activeHexes[i].renderInitial();//draw all hex "background" stuff
	
	var activeHexes = Xia.allHex;
	for(var i = 0; i < activeHexes.length; i++)
		activeHexes[i].renderFinal();//draw all hex "foreground" stuff
	
	var activeTiles = Xia.tile.activeTiles;
	for(var i = 0; i < activeTiles.length; i++)
		activeTiles[i].render();//draw all render material at the tile level
	
	setTimeout(Xia.canvas.drawCanvasFrame, 30);
};