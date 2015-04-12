Xia.tile = {};
Xia.tile.allTiles = [];

Xia.Tile = new JS.Class({
	
	//tile x and y coordinates
	x: null,
	y: null,
	//hex x and y coordinates of the center hex of this tile
	hexX: null,
	hexY: null,
	hexConfigs: null,
	hexes: null,
	
	initialize: function(config){
		
		var me = this;
		me.x = config.x;
		me.y = config.y;
		//need to figure out how to handle translating from tile xy to hex xy, tile is more tricky because flat
		//part is not on top like with the hex  
		me.hexX = (config.x * 5) + (me.y * -2);
		me.hexY = ((config.x + (Math.abs(config.x) % 2 == 1 ? 1 : 0)) / -2) + (config.y * 4);
		me.hexes = [];
		var newHexConfigs = me.getRotatedHexConfigs(config.rotations);//also creates a copy of the hex configs so we dont' mess up the original configuration
		for(var i = 0; i < newHexConfigs.length; i++)
		{
			var hexConfig = newHexConfigs[i];
			hexConfig.y = me.hexY + hexConfig.y + (Math.abs(me.hexX) % 2 == 1 && Math.abs(hexConfig.x) % 2 == 1 ? 1 : 0);
			hexConfig.x = me.hexX + hexConfig.x;
			me.hexes.push(new Xia.Hex(hexConfig));
		}
		
		Xia.tile.allTiles.push(me);
		
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
		}
		
		return newHexConfigs;
	},
	
	render: function(){
		
		var me = this;
		
		//render backgroung things such as the planets and sun
		
		for(var i = 0; i < me.hexes.length; i++)
			me.hexes[i].render();
		
		//this is going to render some tile based attributes, such as connection symbols and the tile's name
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