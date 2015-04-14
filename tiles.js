Xia.tile = {};
Xia.tile.allTiles = [];

Xia.rotateAroundOrigin = function(x, y, steps){
	xp = (x * Math.cos(Math.PI * steps / 3)) - (y * Math.sin(Math.PI * steps / 3));
	yp = (x * Math.sin(Math.PI * steps / 3)) + (y * Math.cos(Math.PI * steps / 3));
	return {
		x: xp,
		y: yp
	};
};

Xia.Tile = new JS.Class({
	
	//tile x and y coordinates
	x: null,
	y: null,
	//hex x and y coordinates of the center hex of this tile
	hexX: null,
	hexY: null,
	hexConfigs: null,
	hexes: null,
	hexesByTileLocation: null,
	symbolConfig: null,
	symbolConfigHexMap: {
		"tr":"t",
		"r":"tr",
		"br":"br",
		"bl":"b",
		"l":"bl",
		"tl":"tl"
	},
	symbolConfigHexRotations: {
		"t":0,
		"tr":1,
		"br":2,
		"b":3,
		"bl":4,
		"tl":5
	},
	
	initialize: function(config){
		
		var me = this;
		me.x = config.x;
		me.y = config.y;
		//need to figure out how to handle translating from tile xy to hex xy, tile is more tricky because flat
		//part is not on top like with the hex  
		me.hexX = (config.x * 5) + (me.y * -2);
		me.hexY = ((config.x + (Math.abs(config.x) % 2 == 1 ? 1 : 0)) / -2) + (config.y * 4);
		me.hexes = [];
		me.hexesByTileLocation = {};
		me.createSymbolConfig();
		var newHexConfigs = me.getRotatedHexConfigs(config.rotations);//also creates a copy of the hex configs so we dont' mess up the original configuration
		for(var i = 0; i < newHexConfigs.length; i++)
		{
			var hexConfig = newHexConfigs[i];
			var tileHexX = hexConfig.x;
			var tileHexY = hexConfig.y;
			hexConfig.y = me.hexY + hexConfig.y + (Math.abs(me.hexX) % 2 == 1 && Math.abs(hexConfig.x) % 2 == 1 ? 1 : 0);
			hexConfig.x = me.hexX + hexConfig.x;
			var newHex = new Xia.Hex(hexConfig);
			me.hexes.push(newHex);
			me.hexesByTileLocation[tileHexX + "_" + tileHexY] = newHex;
		}
		
		Xia.tile.allTiles.push(me);
		
	},
	
	createSymbolConfig: function(){
		this.symbolConfig = {
			tr: {
				symbolType: 1,
				hexLocation: {
					x: 1,
					y: -2
				}
			},
			r: {
				symbolType: 2,
				hexLocation: {
					x: 2,
					y: 0
				}
			},
			br: {
				symbolType: 3,
				hexLocation: {
					x: 1,
					y: 1
				}
			},
			bl: {
				symbolType: 4,
				hexLocation: {
					x: -1,
					y: 1
				}
			},
			l: {
				symbolType: 5,
				hexLocation: {
					x: -2,
					y: 0
				}
			},
			tl: {
				symbolType: 6,
				hexLocation: {
					x: -1,
					y: -2
				}
			}
		}
	},
	
	getHexByTileLocation: function(x, y){
		return this.hexesByTileLocation[x + "_" + y];
	},
	
	getRotatedHexConfigs: function(rotations){
		var me = this;
		var newHexConfigs = [];
		for(var i = 0; i < me.hexConfigs.length; i++)
			newHexConfigs.push(Xia.cloneObject(me.hexConfigs[i]));
		if(!rotations)
			return newHexConfigs;
		
		for(var i = 0; i < rotations; i ++)
		{
			//rotate all the hexes about the origin of the tile
			for(var j = 0; j < newHexConfigs.length; j++)
			{
				//formula for clockwise rotation of each hex here
				var hexConfig = newHexConfigs[j];
				if(hexConfig.y == -1 && (hexConfig.x >= -1 && hexConfig.x <= 0))
					hexConfig.x += 1;
				else if(hexConfig.x == 1 && hexConfig.y == -1)
					hexConfig.y = 0;
				else if(hexConfig.x == 1 && hexConfig.y == 0)
				{
					hexConfig.x = 0;
					hexConfig.y = 1;
				}
				else if(hexConfig.x == 0 && hexConfig.y == 1)
				{
					hexConfig.x = -1;
					hexConfig.y = 0;
				}
				else if(hexConfig.x == -1 && hexConfig.y == 0)
				{
					hexConfig.x = -1;
					hexConfig.y = -1;
				}
				else if(hexConfig.x == 0 && hexConfig.y == -2)
				{
					hexConfig.x = 2;
					hexConfig.y = -1;
				}
				else if(hexConfig.x == 1 && hexConfig.y == -2)
				{
					hexConfig.x = 2;
					hexConfig.y = 0;
				}
				else if(hexConfig.x == 2 && hexConfig.y == -1)
				{
					hexConfig.x = 2;
					hexConfig.y = 1;
				}
				else if(hexConfig.x == 2 && hexConfig.y == 0)
				{
					hexConfig.x = 1;
					hexConfig.y = 1;
				}
				else if(hexConfig.x == 2 && hexConfig.y == 1)
				{
					hexConfig.x = 0;
					hexConfig.y = 2;
				}
				else if(hexConfig.x == 1 && hexConfig.y == 1)
				{
					hexConfig.x = -1;
					hexConfig.y = 1;
				}
				else if(hexConfig.x == 0 && hexConfig.y == 2)
				{
					hexConfig.x = -2;
					hexConfig.y = 1;
				}
				else if(hexConfig.x == -1 && hexConfig.y == 1)
				{
					hexConfig.x = -2;
					hexConfig.y = 0;
				}
				else if(hexConfig.x == -2 && hexConfig.y == 1)
				{
					hexConfig.x = -2;
					hexConfig.y = -1;
				}
				else if(hexConfig.x == -2 && hexConfig.y == 0)
				{
					hexConfig.x = -1;
					hexConfig.y = -2;
				}
				else if(hexConfig.x == -2 && hexConfig.y == -1)
				{
					hexConfig.x = 0;
					hexConfig.y = -2;
				}
				else if(hexConfig.x == -1 && hexConfig.y == -2)
				{
					hexConfig.x = 1;
					hexConfig.y = -2;
				}
				else
				{
					if(!(hexConfig.x == 0 && hexConfig.y == 0))
						throw "hex missed";
				}

			}
			//shift the connection symbol array
			var symbolConfig = me.symbolConfig;
			for(var key in symbolConfig)
			{
				if (symbolConfig.hasOwnProperty(key)) {
					symbolConfig[key].symbolType = symbolConfig[key].symbolType - 1;
					if(symbolConfig[key].symbolType < 1)
						symbolConfig[key].symbolType = 6;
				}
			}
		}
		
		return newHexConfigs;
	},
	
	render: function(){
		
		var me = this;
		
		//render backgroung things such as the planets and sun
		
		for(var i = 0; i < me.hexes.length; i++)
			me.hexes[i].render();
		
		//this is going to render some tile based attributes, such as connection symbols and the tile's name
		me.renderConnectionSymbols();
	},
	
	renderConnectionSymbols: function(){
		var me = this;
		
		var symbolConfig = me.symbolConfig;
		for(var key in symbolConfig)
		{
			if (symbolConfig.hasOwnProperty(key)) {
				var symbolConfigItem = symbolConfig[key];
				var renderFunction = me.symbolRenderFunctionHash[symbolConfigItem.symbolType];
				var hex = me.getHexByTileLocation(symbolConfigItem.hexLocation.x, symbolConfigItem.hexLocation.y);
				var centerCoordinates = hex.getHexCenterCoordinates();
				var symbolHexLocation = me.symbolConfigHexMap[key];
				var symbolOffset = me.getSymbolOffset(symbolHexLocation);
				var x = centerCoordinates.x + symbolOffset.x;
				var y = centerCoordinates.y + symbolOffset.y;
				renderFunction(x, y, me.symbolConfigHexRotations[symbolHexLocation]);
				
			}
		}
	},
	
	symbolRenderFunctionHash: {
		"1" : function(x, y, rotations){
			var c2 = Xia.canvas.c2;
			c2.beginPath();
			c2.moveTo(x, y);
			var deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.strokeStyle = "#FFFF00";
			c2.closePath();
			c2.stroke();
		},
		"2" : function(x, y, rotations){
			var c2 = Xia.canvas.c2;
			c2.beginPath();
			c2.moveTo(x, y);
			var deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.strokeStyle = "#FFFF00";
			deltas = Xia.rotateAroundOrigin((Xia.hex.canvasHexHeight / 15), (Xia.hex.canvasHexHeight / 6), rotations);
			c2.moveTo(x + deltas.x, y + deltas.y);
			deltas = Xia.rotateAroundOrigin(-(Xia.hex.canvasHexHeight / 15), (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.closePath();
			c2.stroke();
		},
		"3" : function(x, y, rotations){
			var c2 = Xia.canvas.c2;
			c2.beginPath();
			c2.moveTo(x, y);
			var deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.strokeStyle = "#FFFF00";
			deltas = Xia.rotateAroundOrigin((Xia.hex.canvasHexHeight / 20), (Xia.hex.canvasHexHeight / 6), rotations);
			c2.moveTo(x + deltas.x, y + deltas.y);
			deltas = Xia.rotateAroundOrigin(-(Xia.hex.canvasHexHeight / 20), (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			deltas = Xia.rotateAroundOrigin(-(Xia.hex.canvasHexHeight / 20), (Xia.hex.canvasHexHeight / 4), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			deltas = Xia.rotateAroundOrigin((Xia.hex.canvasHexHeight / 20), (Xia.hex.canvasHexHeight / 4), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.closePath();
			c2.stroke();
		},
		"4" : function(x, y, rotations){
			var c2 = Xia.canvas.c2;
			c2.beginPath();
			c2.moveTo(x, y);
			var deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.strokeStyle = "#FFFF00";
			c2.closePath();
			c2.stroke();
			c2.beginPath();
			deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6) + (Xia.hex.canvasHexHeight / 20), rotations);
			c2.arc(x + deltas.x,y + deltas.y, (Xia.hex.canvasHexHeight / 20),0*Math.PI,2*Math.PI);
			c2.stroke();
		},
		"5" : function(){},
		"6" : function(){}
	},
	
	getSymbolOffset: function(location){
		var deltaX = (3/8) * Xia.hex.canvasHexWidth;
		var deltaY = (1/4) * Xia.hex.canvasHexHeight;
		//handle t and b
		if(location == "t" || location == "b")
		{
			return {
				x: 0,
				y: (location == "t" ? -1 : 1) * (Xia.hex.canvasHexHeight / 2)
			}
		}
		//handle tl, bl, tr, and br
		return {
			x: (location.indexOf("l") != -1 ? -1 : 1) * deltaX,
			y: (location.indexOf("t") != -1 ? -1 : 1) * deltaY
		}
	}
	
	
	
});

Xia.Outpost338 = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0
		},
		{
			x:0,
			y:-1,
			type: "ASTEROID"
		},
		{
			x:1,
			y:-1
		},
		{
			x:1,
			y:0,
			type: "ASTEROID"
		},
		{
			x:0,
			y:1,
			specialType: "MISSION"
		},
		{
			x:-1,
			y:0,
			type: "ASTEROID"
		},
		{
			x:-1,
			y:-1,
			specialType: "MINING",
			miningCube: "S"
		},
		{
			x:0,
			y:-2
		},
		{
			x:1,
			y:-2
		},
		{
			x:2,
			y:-1,
			type: "ASTEROID",
			specialType: "EXPLORE"
		},
		{
			x:2,
			y:0,
			type: "ASTEROID"
		},
		{
			x:2,
			y:1,
			specialType: "SPAWN",
			spawnNumber: 8
		},
		{
			x:1,
			y:1
		},
		{
			x:0,
			y:2,
			type: "ASTEROID"
		},
		{
			x:-1,
			y:1,
			type: "ASTEROID"
		},
		{
			x:-2,
			y:1
		},
		{
			x:-2,
			y:0
		},
		{
			x:-2,
			y:-1,
			type: "ASTEROID"
		},
		{
			x:-1,
			y:-2,
			type: "ASTEROID"
		}
	]
	
});

Xia.RedGulch = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			specialType: "MINING",
			miningCube: "T"
		},
		{
			x:0,
			y:-1
		},
		{
			x:1,
			y:-1,
			type: "ASTEROID"
		},
		{
			x:1,
			y:0,
			type: "ASTEROID"
		},
		{
			x:0,
			y:1,
			type: "ASTEROID"
		},
		{
			x:-1,
			y:0,
			type: "ASTEROID"
		},
		{
			x:-1,
			y:-1,
			type: "ASTEROID"
		},
		{
			x:0,
			y:-2,
			type: "ASTEROID",
			specialType: "EXPLORE"
		},
		{
			x:1,
			y:-2
		},
		{
			x:2,
			y:-1
		},
		{
			x:2,
			y:0
		},
		{
			x:2,
			y:1,
			specialType: "MISSION"
		},
		{
			x:1,
			y:1
		},
		{
			x:0,
			y:2,
			type: "ASTEROID"
		},
		{
			x:-1,
			y:1
		},
		{
			x:-2,
			y:1
		},
		{
			x:-2,
			y:0
		},
		{
			x:-2,
			y:-1,
			specialType: "SPAWN",
			spawnNumber: 9
		},
		{
			x:-1,
			y:-2
		}
	]
	
});