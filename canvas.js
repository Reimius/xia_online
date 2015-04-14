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
}

Xia.canvas.renderCanvas = function(){
	
	Xia.canvas.backgroundImage = new Image();
	//imageObj.onload = function() {
	//	context.drawImage(imageObj, 69, 50);
	//};
	Xia.canvas.backgroundImage.src = "image/background.png";
	
	Xia.canvas.canvas = $("<canvas></canvas>");
    Xia.canvas.canvas[0].width = document.body.clientWidth;
    Xia.canvas.canvas[0].height = document.body.clientHeight;
	$(document.body).append(Xia.canvas.canvas);
	Xia.canvas.canvas.bind("mousemove", function(event){
		
		Xia.canvas.mouseX = event.clientX;
		Xia.canvas.mouseY = event.clientY;
		
		if(Xia.canvas.mouseIsDown)
		{
			Xia.canvas.deltaX = (event.clientX - Xia.canvas.originalX) + Xia.canvas.deltaX;
			Xia.canvas.deltaY = (event.clientY - Xia.canvas.originalY) + Xia.canvas.deltaY;
			Xia.canvas.originalX = event.clientX;
			Xia.canvas.originalY = event.clientY;
		}
	});
	
	Xia.canvas.canvas.bind("mousedown", function(event){
		Xia.canvas.originalX = event.clientX;
		Xia.canvas.originalY = event.clientY;
		Xia.canvas.mouseIsDown = true;
	});
	
	$(window).bind("mouseup", function(event){
		Xia.canvas.mouseIsDown = false;
	});

	if(Xia.canvas.canvas[0].getContext )
    {
        Xia.canvas.c2 = Xia.canvas.canvas[0].getContext('2d');
		
		new Xia.Outpost338({x:0, y:0});//0,0
		new Xia.RedGulch({x:-1, y:0, rotations: 5});//-1, 0
		
		Xia.canvas.drawCanvasFrame();
    }
};

Xia.canvas.drawCanvasFrame = function(){
	
	//Xia.canvas.c2.fillStyle="#363636";
	//Xia.canvas.c2.fillRect(0,0,Xia.canvas.canvas[0].width, Xia.canvas.canvas[0].height);
	
	
	Xia.canvas.c2.drawImage(Xia.canvas.backgroundImage, 0, 0, Xia.canvas.canvas[0].width, Xia.canvas.canvas[0].height);
	
	
	var allTiles = Xia.tile.allTiles;
	for(var i = 0; i < allTiles.length; i++)
		allTiles[i].render();//draw all Hexes that exist in the configuration array
	
	setTimeout(Xia.canvas.drawCanvasFrame, 30);
};