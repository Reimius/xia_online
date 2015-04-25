Xia.player = {};
Xia.player.allPlayers = [];
Xia.player.colorOptions = [
	"black",
	"blue",
	"green",
	"red",
	"yellow"
];

Xia.player.Player = new JS.Class({
	
	ship: null,
	color: null,
	money: 3000,
	
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