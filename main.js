var Xia = {};

Xia.playerCount = 5;//this is going to have to be dynamically set by a game start configuration screen
Xia.currentPlayer = 0;

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

Xia.chooseShips = function(){
	
	if(Xia.shipPickerToggle)
		Xia.shipPickerToggle.remove();
	
	Xia.shipPickerOuterContainer = $("<div style=\"position:absolute;left:0px;right:0px;top:0px;bottom:0px;background-color:white;\"></div>");
	
	Xia.shipPickerToggle = $("<div style=\"position:absolute;left:0px;top:0px;right:0px;height:50px;background-color:white;border-bottom: 5px solid black;text-align:center;\"></div>");
	Xia.viewGameBoardButton = $("<input style=\"margin-top:14px;\" type=\"button\" value=\"View Game Board\"/>");
	Xia.viewGameBoardButton.bind("click", Xia.viewGameBoard);
	Xia.shipPickerToggle.append(Xia.viewGameBoardButton);
	
	var shipPickerTitle = $("<div style=\"width:20%;top:50px;left:0px;position:absolute;height:50px;border-right: 5px solid black;border-bottom: 5px solid black;overflow:auto;margin-top:5px;text-align:center;\"><div style=\"margin-top:14px;\">Please Select Your Starting Ship</div></div>");
	
	var shipPicker = "<div style=\"width:20%;top:110px;left:0px;position:absolute;bottom:0px;border-right: 5px solid black;overflow:auto;\">";
	var tier1Ships = Xia.ships.tier1;
	for(var i = 0; i < tier1Ships.length; i++)
	{
		var shipPrototype = tier1Ships[i];
		shipPicker += "<div class=\"select_tier_1_ship\" data-shipindex=\"" + i + "\">" + shipPrototype.prototype.name + "</div>";
	}
	
	shipPicker += "</div>";
	
	Xia.shipPickerContainer = $(shipPicker);
	Xia.shipPickerContainer.bind("click", Xia.previewStartShip);
	
	var shipPreview = "<div style=\"left:20%;top:50px;right:0px;position:absolute;bottom:0px;overflow:auto;\"></div>";
	Xia.shipPreviewContainer = $(shipPreview);
	
	$(document.body).append(Xia.shipPickerOuterContainer);
	Xia.shipPickerOuterContainer.append(shipPickerTitle);
	Xia.shipPickerOuterContainer.append(Xia.shipPickerToggle);
	Xia.shipPickerOuterContainer.append(Xia.shipPickerContainer);
	Xia.shipPickerOuterContainer.append(Xia.shipPreviewContainer);
	
};

Xia.viewGameBoard = function(){
	Xia.shipPickerOuterContainer.remove();
	Xia.shipPickerToggle = $("<div style=\"position:absolute;left:0px;bottom:0px;right:0px;height:50px;background-color:white;border-top: 5px solid black;text-align:center;\"></div>");
	Xia.viewShipChoiceMenuButton = $("<input style=\"margin-top:14px;\" type=\"button\" value=\"View Ship Choice Menu\"/>");
	Xia.shipPickerToggle.append(Xia.viewShipChoiceMenuButton);
	Xia.viewShipChoiceMenuButton.bind("click", Xia.chooseShips);
	$(document.body).append(Xia.shipPickerToggle);
};

Xia.previewStartShip = function(e){
	
	var shipDiv = $(e.target).closest(".select_tier_1_ship");
	
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
		
		var acceptShipButtonContainer = $("<div style=\"margin: 0 auto;width:400px;margin-top:15px;text-align:center;\"></div>");
		var acceptShipButton = $("<input type=\"button\" value=\"Choose this Ship\" data-shipindex=\"" + shipIndex + "\"/>");
		acceptShipButton.bind("click", Xia.acceptShip);
		acceptShipButtonContainer.append(acceptShipButton);
		Xia.shipPreviewContainer.append(acceptShipButtonContainer);
	}
};

Xia.acceptShip = function(e){
	var shipIndex = $(e.currentTarget).data("shipindex");
	var shipClass = Xia.ships.tier1[shipIndex];
	var currentPlayerObject = Xia.player.allPlayers[Xia.currentPlayer];
	currentPlayerObject.setShip(new shipClass({
		renderTo: $(".player_dock .ship_container").eq(Xia.currentPlayer),
		playerColor: currentPlayerObject.getColor()
	}));
	
	Xia.ships.tier1.splice(shipIndex, 1);//remove the ship so it's no longer available for selection
	Xia.shipPickerOuterContainer.remove();//remove the ship picking menu, as it can be rebuilt without the selected ship
	
	//this next block will move the cursor to the next player and restart the ship picking process
	Xia.currentPlayer++;
	
	if(Xia.currentPlayer < Xia.playerCount)
		Xia.playerSetup();
	else
	{
		Xia.currentPlayer = 0;
		//on to next phase of game
	}
};

Xia.chooseColors = function(){
	
	Xia.playerBeginOuterContainer.remove();
	
	var colorOptions = Xia.player.colorOptions;
	var screenHeight = document.body.clientHeight;
	var screenWidth = document.body.clientWidth;
	var offsetTop = (screenHeight / 2) - 200;
	var offsetLeft = (screenWidth / 2) - 200;
	
	Xia.colorPickerOuterContainer = $("<div style=\"position:absolute;left:0px;right:0px;top:0px;bottom:0px;\"></div>");
	var colorPickerContainer = $("<div style=\"position:absolute;left:" + offsetLeft + "px;top:" + offsetTop + "px;width:400px;height:400px;text-align:center;border: 5px solid #CCCCCC;background-color:white;\"></div>");
	var colorPickerTitle = $("<div style=\"top:0px;left:0px;right:0px;position:absolute;height:50px;border-bottom: 5px solid #CCCCCC;text-align:center;\"><div style=\"margin-top:14px;\">Please Select Your Color</div></div>");
	
	var colorPicker = "<div style=\"top:55px;left:0px;right:0px;position:absolute;bottom:55px;overflow:auto;border-bottom: 5px solid #CCCCCC;\">";
	for(var i = 0; i < colorOptions.length; i++)
	{
		colorPicker += "<div class=\"select_color\" data-colorindex=\"" + i + "\">" + colorOptions[i] + "</div>";
	}
	
	colorPicker += "</div>";
	var colorPicker = $(colorPicker);
	colorPicker.bind("click", Xia.selectColor);
	
	$(document.body).append(Xia.colorPickerOuterContainer);
	Xia.colorPickerOuterContainer.append(colorPickerContainer);
	colorPickerContainer.append(colorPickerTitle);
	colorPickerContainer.append(colorPicker);
	
	var acceptColorButtonContainer = $("<div style=\"position:absolute;bottom:0px;left:0px;right:0px;height:40px;text-align:center;\"></div>");
	var acceptColorButton = $("<input type=\"button\" value=\"Choose Selected Color\"/>");
	acceptColorButton.bind("click", Xia.acceptColor);
	acceptColorButtonContainer.append(acceptColorButton);
	colorPickerContainer.append(acceptColorButtonContainer);
	
};

Xia.selectedColorIndex = null;
Xia.selectColor = function(e){
	
	var colorDiv = $(e.target).closest(".select_color");
	
	if(colorDiv.length > 0)
	{
		$(e.currentTarget).children().css("background-color","white");
		colorDiv.css("background-color","lightgray");
		Xia.selectedColorIndex = colorDiv.data("colorindex");
	}
	
};

Xia.acceptColor = function(){
	
	if(Xia.selectedColorIndex != null)
	{
		Xia.colorPickerOuterContainer.remove();
		
		var selectedColor = Xia.player.colorOptions[Xia.selectedColorIndex];
		Xia.player.allPlayers[Xia.currentPlayer].setColor(selectedColor);
		Xia.player.colorOptions.splice(Xia.selectedColorIndex, 1);
		Xia.selectedColorIndex = null;
		
		Xia.chooseShips();
	}
	else
		alert("You must selected a color");
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
	Xia.explorationTokens.createStack();
};

Xia.displayMessage = function(message, callback){
	
	var screenHeight = document.body.clientHeight;
	var screenWidth = document.body.clientWidth;
	var offsetTop = (screenHeight / 2) - 50;
	var offsetLeft = (screenWidth / 2) - 200;
	
	Xia.playerBeginOuterContainer = $("<div style=\"position:absolute;left:0px;right:0px;top:0px;bottom:0px;\"></div>");
	var playerBeginTitle = $("<div style=\"top:" + offsetTop + "px;left:" + offsetLeft + "px;position:absolute;height:100px;width:300px;border: 5px solid #CCCCCC;text-align:center;background-color:white;\"><div style=\"margin-top:14px;\">" + message + "</div></div>");
	Xia.playerBeginOuterContainer.append(playerBeginTitle);
	
	$(document.body).append(Xia.playerBeginOuterContainer);
	
	var acceptColorButtonContainer = $("<div style=\"position:absolute;bottom:0px;left:0px;right:0px;height:40px;text-align:center;\"></div>");
	var acceptColorButton = $("<input type=\"button\" value=\"Begin Game\"/>");
	acceptColorButton.bind("click", callback);
	acceptColorButtonContainer.append(acceptColorButton);
	playerBeginTitle.append(acceptColorButtonContainer);
	
};

Xia.playerSetup = function(){
	
	Xia.shipDockSelect(Xia.currentPlayer);
	Xia.displayMessage("Welcome to the game player: " + (Xia.currentPlayer + 1), Xia.chooseColors);
	
};

Xia.createPlayerDock = function(){
	//create the bottom middle dock with player ships and info
	var playerDockWidth = 700;
	var playerDockHeight = 431;
	
	
	var playerDockContainer = $("<div class=\"player_dock\" style=\"width:" + playerDockWidth + "px;height:" + playerDockHeight + "px;\"></div>");
	$(document.body).append(playerDockContainer);
	var playerSelectionContainer = $("<div class=\"player_list\" style=\"\"></div>");
	var shipDiagramContainer = $("<div style=\"position:absolute;top:0px;left:171px;bottom:0px;right:0px;\"></div>");
	playerDockContainer.append(playerSelectionContainer);
	playerDockContainer.append(shipDiagramContainer);
	
	var allPlayersDisplay = "";
	var playerShipContainers = "";
	for(var i = 0; i < Xia.playerCount; i++)
	{
		allPlayersDisplay += "<div class=\"select_player\" data-playerindex=\"" + i + "\">Player " + (i + 1) + "</div>";
		playerShipContainers += "<div class=\"ship_container ship_" + i + "\"></div>";
	}
	playerSelectionContainer.append(allPlayersDisplay);
	
	playerSelectionContainer.bind("click", function(e){
		
		var playerDiv = $(e.target).closest(".select_player");
		if(playerDiv)
		{
			var selectedIndex = $(playerDiv).data("playerindex");
			if(selectedIndex != null)
				Xia.shipDockSelect(selectedIndex);
		}
		
	});
	
	shipDiagramContainer.append(playerShipContainers);
	
	Xia.shipDockSelect(0);
	
};

Xia.shipDockSelect = function(displayIndex){
	
	var selectionPanel = $(".player_dock .select_player");
	
	
	selectionPanel.css("background-color","black");
	selectionPanel.eq(displayIndex).css("background-color","rgb(42, 42, 42)");
	
	$(".player_dock .ship_container").css("display", "none");
	
	$(".player_dock .ship_container").eq(displayIndex).css("display", "block");
};

//automatically picks ships and colors for players
Xia.automatePlayerSetup = function(){
	var allPlayers = Xia.player.allPlayers;
	
	for(var i = 0; i < allPlayers.length; i++)
	{
		allPlayers[i].setColor(Xia.player.colorOptions.pop());
		var shipClass = Xia.ships.tier1.pop();
		allPlayers[i].setShip(new shipClass({
			renderTo: $(".player_dock .ship_container").eq(i),
			playerColor: allPlayers[i].getColor()
		}));
	}
};

$(document).ready(function(){
	
	Xia.player.createPlayers();
	
	Xia.shuffleThings();
	
	Xia.tile.layOutStartingTiles();
	
	Xia.createPlayerDock();
	
	//Xia.playerSetup();
	Xia.automatePlayerSetup();
	
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