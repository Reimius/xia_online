var Xia = {};

Xia.playerCount = 5;//this is going to have to be dynamically set by a game start configuration screen

Xia.rollDice = function(max) {
  return Math.floor(Math.random() * (max)) + 1;
};

Xia.shuffle = function(array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//shallow copies an object
Xia.cloneObject = function(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

Xia.enterBuyMode = function(){
	//set the part they want to place on the diagram
	Xia.placingPart = new Xia.outfits.RaptorKEngine();
	//enable the diagram for user selection for part layout
	Xia.myShipTest.enterPlacementMode(Xia.placingPart);
	
	Xia.actionButton.css("display","none");
	Xia.actionButton3.css("display","inline");
	Xia.actionButton2.css("display","inline");
};

Xia.placePart = function(){
	Xia.myShipTest.placeItem();
	Xia.actionButton3.css("display","none");
	Xia.actionButton.css("display","inline");
	Xia.actionButton2.css("display","none");
};

Xia.cancelBuyMode = function(){
	Xia.myShipTest.cleanupPlacementMode();
	Xia.actionButton3.css("display","none");
	Xia.actionButton.css("display","inline");
	Xia.actionButton2.css("display","none");
};

Xia.createShipTest = function(){
	var shipDivContainer = $("<div style=\"position:absolute;top:0px;left:0px;\"></div>");
	$(document.body).append(shipDivContainer);
	
	Xia.myShipTest = new Xia.ships.EasyTiger({
		playerColor: "red",
		renderTo:    shipDivContainer
	});
};

Xia.gameStart = function(){
	//alert("Please select your ship");
	
	var shipPicker = "<div style=\"width:20%;top:0px;left:0px;position:absolute;bottom:0px;border-right: 5px solid black;overflow:auto;\">";
	var tier1Ships = Xia.ships.tier1;
	for(var i = 0; i < tier1Ships.length; i++)
	{
		var shipPrototype = tier1Ships[i];
		shipPicker += "<div class=\"select_tier_1_ship\" data-shipindex=\"" + i + "\">" + shipPrototype.prototype.name + "</div>";
	}
	
	shipPicker += "</div>";
	
	Xia.shipPickerContainer = $(shipPicker);
	Xia.shipPickerContainer.bind("click", Xia.previewStartShip);
	$(document.body).append(Xia.shipPickerContainer);
	
	var shipPreview = "<div style=\"left:20%;top:0px;right:0px;position:absolute;bottom:0px;overflow:auto;\"></div>";
	Xia.shipPreviewContainer = $(shipPreview);
	$(document.body).append(Xia.shipPreviewContainer);
	
};

Xia.previewStartShip = function(something, something2, something3, something4){
	
	var shipDiv = $(something.target).closest(".select_tier_1_ship");
	
	if(shipDiv.length > 0)
	{
		Xia.shipPickerContainer.children().css("background-color","white");
		shipDiv.css("background-color","lightgray");
		Xia.shipPreviewContainer.empty();
		
		var shipIndex = shipDiv.data("shipindex");
		var shipClass = Xia.ships.tier1[shipIndex];
		
		var shipImage = $("<div style=\"background:url(" + shipClass.prototype.imageSrc + ");width:534px;height:331px;margin: 0 auto;margin-top:100px;\"></div>");
		
		Xia.shipPreviewContainer.append(shipImage);
		var rollOutcomeDisplay = shipClass.prototype.getSpecialAbilityDisplay();
		var rollOutcomeContainer = $(rollOutcomeDisplay);
		var rollOutcomeDiv = $("<div style=\"margin: 0 auto;width:400px;margin-top:50px;\"></div>");
		rollOutcomeDiv.append(rollOutcomeContainer);
		
		Xia.shipPreviewContainer.append(shipImage);
		Xia.shipPreviewContainer.append(rollOutcomeDiv);
	}
};

Xia.createRollOutcomeGridDisplay = function(headerText, items){
	var gridHtml = "<table class=\"roll_outcome\" width=\"100%\">";
	gridHtml += "<tr><td class=\"roll_outcome\" colspan=\"2\" style=\"width:100%;background-color:lightgray;text-align:center;\">" + headerText + "</td></tr>";
	if(items)
	{
		for(var i = 0; i < items.length; i++)
		{
			gridHtml += "<tr>";
			var diceRoll = items[i][0];
			var diceRollBackgroundColor = items[i][1];
			var description = items[i][2];
			
			gridHtml += "<td class=\"roll_outcome\" style=\"text-align:center;width:20%;background-color:" + diceRollBackgroundColor + ";\">" + diceRoll + "</td>";
			gridHtml += "<td class=\"roll_outcome\" style=\"width:80%\">" + description + "</td>";
			gridHtml += "</tr>";
			
		}
	}
	gridHtml += "</table>";
	
	return gridHtml;
};

//this function will shuffle all arrays that are supposed to be random at the start of the game
Xia.shuffleThings = function(){
	
};

Xia.createPlayers = function(playerCount){
	//this will do something to instantiate players, not sure how this will work yet
};

Xia.layOutStartingTiles = function()
{
	Xia.tile.activeTiles = [];//clear out the tiles which exist already in the game, this is a setup function
	Xia.allHex = [];
	Xia.tile.createAvailableTiles();
	var lastTilePlaced = null;
	//initial placement coordinates for tiles in the game setup
	var placementCoordinates = [
		{
			x: 0,
			y: 0
		},
		{
			x: -1,
			y: -1
		},
		{
			x: 0,
			y: -1
		},
		{
			x: 1,
			y: 0
		},
		{
			x: 1,
			y: -1
		}
	];
	
	for(var i = 0; i < Xia.playerCount; i++)
	{
		var tileCoordinates = placementCoordinates[i];
		var tileClass = Xia.tile.availableTiles.pop();
		if(!lastTilePlaced)
		{
			lastTilePlaced = new tileClass({
				x: tileCoordinates.x,
				y: tileCoordinates.y
			});
		}
		else
		{
			lastTilePlaced = lastTilePlaced.placeConnectedTile(tileCoordinates.x, tileCoordinates.y);
		}
		
		var hexesToCheck = lastTilePlaced.hexes;
		
		
		var isValidTile = false;
		for(var j = 0; j < hexesToCheck.length; j ++)
		{
			var hex = hexesToCheck[j];
			if(hex.specialType == "SPAWN")
			{
				isValidTile = true;
				break;
			}
		}
		
		if(!isValidTile)
		{
			Xia.layOutStartingTiles();
			return;
		}
		
	}
	
	
};

$(document).ready(function(){
	
	Xia.shuffleThings();
	
	Xia.layOutStartingTiles();
	
	//Xia.gameStart();
	
	Xia.canvas.renderCanvas();
	
	//Xia.createShipTest();
	
	/*Xia.actionButton = $("<input type=\"button\" value=\"Enter Buy Mode\"/>");
	Xia.actionButton.bind("click", Xia.enterBuyMode);
	$(document.body).append(Xia.actionButton);
	
	Xia.actionButton2 = $("<input type=\"button\" style=\"display:none\" value=\"Place Part\"/>");
	Xia.actionButton2.bind("click", Xia.placePart);
	$(document.body).append(Xia.actionButton2);
	
	Xia.actionButton3 = $("<input type=\"button\" style=\"display:none\" value=\"Cancel Buy Mode\"/>");
	Xia.actionButton3.bind("click", Xia.cancelBuyMode);
	$(document.body).append(Xia.actionButton3);*/
	
});