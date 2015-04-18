Xia.hex = {};
Xia.hex.canvasHexWidth = 80;
Xia.hex.canvasHexHeight = 70;
Xia.hex.innerAngle = Math.atan((Xia.hex.canvasHexHeight / 2) / (Xia.hex.canvasHexWidth / 4));
//an array of the all the Hexes, this is currently used for each frame of the canvas to redraw them
Xia.allHex = [];

Xia.getInnerAngleXY = function(hypotenuseRatio){
	
	var normalHypotenuseLength = Math.sqrt(Math.pow(Xia.hex.canvasHexWidth / 4, 2) + Math.pow(Xia.hex.canvasHexHeight / 2, 2));//Pythagorean formula
	var hypotenuseLength = normalHypotenuseLength * hypotenuseRatio;
	var y = Math.sin(Xia.hex.innerAngle) * hypotenuseLength;
	var x = Math.cos(Xia.hex.innerAngle) * hypotenuseLength;
	return {
		x: x,
		y: y
	};
}

//not sure, should I hold the coordinates in the class or in the containing grid that I will need (or both?)
Xia.Hex = new JS.Class({
	
	backgroundColor: "#000000",
	baseBorderColor: "#999999",
	x: null,
	y: null,
	canvasX: null,
	canvasY: null,
	type: "EMPTY",
	alignment: null,
	
	//the center shift is for where the very center tile will be placed coordinates 0,0
	centerShiftX: null,
    centerShiftY: null,
	canvasHexWidth: 80,
	canvasHexHeight: 70,
	
	borderConfig: null,
	
	colorMap: {
		"ASTEROID": "#FF7F24",
		"NEBULA": "#FF0066",
		"STAR": "#E60000",
		"DEBRIS": "#FFFF00",
		"GATE": "#7519D1"
	},
	
	alignmentColorMap: {
		"OUTLAW": "#CC2900",
		"NEUTRAL": "#00A100",
		"LAWFUL": "#00B8E6"
	},
	
	alignmentBackgroundColorMap: {
		"OUTLAW": "#470E00",
		"NEUTRAL": "#002600",
		"LAWFUL": "#0F2E4C"
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
	availableCube: null,
	
	initialize: function(config) {
		var me = this;
		me.x = config.x;
		me.y = config.y;
		me.type = config.type;
		me.alignment = config.alignment;
		me.specialType = config.specialType;
		me.spawnNumber = config.spawnNumber;
		me.availableCube = config.availableCube;
		
		me.canvasX = (me.x * (Xia.hex.canvasHexWidth * .75));
		me.canvasY = (me.y * Xia.hex.canvasHexHeight) + ((Math.abs(me.x % 2) == 1) ? (Xia.hex.canvasHexHeight / 2) : 0);
		
		if(config.type == "ASTEROID" || me.type == "DEBRIS")
		{
			me.borderConfig = {
				t:  true,
				tr: true,
				br: true,
				b:  true,
				bl: true,
				tl: true
			};
		}
		else
			me.borderConfig = config.borderConfig;
		
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
	renderInitial: function(){
		var me = this;
		if(!me.centerShiftX)
			me.setCenterShiftCoordinates();
		
		var c2 = Xia.canvas.c2,
			centerSpot = me.getHexCenterCoordinates(),
			x = centerSpot.x,
			y = centerSpot.y;
	
		c2.lineWidth = 1;
		c2.fillStyle = me.backgroundColor;
		if(me.type == "NEBULA")
			c2.fillStyle = "#330014";
		else if(me.type == "STAR")
			c2.fillStyle = "#530000";
		else if(me.type == "PLANET")
			c2.fillStyle = me.alignmentBackgroundColorMap[me.alignment];
		else if(me.type == "GATE")
			c2.fillStyle = "#290052";
		
		c2.strokeStyle = me.baseBorderColor;
		c2.beginPath();
		c2.moveTo(x + (Xia.hex.canvasHexWidth / 2), y);
		c2.lineTo(x + (Xia.hex.canvasHexWidth / 4), y + (Xia.hex.canvasHexHeight / 2));
		c2.lineTo(x - (Xia.hex.canvasHexWidth / 4), y + (Xia.hex.canvasHexHeight / 2));
		c2.lineTo(x - (Xia.hex.canvasHexWidth / 2), y);
		c2.lineTo(x - (Xia.hex.canvasHexWidth / 4), y - (Xia.hex.canvasHexHeight / 2));
		c2.lineTo(x + (Xia.hex.canvasHexWidth / 4), y - (Xia.hex.canvasHexHeight / 2));
		c2.closePath();
		c2.globalAlpha = .8;
		c2.fill();
		c2.stroke();
	},
	
	renderFinal: function(){
		var me = this;
		me.renderBorder();
		me.renderSpecialType();
	},
	
	renderBorder: function(){
		var me = this;
		var c2 = Xia.canvas.c2,
			centerSpot = me.getHexCenterCoordinates(),
			x = centerSpot.x,
			y = centerSpot.y,
			bigDelta = 0,
			smallDelta = 0,
			yDelta = 0,
			innerX = (Xia.hex.canvasHexWidth / 4),
			outerX = (Xia.hex.canvasHexWidth / 2),
			deltaY = (Xia.hex.canvasHexHeight / 2);
		
		if(me.borderConfig)
		{
			if(me.type == "ASTEROID" || me.type == "DEBRIS")
			{
				deltaY = deltaY * .8;
				outerX = outerX * .8;
				innerX = Xia.getInnerAngleXY(.8).x;
			}
			
			var borderColor = me.colorMap[me.type];
			if(me.type == "PLANET")
				borderColor = me.alignmentColorMap[me.alignment];
			
			var borderConfig = me.borderConfig;
			
			c2.beginPath();
			c2.lineWidth = 4;
			c2.strokeStyle = borderColor;
			c2.moveTo(x + outerX, y);
			var whatToDo = me.whichFunctionForBorder(borderConfig.br);
			c2[whatToDo](x + innerX, y + deltaY);
			whatToDo = me.whichFunctionForBorder(borderConfig.b);
			c2[whatToDo](x - innerX, y + deltaY);
			whatToDo = me.whichFunctionForBorder(borderConfig.bl);
			c2[whatToDo](x - outerX, y);
			whatToDo = me.whichFunctionForBorder(borderConfig.tl);
			c2[whatToDo](x - innerX, y - deltaY);
			whatToDo = me.whichFunctionForBorder(borderConfig.t);
			c2[whatToDo](x + innerX, y - deltaY);
			whatToDo = me.whichFunctionForBorder(borderConfig.tr);
			c2[whatToDo](x + outerX, y);
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
			
		c2.lineWidth = 2;
		
		//these branches handle rendering the special type of hexes which allow user interaction
		if(specialType == "MISSION")
		{
			//draw a triangle with an exclamation point in it
			c2.beginPath();
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
			
			var text = "Buy";
			c2.fillStyle = "#FFFFFF";
			var fontSize = Xia.canvas.getTextSizeByWidth(text, Xia.hex.canvasHexWidth / 3);
			c2.font = fontSize + "px arial";
			var textWidth = c2.measureText(text).width;
			c2.fillText(text, x - (textWidth / 2), y - (Xia.hex.canvasHexHeight / 4));
			textWidth = c2.measureText("1000 CR").width;
			c2.fillText("1000 CR", x - (textWidth / 2), y);
			textWidth = c2.measureText("[2x " + me.availableCube + "]").width;
			c2.fillText("[2x ", x - (textWidth / 2), y + (Xia.hex.canvasHexHeight / 4));
			var textWidthWithLess = c2.measureText("[2x ").width;
			c2.fillStyle = me.cubeColorMap[me.availableCube];
			c2.fillText(me.availableCube, x - (textWidth / 2) + textWidthWithLess, y + (Xia.hex.canvasHexHeight / 4));
			textWidthWithLess = c2.measureText("[2x " + me.availableCube).width;
			c2.fillStyle = "#FFFFFF";
			c2.fillText("]", x - (textWidth / 2) + textWidthWithLess, y + (Xia.hex.canvasHexHeight / 4));
			
		}
		else if(specialType == "SELL")
		{
			
			var text = "Sell";
			c2.fillStyle = "#FFFFFF";
			var fontSize = Xia.canvas.getTextSizeByWidth(text, Xia.hex.canvasHexWidth / 3);
			c2.font = fontSize + "px arial";
			var textWidth = c2.measureText(text).width;
			c2.fillText(text, x - (textWidth / 2), y - (Xia.hex.canvasHexHeight / 4));
			textWidth = c2.measureText("1000 CR").width;
			c2.fillText("1000 CR", x - (textWidth / 2), y);
			textWidth = c2.measureText("[2x " + me.availableCube + "]").width;
			c2.fillText("[1x ", x - (textWidth / 2), y + (Xia.hex.canvasHexHeight / 4));
			var textWidthWithLess = c2.measureText("[1x ").width;
			c2.fillStyle = me.cubeColorMap[me.availableCube];
			c2.fillText(me.availableCube, x - (textWidth / 2) + textWidthWithLess, y + (Xia.hex.canvasHexHeight / 4));
			textWidthWithLess = c2.measureText("[2x " + me.availableCube).width;
			c2.fillStyle = "#FFFFFF";
			c2.fillText("]", x - (textWidth / 2) + textWidthWithLess, y + (Xia.hex.canvasHexHeight / 4));
			
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
		else if(specialType == "MINING" || specialType == "HARVEST" || specialType == "SALVAGE")
		{
			var text = "Mining";
			var oneToTen = "D";//D for damage
			if(specialType == "HARVEST")
			{
				text = "Harvest";
				oneToTen = "E";//E for energy
			}
			else if(specialType == "SALVAGE")
			{
				text = "Salvage";
				oneToTen = "T";//T for Death (Termination since D is already used)
			}
			
			c2.fillStyle = "#FFFFFF";
			var fontSize = Xia.canvas.getTextSizeByWidth(text, Xia.hex.canvasHexWidth / 2);
			c2.font = fontSize + "px arial";
			var spWidth = c2.measureText(text).width;
			c2.fillText(text, x - (Xia.hex.canvasHexWidth / 4) + 2, y - (Xia.hex.canvasHexHeight / 4));
			c2.fillText("1-10 = " + oneToTen, x - (Xia.hex.canvasHexWidth / 3) + 2, y);
			c2.fillText("11-20 = ", x - (Xia.hex.canvasHexWidth / 3) -2, y + (Xia.hex.canvasHexHeight / 4));
			c2.fillStyle = me.cubeColorMap[me.availableCube];
			c2.fillText(me.availableCube, x - (Xia.hex.canvasHexWidth / 3) - 2 + c2.measureText("11-20 = ").width, y + (Xia.hex.canvasHexHeight / 4));
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