Xia.player = {};
Xia.player.allPlayers = [];
Xia.player.colorOptions = [
	"BLACK",
	"BLUE",
	"GREEN",
	"RED",
	"YELLOW"
];

Xia.player.Player = new JS.Class({
	
	ship: null,
	color: null,
	
	initialize: function() {
		var me = this;
	},
	
	setShip: function(shipInstance){
		this.ship = shipInstance;
	},
	
	setColor: function(playerColor){
		this.color = playerColor;
	}
	
});