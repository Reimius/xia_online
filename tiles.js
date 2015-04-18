Xia.tile = {};
Xia.tile.activeTiles = [];
Xia.tile.availableTiles = null;

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
	tileDirectionOpposites: {
		"tr":"bl",
		"r":"l",
		"br":"tl",
		"bl":"tr",
		"l":"r",
		"tl":"br"
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
		var newHexConfigs = me.getRotatedHexConfigs(config.rotationConfig);//also creates a copy of the hex configs so we dont' mess up the original configuration
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
		
		Xia.tile.activeTiles.push(me);
		
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
	
	getRotatedHexConfigs: function(rotationConfig){
		var me = this;
		var newHexConfigs = [];
		for(var i = 0; i < me.hexConfigs.length; i++)
			newHexConfigs.push(Xia.cloneObject(me.hexConfigs[i]));
		if(!rotationConfig)
			return newHexConfigs;
		
		var symbolConfig = me.symbolConfig;
		
		var tilePlacementDirection = rotationConfig.tilePlacementDirection;
		var tilePlacementDirectionSymbolType = rotationConfig.symbolType;
		
		while(symbolConfig[tilePlacementDirection].symbolType != tilePlacementDirectionSymbolType)
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
				
				//need to rotate border config object in hexes that have it
				if(hexConfig.borderConfig)
				{
					var borderConfig = hexConfig.borderConfig;
					var tr = borderConfig.t,
						br = borderConfig.tr,
						b = borderConfig.br,
						bl = borderConfig.b,
						tl = borderConfig.bl,
						t = borderConfig.tl;
					hexConfig.borderConfig = {
						tr: tr,
						br: br,
						b:  b,
						bl: bl,
						tl: tl,
						t:  t
					};
				}

			}
			//shift the connection symbol array
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
			c2.lineWidth = 2;
			c2.beginPath();
			c2.moveTo(x, y);
			var deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.strokeStyle = "#999999";
			c2.closePath();
			c2.stroke();
		},
		"2" : function(x, y, rotations){
			var c2 = Xia.canvas.c2;
			c2.lineWidth = 2;
			c2.beginPath();
			c2.moveTo(x, y);
			var deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.strokeStyle = "#999999";
			deltas = Xia.rotateAroundOrigin((Xia.hex.canvasHexHeight / 15), (Xia.hex.canvasHexHeight / 6), rotations);
			c2.moveTo(x + deltas.x, y + deltas.y);
			deltas = Xia.rotateAroundOrigin(-(Xia.hex.canvasHexHeight / 15), (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.closePath();
			c2.stroke();
		},
		"3" : function(x, y, rotations){
			var c2 = Xia.canvas.c2;
			c2.lineWidth = 2;
			c2.beginPath();
			c2.moveTo(x, y);
			var deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.strokeStyle = "#999999";
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
			c2.lineWidth = 2;
			c2.beginPath();
			c2.moveTo(x, y);
			var deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.strokeStyle = "#999999";
			c2.closePath();
			c2.stroke();
			c2.beginPath();
			deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6) + (Xia.hex.canvasHexHeight / 20), rotations);
			c2.arc(x + deltas.x,y + deltas.y, (Xia.hex.canvasHexHeight / 20),0*Math.PI,2*Math.PI);
			c2.stroke();
		},
		"5" : function(x, y, rotations){
			var c2 = Xia.canvas.c2;
			c2.lineWidth = 2;
			c2.beginPath();
			c2.moveTo(x, y);
			var deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.strokeStyle = "#999999";
			deltas = Xia.rotateAroundOrigin((Xia.hex.canvasHexHeight / 20), (Xia.hex.canvasHexHeight / 6), rotations);
			c2.moveTo(x + deltas.x, y + deltas.y);
			deltas = Xia.rotateAroundOrigin(-(Xia.hex.canvasHexHeight / 20), (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 4), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.closePath();
			c2.stroke();
		},
		"6" : function(x, y, rotations){
			var c2 = Xia.canvas.c2;
			c2.lineWidth = 2;
			c2.beginPath();
			c2.moveTo(x, y);
			var deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6), rotations);
			c2.lineTo(x + deltas.x, y + deltas.y);
			c2.strokeStyle = "#999999";
			c2.closePath();
			c2.stroke();
			c2.beginPath();
			deltas = Xia.rotateAroundOrigin(0, (Xia.hex.canvasHexHeight / 6) + (Xia.hex.canvasHexHeight / 20), rotations);
			c2.arc(x + deltas.x,y + deltas.y, (Xia.hex.canvasHexHeight / 20), ((6 + (2 * rotations))/6) * Math.PI, ((12 + (2 * rotations))/ 6) * Math.PI);
			c2.stroke();
		}
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
	},
	
	placeConnectedTile: function(x, y){
		
		var me = this,
			currentX = me.x,
			currentY = me.y,
			tileDirectionOpposites = me.tileDirectionOpposites;
			
		deltaX = x - currentX;
		deltaY = y - currentY;
		var placementDirection = null;
		if(deltaX == 1)
		{
			if(deltaY == 0)
				placementDirection = "r";
			else if(deltaY = 1)
				placementDirection = "br";
		}
		else if(deltaX = 0)
		{
			if(deltaY = 1)
				placementDirection = "bl";
			else if(deltaY = -1)
				placementDirection = "tr";
		}
		else if(deltaX = -1)
		{
			if(deltaY = 0)
				placementDirection = "l";
			else if(deltaY = -1)
				placementDirection = "tl";
		}
		if(!placementDirection)
			throw "The new tile cannot be placed from the current tile";
		
		var thisTileSymbolType = me.symbolConfig[placementDirection].symbolType;
		
		var newTilePlacementDirection = tileDirectionOpposites[placementDirection];
		
		var tileClass = Xia.tile.availableTiles.pop();
		
		return new tileClass({
			x: x,
			y: y,
			rotationConfig: {
				tilePlacementDirection: newTilePlacementDirection,
				symbolType: thisTileSymbolType
			}
		});
		
	}
	
});

//returns the new tile class instance
Xia.tile.placeTileNextToExisting = function(existingTile, x, y){
	
};

Xia.tile.Outpost338 = new JS.Class(Xia.Tile, {
	
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
			availableCube: "S"
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

Xia.tile.RedGulch = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			specialType: "MINING",
			availableCube: "T"
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

Xia.tile.Tk421 = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			specialType: "MISSION"
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
			type: "ASTEROID"
		},
		{
			x:-1,
			y:0,
			type: "ASTEROID"
		},
		{
			x:-1,
			y:-1
		},
		{
			x:0,
			y:-2
		},
		{
			x:1,
			y:-2,
			type: "ASTEROID"
		},
		{
			x:2,
			y:-1,
			type: "ASTEROID"
		},
		{
			x:2,
			y:0
		},
		{
			x:2,
			y:1
		},
		{
			x:1,
			y:1
		},
		{
			x:0,
			y:2
		},
		{
			x:-1,
			y:1,
			specialType: "SPAWN",
			spawnNumber: 7
		},
		{
			x:-2,
			y:1
		},
		{
			x:-2,
			y:0,
			type: "ASTEROID",
			specialType: "EXPLORE"
		},
		{
			x:-2,
			y:-1
		},
		{
			x:-1,
			y:-2
		}
	]
	
});

Xia.tile.BurningHorse = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "NEBULA",
			borderConfig: {
				bl: true
			}
		},
		{
			x:0,
			y:-1,
			type: "NEBULA"
		},
		{
			x:1,
			y:-1,
			type: "NEBULA",
			specialType: "HARVEST",
			availableCube: "H"
		},
		{
			x:1,
			y:0,
			type: "NEBULA"
		},
		{
			x:0,
			y:1,
			type: "NEBULA",
			borderConfig: {
				b: true,
				tl: true
			}
		},
		{
			x:-1,
			y:0
		},
		{
			x:-1,
			y:-1,
			type: "NEBULA",
			borderConfig: {
				b: true,
				bl: true,
				tl: true
			}
		},
		{
			x:0,
			y:-2,
			type: "NEBULA",
			borderConfig: {
				tl: true,
				t: true,
				tr: true
			}
		},
		{
			x:1,
			y:-2,
			type: "NEBULA",
			borderConfig: {
				t: true,
				tr: true
			}
		},
		{
			x:2,
			y:-1,
			specialType: "MISSION",
			type: "NEBULA",
			borderConfig: {
				t: true,
				tr: true,
				br: true
			}
		},
		{
			x:2,
			y:0,
			type: "NEBULA",
			borderConfig: {
				tr: true,
				br: true
			}
		},
		{
			x:2,
			y:1,
			type: "NEBULA",
			borderConfig: {
				tr: true,
				br: true,
				b: true
			}
		},
		{
			x:1,
			y:1,
			type: "NEBULA",
			specialType: "EXPLORE",
			borderConfig: {
				br: true,
				b: true,
				bl: true
			}
		},
		{
			x:0,
			y:2
		},
		{
			x:-1,
			y:1,
			type: "NEBULA",
			borderConfig: {
				br: true,
				b: true,
				bl: true,
				tl: true,
				t: true
			}
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
			spawnNumber: 13
		},
		{
			x:-1,
			y:-2,
			type: "NEBULA",
			borderConfig: {
				bl: true,
				tl: true,
				t: true
			}
		}
	]
	
});

Xia.tile.LowerStratus = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "NEBULA",
			specialType: "HARVEST",
			availableCube: "P"
		},
		{
			x:0,
			y:-1,
			type: "NEBULA"
		},
		{
			x:1,
			y:-1,
			type: "NEBULA",
			borderConfig: {
				br: true,
				tr: true
			}
		},
		{
			x:1,
			y:0,
			type: "NEBULA",
			borderConfig: {
				br: true,
				tr: true,
				b: true
			}
		},
		{
			x:0,
			y:1,
			type: "NEBULA",
			borderConfig: {
				b: true,
				br: true
			}
		},
		{
			x:-1,
			y:0,
			type: "NEBULA",
			specialType: "EXPLORE"
		},
		{
			x:-1,
			y:-1,
			type: "NEBULA"
		},
		{
			x:0,
			y:-2,
			type: "NEBULA",
			borderConfig: {
				tl: true,
				t: true,
				tr: true
			}
		},
		{
			x:1,
			y:-2,
			type: "NEBULA",
			borderConfig: {
				t: true,
				tr: true,
				br: true
			}
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
			specialType: "SPAWN",
			spawnNumber: 14
		},
		{
			x:1,
			y:1
		},
		{
			x:0,
			y:2
		},
		{
			x:-1,
			y:1,
			type: "NEBULA",
			borderConfig: {
				br: true,
				b: true,
				bl: true
			}
		},
		{
			x:-2,
			y:1,
			type: "NEBULA",
			borderConfig: {
				b: true,
				bl: true,
				tl: true
			}
		},
		{
			x:-2,
			y:0,
			type: "NEBULA",
			borderConfig: {
				bl: true,
				tl: true
			}
		},
		{
			x:-2,
			y:-1,
			type: "NEBULA",
			specialType: "MISSION",
			borderConfig: {
				t: true,
				bl: true,
				tl: true
			}
		},
		{
			x:-1,
			y:-2,
			type: "NEBULA",
			borderConfig: {
				tl: true,
				t: true
			}
		}
	]
	
});

Xia.tile.Vortex86 = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "NEBULA",
			specialType: "MISSION"
		},
		{
			x:0,
			y:-1,
			type: "NEBULA",
			borderConfig: {
				t: true,
				tr: true
			}
		},
		{
			x:1,
			y:-1,
			type: "NEBULA",
			borderConfig: {
				t: true,
				tr: true
			}
		},
		{
			x:1,
			y:0,
			type: "NEBULA",
			borderConfig: {
				br: true,
				b: true
			}
		},
		{
			x:0,
			y:1,
			type: "NEBULA",
			borderConfig: {
				b: true,
				br: true
			}
		},
		{
			x:-1,
			y:0,
			type: "NEBULA",
			borderConfig: {
				bl: true,
				tl: true
			}
		},
		{
			x:-1,
			y:-1,
			type: "NEBULA",
			borderConfig: {
				bl: true,
				tl: true
			}
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
			specialType: "SPAWN",
			spawnNumber: 12
		},
		{
			x:2,
			y:0,
			type: "NEBULA",
			specialType: "EXPLORE",
			borderConfig: {
				b: true,
				br: true,
				tr: true,
				t: true
			}
		},
		{
			x:2,
			y:1
		},
		{
			x:1,
			y:1
		},
		{
			x:0,
			y:2
		},
		{
			x:-1,
			y:1,
			type: "NEBULA",
			borderConfig: {
				br: true,
				b: true,
				bl: true,
				tl: true
			}
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
			y:-1
		},
		{
			x:-1,
			y:-2,
			type: "NEBULA",
			borderConfig: {
				tl: true,
				t: true,
				bl: true,
				tr: true
			}
		}
	]
	
});

Xia.tile.Xia = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "STAR"
		},
		{
			x:0,
			y:-1,
			type: "STAR"
		},
		{
			x:1,
			y:-1,
			type: "STAR"
		},
		{
			x:1,
			y:0,
			type: "STAR"
		},
		{
			x:0,
			y:1,
			type: "STAR"
		},
		{
			x:-1,
			y:0,
			type: "STAR"
		},
		{
			x:-1,
			y:-1,
			type: "STAR"
		},
		{
			x:0,
			y:-2,
			type: "STAR",
			borderConfig: {
				tr: true,
				t: true,
				tl: true
			}
		},
		{
			x:1,
			y:-2,
			type: "STAR",
			borderConfig: {
				tr: true,
				t: true
			}
		},
		{
			x:2,
			y:-1,
			type: "STAR",
			borderConfig: {
				tr: true,
				t: true,
				br: true
			}
		},
		{
			x:2,
			y:0,
			type: "STAR",
			borderConfig: {
				tr: true,
				br: true
			}
		},
		{
			x:2,
			y:1,
			type: "STAR",
			borderConfig: {
				tr: true,
				b: true,
				br: true
			}
		},
		{
			x:1,
			y:1,
			type: "STAR",
			borderConfig: {
				br: true,
				b: true
			}
		},
		{
			x:0,
			y:2,
			type: "STAR",
			borderConfig: {
				br: true,
				b: true,
				bl: true
			}
		},
		{
			x:-1,
			y:1,
			type: "STAR",
			borderConfig: {
				b: true,
				bl: true
			}
		},
		{
			x:-2,
			y:1,
			type: "STAR",
			borderConfig: {
				bl: true,
				b: true,
				tl: true
			}
		},
		{
			x:-2,
			y:0,
			type: "STAR",
			borderConfig: {
				bl: true,
				tl: true
			}
		},
		{
			x:-2,
			y:-1,
			type: "STAR",
			borderConfig: {
				t: true,
				tl: true,
				bl: true
			}
		},
		{
			x:-1,
			y:-2,
			type: "STAR",
			borderConfig: {
				tl: true,
				t: true
			}
		}
	]
	
});

Xia.tile.LostSector = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0
		},
		{
			x:0,
			y:-1
		},
		{
			x:1,
			y:-1
		},
		{
			x:1,
			y:0
		},
		{
			x:0,
			y:1
		},
		{
			x:-1,
			y:0
		},
		{
			x:-1,
			y:-1
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
			y:-1
		},
		{
			x:2,
			y:0
		},
		{
			x:2,
			y:1
		},
		{
			x:1,
			y:1
		},
		{
			x:0,
			y:2
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
			y:-1
		},
		{
			x:-1,
			y:-2
		}
	]
});

Xia.tile.KrellerIV = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			specialType: "SALVAGE",
			availableCube: "C"
		},
		{
			x:0,
			y:-1,
			type: "DEBRIS"
		},
		{
			x:1,
			y:-1,
			type: "DEBRIS"
		},
		{
			x:1,
			y:0
		},
		{
			x:0,
			y:1
		},
		{
			x:-1,
			y:0,
			specialType: "MISSION"
		},
		{
			x:-1,
			y:-1,
			type: "DEBRIS"
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
			type: "DEBRIS"
		},
		{
			x:2,
			y:0
		},
		{
			x:2,
			y:1,
			type: "DEBRIS",
			specialType: "EXPLORE"
		},
		{
			x:1,
			y:1,
			type: "DEBRIS"
		},
		{
			x:0,
			y:2,
			specialType: "SPAWN",
			spawnNumber: 17
		},
		{
			x:-1,
			y:1,
			type: "DEBRIS"
		},
		{
			x:-2,
			y:1,
			type: "DEBRIS"
		},
		{
			x:-2,
			y:0
		},
		{
			x:-2,
			y:-1
		},
		{
			x:-1,
			y:-2
		}
	]
	
});

Xia.tile.Pelmont = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0
		},
		{
			x:0,
			y:-1,
			type: "DEBRIS"
		},
		{
			x:1,
			y:-1,
			specialType: "SALVAGE",
			availableCube: "C"
		},
		{
			x:1,
			y:0,
			type: "DEBRIS"
		},
		{
			x:0,
			y:1,
			specialType: "MISSION"
		},
		{
			x:-1,
			y:0,
			type: "DEBRIS"
		},
		{
			x:-1,
			y:-1,
			specialType: "SPAWN",
			spawnNumber: 15
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
			type: "DEBRIS"
		},
		{
			x:2,
			y:0
		},
		{
			x:2,
			y:1,
			type: "DEBRIS"
		},
		{
			x:1,
			y:1,
			type: "DEBRIS"
		},
		{
			x:0,
			y:2
		},
		{
			x:-1,
			y:1,
			type: "DEBRIS",
			specialType: "EXPLORE"
		},
		{
			x:-2,
			y:1,
			type: "DEBRIS"
		},
		{
			x:-2,
			y:0
		},
		{
			x:-2,
			y:-1,
			type: "DEBRIS"
		},
		{
			x:-1,
			y:-2,
			type: "DEBRIS"
		}
	]
	
});

Xia.tile.TheKeep = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "DEBRIS"
		},
		{
			x:0,
			y:-1
		},
		{
			x:1,
			y:-1,
			type: "DEBRIS",
			specialType: "EXPLORE"
		},
		{
			x:1,
			y:0,
			specialType: "SPAWN",
			spawnNumber: 16
		},
		{
			x:0,
			y:1
		},
		{
			x:-1,
			y:0,
			type: "DEBRIS"
		},
		{
			x:-1,
			y:-1,
			specialType: "MISSION"
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
			type: "DEBRIS"
		},
		{
			x:2,
			y:0,
			type: "DEBRIS"
		},
		{
			x:2,
			y:1
		},
		{
			x:1,
			y:1,
			type: "DEBRIS"
		},
		{
			x:0,
			y:2,
			type: "DEBRIS"
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
			type: "DEBRIS"
		},
		{
			x:-1,
			y:-2,
			type: "DEBRIS"
		}
	]
	
});

Xia.tile.NeoDamascus = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "PLANET",
			alignment: "NEUTRAL"
		},
		{
			x:0,
			y:-1,
			type: "PLANET",
			alignment: "NEUTRAL",
			specialType: "MISSION",
			borderConfig: {
				tr: true,
				t: true,
				tl: true
			}
		},
		{
			x:1,
			y:-1,
			type: "PLANET",
			alignment: "NEUTRAL",
			borderConfig: {
				tr: true,
				t: true,
				br: true
			}
		},
		{
			x:1,
			y:0,
			type: "PLANET",
			alignment: "NEUTRAL",
			specialType: "SELL",
			availableCube: "S",
			borderConfig: {
				tr: true,
				b: true,
				br: true
			}
		},
		{
			x:0,
			y:1,
			type: "PLANET",
			alignment: "NEUTRAL",
			borderConfig: {
				br: true,
				b: true,
				bl: true
			}
		},
		{
			x:-1,
			y:0,
			type: "PLANET",
			alignment: "NEUTRAL",
			specialType: "BUY",
			availableCube: "P",
			borderConfig: {
				b: true,
				bl: true,
				tl: true
			}
		},
		{
			x:-1,
			y:-1,
			type: "PLANET",
			alignment: "NEUTRAL",
			borderConfig: {
				bl: true,
				t: true
			}
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
			y:-1
		},
		{
			x:2,
			y:0
		},
		{
			x:2,
			y:1,
			specialType: "EXPLORE"
		},
		{
			x:1,
			y:1
		},
		{
			x:0,
			y:2
		},
		{
			x:-1,
			y:1
		},
		{
			x:-2,
			y:1,
			specialType: "SPAWN",
			spawnNumber: 1
		},
		{
			x:-2,
			y:0
		},
		{
			x:-2,
			y:-1
		},
		{
			x:-1,
			y:-2
		}
	]
	
});

Xia.tile.DoravinV = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "PLANET",
			alignment: "NEUTRAL"
		},
		{
			x:0,
			y:-1,
			type: "PLANET",
			alignment: "NEUTRAL",
			specialType: "BUY",
			availableCube: "T",
			borderConfig: {
				tr: true,
				t: true,
				tl: true
			}
		},
		{
			x:1,
			y:-1,
			type: "PLANET",
			alignment: "NEUTRAL",
			specialType: "MISSION",
			borderConfig: {
				tr: true,
				t: true,
				br: true
			}
		},
		{
			x:1,
			y:0,
			type: "PLANET",
			alignment: "NEUTRAL",
			specialType: "SELL",
			availableCube: "C",
			borderConfig: {
				tr: true,
				b: true,
				br: true
			}
		},
		{
			x:0,
			y:1,
			type: "PLANET",
			alignment: "NEUTRAL",
			borderConfig: {
				br: true,
				b: true,
				bl: true
			}
		},
		{
			x:-1,
			y:0,
			type: "PLANET",
			alignment: "NEUTRAL",
			borderConfig: {
				b: true,
				bl: true,
				tl: true
			}
		},
		{
			x:-1,
			y:-1,
			type: "PLANET",
			alignment: "NEUTRAL",
			borderConfig: {
				bl: true,
				t: true
			}
		},
		{
			x:0,
			y:-2
		},
		{
			x:1,
			y:-2,
			specialType: "SPAWN",
			spawnNumber: 4
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
			specialType: "EXPLORE"
		},
		{
			x:1,
			y:1
		},
		{
			x:0,
			y:2
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
			y:-1
		},
		{
			x:-1,
			y:-2
		}
	]
	
});

Xia.tile.Azure = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "PLANET",
			alignment: "NEUTRAL"
		},
		{
			x:0,
			y:-1,
			type: "PLANET",
			alignment: "NEUTRAL",
			borderConfig: {
				tr: true,
				t: true
			}
		},
		{
			x:1,
			y:-1,
			type: "PLANET",
			alignment: "NEUTRAL",
			borderConfig: {
				t: true,
				br: true
			}
		},
		{
			x:1,
			y:0,
			type: "PLANET",
			alignment: "NEUTRAL",
			borderConfig: {
				tr: true,
				b: true,
				br: true
			}
		},
		{
			x:0,
			y:1,
			type: "PLANET",
			alignment: "NEUTRAL",
			specialType: "SELL",
			availableCube: "T",
			borderConfig: {
				br: true,
				b: true
			}
		},
		{
			x:-1,
			y:0,
			type: "PLANET",
			alignment: "NEUTRAL"
		},
		{
			x:-1,
			y:-1,
			type: "PLANET",
			alignment: "NEUTRAL",
			specialType: "BUY",
			availableCube: "H"
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
			y:-1
		},
		{
			x:2,
			y:0
		},
		{
			x:2,
			y:1
		},
		{
			x:1,
			y:1,
			specialType: "SPAWN",
			spawnNumber: 3
		},
		{
			x:0,
			y:2
		},
		{
			x:-1,
			y:1,
			type: "PLANET",
			alignment: "NEUTRAL",
			borderConfig: {
				br: true,
				b: true,
				bl: true
			}
		},
		{
			x:-2,
			y:1,
			type: "PLANET",
			alignment: "NEUTRAL",
			specialType: "EXPLORE",
			borderConfig: {
				tl: true,
				b: true,
				bl: true
			}
		},
		{
			x:-2,
			y:0,
			type: "PLANET",
			alignment: "NEUTRAL",
			borderConfig: {
				tl: true,
				bl: true
			}
		},
		{
			x:-2,
			y:-1,
			type: "PLANET",
			alignment: "NEUTRAL",
			specialType: "MISSION",
			borderConfig: {
				tl: true,
				bl: true,
				t: true
			}
		},
		{
			x:-1,
			y:-2,
			type: "PLANET",
			alignment: "NEUTRAL",
			borderConfig: {
				tl: true,
				t: true,
				tr: true
			}
		}
	]
	
});

Xia.tile.Lunari = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "PLANET",
			alignment: "LAWFUL"
		},
		{
			x:0,
			y:-1,
			type: "PLANET",
			alignment: "LAWFUL",
			specialType: "BUY",
			availableCube: "C",
			borderConfig: {
				tr: true,
				t: true
			}
		},
		{
			x:1,
			y:-1,
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				t: true,
				br: true
			}
		},
		{
			x:1,
			y:0,
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				tr: true,
				b: true,
				br: true
			}
		},
		{
			x:0,
			y:1,
			type: "PLANET",
			alignment: "LAWFUL",
			specialType: "MISSION",
			borderConfig: {
				br: true,
				b: true
			}
		},
		{
			x:-1,
			y:0,
			type: "PLANET",
			alignment: "LAWFUL",
			specialType: "SELL",
			availableCube: "P"
		},
		{
			x:-1,
			y:-1,
			type: "PLANET",
			alignment: "LAWFUL"
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
			y:-1
		},
		{
			x:2,
			y:0
		},
		{
			x:2,
			y:1,
			specialType: "SPAWN",
			spawnNumber: 6
		},
		{
			x:1,
			y:1
		},
		{
			x:0,
			y:2
		},
		{
			x:-1,
			y:1,
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				br: true,
				b: true,
				bl: true
			}
		},
		{
			x:-2,
			y:1,
			type: "PLANET",
			alignment: "LAWFUL",
			specialType: "EXPLORE",
			borderConfig: {
				tl: true,
				b: true,
				bl: true
			}
		},
		{
			x:-2,
			y:0,
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				tl: true,
				bl: true
			}
		},
		{
			x:-2,
			y:-1,
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				tl: true,
				bl: true,
				t: true
			}
		},
		{
			x:-1,
			y:-2,
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				tl: true,
				t: true,
				tr: true
			}
		}
	]
	
});


Xia.tile.SmugglersDen = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "PLANET",
			alignment: "OUTLAW",
			borderConfig: {
				t: true,
				bl: true
			}
		},
		{
			x:0,
			y:-1,
			type: "ASTEROID"
		},
		{
			x:1,
			y:-1,
			type: "PLANET",
			alignment: "OUTLAW",
			borderConfig: {
				tl: true,
				t: true,
				tr: true
			}
		},
		{
			x:1,
			y:0,
			type: "PLANET",
			alignment: "OUTLAW",
			borderConfig: {
				br: true,
				b: true
			}
		},
		{
			x:0,
			y:1,
			type: "PLANET",
			alignment: "OUTLAW",
			specialType: "MISSION",
			borderConfig: {
				br: true,
				b: true,
				bl: true,
				tl: true
			}
		},
		{
			x:-1,
			y:0,
			type: "ASTEROID"
		},
		{
			x:-1,
			y:-1
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
			type: "ASTEROID"
		},
		{
			x:2,
			y:0,
			type: "PLANET",
			alignment: "OUTLAW",
			specialType: "BUY",
			availableCube: "ANY",
			borderConfig: {
				t: true,
				tr: true,
				br: true,
				b: true
			}
		},
		{
			x:2,
			y:1,
			type: "ASTEROID"
		},
		{
			x:1,
			y:1,
			type: "ASTEROID"
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
			y:1,
			specialType: "SPAWN",
			spawnNumber: 18
		},
		{
			x:-2,
			y:0,
			type: "ASTEROID"
		},
		{
			x:-2,
			y:-1,
			type: "ASTEROID",
			specialType: "EXPLORE"
		},
		{
			x:-1,
			y:-2
		}
	]
});

Xia.tile.KemplarII = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "PLANET",
			alignment: "LAWFUL"
		},
		{
			x:0,
			y:-1,
			type: "PLANET",
			alignment: "LAWFUL",
			specialType: "BUY",
			availableCube: "S",
			borderConfig: {
				tl: true,
				t: true
			}
		},
		{
			x:1,
			y:-1,
			type: "PLANET",
			alignment: "LAWFUL"
		},
		{
			x:1,
			y:0,
			type: "PLANET",
			alignment: "LAWFUL"
		},
		{
			x:0,
			y:1,
			type: "PLANET",
			alignment: "LAWFUL",
			specialType: "SELL",
			availableCube: "H",
			borderConfig: {
				b: true,
				bl: true
			}
		},
		{
			x:-1,
			y:0,
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				b: true,
				bl: true,
				tl: true
			}
		},
		{
			x:-1,
			y:-1,
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				bl: true,
				t: true
			}
		},
		{
			x:0,
			y:-2
		},
		{
			x:1,
			y:-2,
			specialType: "MISSION",
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				tl: true,
				t: true,
				tr: true
			}
		},
		{
			x:2,
			y:-1,
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				t: true,
				tr: true,
				br: true
			}
		},
		{
			x:2,
			y:0,
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				tr: true,
				br: true
			}
		},
		{
			x:2,
			y:1,
			specialType: "EXPLORE",
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				tr: true,
				br: true,
				b: true
			}
		},
		{
			x:1,
			y:1,
			type: "PLANET",
			alignment: "LAWFUL",
			borderConfig: {
				br: true,
				b: true,
				bl: true
			}
		},
		{
			x:0,
			y:2
		},
		{
			x:-1,
			y:1
		},
		{
			x:-2,
			y:1,
			specialType: "SPAWN",
			spawnNumber: 2
		},
		{
			x:-2,
			y:0
		},
		{
			x:-2,
			y:-1
		},
		{
			x:-1,
			y:-2
		}
	]
});

Xia.tile.ExpediorGate = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "GATE",
			borderConfig: {
				br: true,
				b: true,
				bl: true,
				tl: true
			}
		},
		{
			x:0,
			y:-1,
			type: "GATE",
			borderConfig: {
				bl: true,
				tl: true,
				t: true,
				tr: true
			}
		},
		{
			x:1,
			y:-1,
			type: "GATE",
			borderConfig: {
				t: true,
				tr: true,
				br: true,
				b: true
			}
		},
		{
			x:1,
			y:0
		},
		{
			x:0,
			y:1
		},
		{
			x:-1,
			y:0
		},
		{
			x:-1,
			y:-1,
			specialType: "MISSION"
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
			y:-1
		},
		{
			x:2,
			y:0
		},
		{
			x:2,
			y:1,
			specialType: "SPAWN",
			spawnNumber: 10
		},
		{
			x:1,
			y:1
		},
		{
			x:0,
			y:2
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
			y:-1
		},
		{
			x:-1,
			y:-2
		}
	]
});

Xia.tile.DeltusGate = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "GATE",
			borderConfig: {
				bl: true,
				tl: true,
				t: true,
				tr: true
			}
		},
		{
			x:0,
			y:-1
		},
		{
			x:1,
			y:-1,
			specialType: "MISSION"
		},
		{
			x:1,
			y:0,
			type: "GATE",
			borderConfig: {
				t: true,
				tr: true,
				br: true,
				b: true
			}
		},
		{
			x:0,
			y:1,
			type: "GATE",
			borderConfig: {
				br: true,
				b: true,
				bl: true,
				tl: true
			}
		},
		{
			x:-1,
			y:0
		},
		{
			x:-1,
			y:-1
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
			y:-1
		},
		{
			x:2,
			y:0
		},
		{
			x:2,
			y:1
		},
		{
			x:1,
			y:1
		},
		{
			x:0,
			y:2
		},
		{
			x:-1,
			y:1
		},
		{
			x:-2,
			y:1,
			specialType: "SPAWN",
			spawnNumber: 11
		},
		{
			x:-2,
			y:0
		},
		{
			x:-2,
			y:-1
		},
		{
			x:-1,
			y:-2
		}
	]
});

Xia.tile.TigrisGate = new JS.Class(Xia.Tile, {
	
	hexConfigs: [
		{
			x:0,
			y:0,
			type: "GATE",
			borderConfig: {
				bl: true,
				tl: true,
				t: true,
				tr: true
			}
		},
		{
			x:0,
			y:-1
		},
		{
			x:1,
			y:-1,
			type: "DEBRIS"
		},
		{
			x:1,
			y:0,
			type: "GATE",
			borderConfig: {
				t: true,
				tr: true,
				br: true,
				b: true
			}
		},
		{
			x:0,
			y:1,
			type: "GATE",
			borderConfig: {
				br: true,
				b: true,
				bl: true,
				tl: true
			}
		},
		{
			x:-1,
			y:0
		},
		{
			x:-1,
			y:-1
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
			type: "DEBRIS"
		},
		{
			x:2,
			y:0,
			specialType: "MISSION"
		},
		{
			x:2,
			y:1,
			type: "DEBRIS"
		},
		{
			x:1,
			y:1
		},
		{
			x:0,
			y:2,
			specialType: "SPAWN",
			spawnNumber: 19
		},
		{
			x:-1,
			y:1
		},
		{
			x:-2,
			y:1,
			type: "DEBRIS"
		},
		{
			x:-2,
			y:0,
			type: "DEBRIS"
		},
		{
			x:-2,
			y:-1,
			type: "DEBRIS"
		},
		{
			x:-1,
			y:-2,
			type: "DEBRIS"
		}
	]
});

Xia.tile.createAvailableTiles = function(){
	Xia.tile.availableTiles = [
		Xia.tile.Outpost338,
		Xia.tile.RedGulch,
		Xia.tile.Tk421,
		Xia.tile.BurningHorse,
		Xia.tile.LowerStratus,
		Xia.tile.Vortex86,
		Xia.tile.Xia,
		Xia.tile.LostSector,
		Xia.tile.KrellerIV,
		Xia.tile.Pelmont,
		Xia.tile.TheKeep,
		Xia.tile.NeoDamascus,
		Xia.tile.DoravinV,
		Xia.tile.Azure,
		Xia.tile.Lunari,
		Xia.tile.SmugglersDen,
		Xia.tile.KemplarII,
		Xia.tile.ExpediorGate,
		Xia.tile.DeltusGate,
		Xia.tile.TigrisGate
	];
	Xia.shuffle(Xia.tile.availableTiles);
};