Xia.hex = {};
Xia.hex.canvasHexWidth = 80;
Xia.hex.canvasHexHeight = 70;

//not sure, should I hold the coordinates in the class or in the containing grid that I will need (or both?)
Xia.Hex = new JS.Class({
	
	backgroundColor: "#000",
	baseBorderColor: "#999",
	x: null,
	y: null,
	canvasX: null,
	canvasY: null,
	type: "EMPTY",
	
	//the center shift is for where the very center tile will be placed coordinates 0,0
	centerShiftX: null,
    centerShiftY: null,
	canvasHexWidth: 80,
	canvasHexHeight: 70,
	
	borderType: null,
	
	borderConfig: null,
	
	colorMap: {
		"ASTEROID": "#FF7F24"
	},
	cubeColorMap: {
		"S": "#FF8000",
		"H": "#FF0066",
		"T": "#006600",
		"P": "#0066FF",
		"C": "#6600CC"
	},
	
	specialType: null,
	spawnNumber: null,
	miningCube: null,
	
	initialize: function(config) {
		var me = this;
		me.x = config.x;
		me.y = config.y;
		me.specialType = config.specialType;
		me.spawnNumber = config.spawnNumber;
		me.miningCube = config.miningCube;
		
		me.canvasX = (me.x * (Xia.hex.canvasHexWidth * .75));
		me.canvasY = (me.y * Xia.hex.canvasHexHeight) + ((Math.abs(me.x % 2) == 1) ? (Xia.hex.canvasHexHeight / 2) : 0);
		
		if(config.type == "ASTEROID")
		{
			me.type = "ASTEROID";
			me.borderType = "ASTEROID";
			me.borderConfig = {
				t:  true,
				tr: true,
				br: true,
				b:  true,
				bl: true,
				tl: true
			};
		}
		
		Xia.allHex.push(me);//add to the global array of all hexes to be rendered :P
    },
	
	//it's possible a Hex could get instantiated before render of the body, this function laxy retreives the document width and height when needed
	setCenterShiftCoordinates: function(){
		var me = this;
		me.centerShiftX = Math.floor(document.body.clientWidth / 2);
		me.centerShiftY = Math.floor(document.body.clientHeight / 2);
	},
	
	getHexCenterCoordinates: function(){
		var me = this;
		if(!me.centerShiftX)
			me.setCenterShiftCoordinates();
		
		return {
			x: me.canvasX + Xia.canvas.deltaX + me.centerShiftX,
			y: me.canvasY + Xia.canvas.deltaY + me.centerShiftY
		};
	},
	
	//the actual render to the canvas
	render: function(){
		var me = this;
		if(!me.centerShiftX)
			me.setCenterShiftCoordinates();
		
		var c2 = Xia.canvas.c2,
			centerSpot = me.getHexCenterCoordinates(),
			x = centerSpot.x,
			y = centerSpot.y;
	
		c2.lineWidth = 1;
		c2.fillStyle = me.backgroundColor;
		c2.strokeStyle = me.baseBorderColor;
		c2.beginPath();
		c2.moveTo(x + (Xia.hex.canvasHexWidth / 2), y);
		c2.lineTo(x + (Xia.hex.canvasHexWidth / 4), y + (Xia.hex.canvasHexHeight / 2));
		c2.lineTo(x - (Xia.hex.canvasHexWidth / 4), y + (Xia.hex.canvasHexHeight / 2));
		c2.lineTo(x - (Xia.hex.canvasHexWidth / 2), y);
		c2.lineTo(x - (Xia.hex.canvasHexWidth / 4), y - (Xia.hex.canvasHexHeight / 2));
		c2.lineTo(x + (Xia.hex.canvasHexWidth / 4), y - (Xia.hex.canvasHexHeight / 2));
		c2.closePath();
		c2.fill();
		c2.stroke();
		
		me.renderBorder();
		me.renderSpecialType();
	},
	
	renderBorder: function(){
		var me = this;
		var c2 = Xia.canvas.c2,
			centerSpot = me.getHexCenterCoordinates(),
			x = centerSpot.x,
			y = centerSpot.y;
		
		if(me.borderConfig)
		{
			var borderColor = me.colorMap[me.borderType];
			var borderConfig = me.borderConfig;
			
			c2.beginPath();
			c2.lineWidth = 2;
			c2.strokeStyle = borderColor;
			c2.moveTo(x + (Xia.hex.canvasHexWidth / 2) - 8, y);
			var whatToDo = me.whichFunctionForBorder(borderConfig.br);
			c2[whatToDo](x + (Xia.hex.canvasHexWidth / 4) - 4, y + (Xia.hex.canvasHexHeight / 2) - 7);
			whatToDo = me.whichFunctionForBorder(borderConfig.b);
			c2[whatToDo](x - (Xia.hex.canvasHexWidth / 4)+ 4, y + (Xia.hex.canvasHexHeight / 2) - 7);
			whatToDo = me.whichFunctionForBorder(borderConfig.bl);
			c2[whatToDo](x - (Xia.hex.canvasHexWidth / 2) + 8, y);
			whatToDo = me.whichFunctionForBorder(borderConfig.tl);
			c2[whatToDo](x - (Xia.hex.canvasHexWidth / 4) + 4, y - (Xia.hex.canvasHexHeight / 2) + 7);
			whatToDo = me.whichFunctionForBorder(borderConfig.t);
			c2[whatToDo](x + (Xia.hex.canvasHexWidth / 4) - 4, y - (Xia.hex.canvasHexHeight / 2) + 7);
			whatToDo = me.whichFunctionForBorder(borderConfig.tr);
			c2[whatToDo](x + (Xia.hex.canvasHexWidth / 2) - 8, y);
			c2.stroke();
		}
		
	},
	
	renderSpecialType: function(){
		var me = this,
			specialType = me.specialType,
			c2 = Xia.canvas.c2,
			centerSpot = me.getHexCenterCoordinates(),
			x = centerSpot.x,
			y = centerSpot.y;
		
		//these branches handle rendering the special type of hexes which allow user interaction
		if(specialType == "MISSION")
		{
			//draw a triangle with an exclamation point in it
			c2.beginPath();
			c2.lineWidth = 2;
			c2.strokeStyle = "#FFFF00";
			c2.moveTo(x, y + (Xia.hex.canvasHexHeight / 4));
			c2.lineTo(x + (Xia.hex.canvasHexWidth / 4), y - (Xia.hex.canvasHexHeight / 4));
			c2.lineTo(x - (Xia.hex.canvasHexWidth / 4), y - (Xia.hex.canvasHexHeight / 4));
			c2.closePath();
			c2.stroke();
			
			c2.beginPath();
			c2.moveTo(x, y - (Xia.hex.canvasHexHeight / 5));
			c2.lineTo(x, y - (Xia.hex.canvasHexHeight / 20));
			c2.closePath();
			c2.stroke();
			
			c2.beginPath();
			c2.arc(x, y + (Xia.hex.canvasHexHeight / 20), Xia.hex.canvasHexWidth / 40, 0, 2 * Math.PI, false);
			c2.fillStyle = "#FFFF00";
			c2.fill();
		}
		else if(specialType == "EXPLORE")
		{
			c2.beginPath();
			c2.arc(x, y, Xia.hex.canvasHexHeight / 5, 0, 2 * Math.PI, false);
			c2.strokeStyle = "#FFFF00";
			c2.stroke();
			
			c2.beginPath();
			c2.arc(x, y - (Xia.hex.canvasHexHeight / 20), Xia.hex.canvasHexHeight / 20, 1 * Math.PI, .5 * Math.PI, false);
			c2.strokeStyle = "#FFFF00";
			c2.stroke();
			
			c2.beginPath();
			c2.moveTo(x, y);
			c2.lineTo(x, y + (Xia.hex.canvasHexHeight / 20));
			c2.stroke();
			
			c2.beginPath();
			c2.arc(x, y + (Xia.hex.canvasHexHeight / 10), Xia.hex.canvasHexWidth / 40, 0, 2 * Math.PI, false);
			c2.fillStyle = "#FFFF00";
			c2.fill();
			
		}
		else if(specialType == "BUY")
		{
			
		}
		else if(specialType == "SELL")
		{
			
		}
		else if(specialType == "SPAWN")
		{
			c2.fillStyle = "#FFFFFF";
			var fontSize = Xia.canvas.getTextSizeByWidth("SP", Xia.hex.canvasHexWidth / 3);
			c2.font = fontSize + "px arial";
			var spWidth = c2.measureText("SP").width;
			c2.fillText("SP", x - (spWidth / 2), y - (Xia.hex.canvasHexHeight / 10));
			var spNumberWidth = c2.measureText(me.spawnNumber).width;
			c2.fillText(me.spawnNumber, x - (spNumberWidth / 2), y + (Xia.hex.canvasHexHeight / 6));
		}
		else if(specialType == "MINING")
		{
			c2.fillStyle = "#FFFFFF";
			var fontSize = Xia.canvas.getTextSizeByWidth("Mining", Xia.hex.canvasHexWidth / 2);
			c2.font = fontSize + "px arial";
			var spWidth = c2.measureText("Mining").width;
			c2.fillText("Mining", x - (Xia.hex.canvasHexWidth / 4) + 2, y - (Xia.hex.canvasHexHeight / 4));
			c2.fillText("1-10 = D", x - (Xia.hex.canvasHexWidth / 3) + 2, y);
			c2.fillText("11-20 = ", x - (Xia.hex.canvasHexWidth / 3) -2, y + (Xia.hex.canvasHexHeight / 4));
			c2.fillStyle = me.cubeColorMap[me.miningCube];
			c2.fillText(me.miningCube, x - (Xia.hex.canvasHexWidth / 3) - 2 + c2.measureText("11-20 = ").width, y + (Xia.hex.canvasHexHeight / 4));
		}
		
		//else do nothing
	},
	
	whichFunctionForBorder: function(draw){
		if(draw)
			return "lineTo";
		return "moveTo";
	},
	
	enterHex: function(ship){
		//this will be called by the player when they enter the hex and will have the game logic here...
	}
	
});

//an array of the all the Hexes, this is currently used for each frame of the canvas to redraw them
Xia.allHex = [];