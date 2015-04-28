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
	
	getShip: function(){
		return this.ship;
	},
	
	setColor: function(playerColor){
		this.color = playerColor;
	},
	
	getColor: function(){
		return this.color;
	}
	
});

Xia.player.createPlayers = function(playerCount){
	//create instances representing each player in the player array
	for(var i = 0; i < Xia.playerCount; i++)
		Xia.player.allPlayers.push(new Xia.player.Player);
};