//create a container to organize all the ship stuff into
Xia.ships = {};

//base class for ship, to be inherited by individual ships
Xia.ships.Ship = new JS.Class({
	
	armedMarkerState: ["ARMED", "ARMED", "ARMED", "ARMED"],
	armedMarkerLocations: [
		{
			armed: {top:143,left:15},
			disarmed: {top:180,left:15}
		},
		{
			armed: {top:143,left:38},
			disarmed: {top:180,left:38}
		},
		{
			armed: {top:143,left:61},
			disarmed: {top:180,left:61}
		},
		{
			armed: {top:143,left:84},
			disarmed: {top:180,left:84}
		}
	],
	impulseActive: true,
	energyLevel: 0,
	playerColor: "red",
	markerClass: "marker_red",
	energyMarkerTrackLeft: 178,
	energyMarkerTrackTop:  258,
	bounty: 0,
	cargoHold: [],
	cargoHoldLocation: null,
	placingItem: null,
	renderTo: null,
	outfits: [],
	
	initialize: function(config) {
        this.energyLevel = this.energyMax;
		this.renderTo = config.renderTo;
		this.playerColor = config.playerColor;
		this.markerClass = "marker_" + config.playerColor;
		this.initializeCargoHold(this.cargoHoldLayout);
		this.initialRender();
    },
	
	initializeCargoHold: function(cargoHoldLayout){
		for(var i = 0; i < cargoHoldLayout.length; i++)
		{
			var newSingleRow = [];
			this.cargoHold.push(newSingleRow);
			var singleRow = cargoHoldLayout[i];
			for(var j = 0; j < singleRow.length; j++)
			{
				if(singleRow[j])
				{
					//an object representing an empty cargo hold
					//top and left are supplied for location lookup convenience
					newSingleRow.push(
						{
							i: i,
							j: j
						}
					);
				}
				else
					newSingleRow.push(null);//null represents this is not a cargo hold, these can't hold anything
			}
		}
	},
	
	initialRender: function(){
		//make sure to change from document to the containing div at some point
		this.domObject = $("<div style=\"background:url(" + this.imageSrc + ");width:534px;height:331px;position:absolute;\">" +
			"<div class=\"marker_impulse\" style=\"background:url(image/impulse_active.gif);\"></div>" + 
		"</div>");
		
		this.renderTo.append(this.domObject);
		
		this.refreshLayout();
		
	},
	
	refreshLayout: function(){
		//remove all markers on the player sheet
		$(this.domObject).find("." + this.markerClass).remove();
		
		this.renderArmedMarkers();
		
		this.renderEnergyMarker();
		
		this.renderImpulseMarker();
		
		this.renderBounty();
	},
	
	renderArmedMarkers: function(){
		var armedMarkerState = this.armedMarkerState;
		for(var i = 0; i < armedMarkerState.length; i++)
		{
			var markerState = armedMarkerState[i];
			var location = null;
			if(markerState == "ARMED")
				location = this.armedMarkerLocations[i].armed;
			else if(markerState == "DISARMED")
				this.armedMarkerLocations[i].disarmed;
			if(location)
				$(this.domObject).append("<div class=\"" + this.markerClass + "\" style=\"top:" + location.top + "px;left:" + location.left + "px;\"></div>");
		}
	},
	
	expendEnergy: function(howMuch){
		var me = this;
		me.energyLevel = me.energyLevel - howMuch;
		me.refreshLayout();
	},
	
	renderEnergyMarker: function(){
		
		var energyLevel = this.energyLevel;
		var isEven = (energyLevel % 2 == 0);
		var left = this.energyMarkerTrackLeft + Math.floor(Math.floor(energyLevel / 2) * 33.25) + (isEven ? 0 : 17);
		var top = this.energyMarkerTrackTop + (isEven ? 0 : 30);
		$(this.domObject).append("<div class=\"" + this.markerClass + "\" style=\"top:" + top + "px;left:" + left + "px;\"></div>");
		
	},
	
	renderImpulseMarker: function(){
		var impulseImage = "image/impulse_inactive.gif";
		if(this.impulseActive)
			impulseImage = "image/impulse_active.gif";
		$(this.domObject).find(".marker_impulse").css('background-image', 'url(' + impulseImage + ')');
	},
	
	renderBounty: function(){
		
		$(this.domObject).find(".marker_bounty").remove();
		
		if(this.bounty > 0)
		{
			var bountyDiv = $("<div class=\"marker_bounty\" style=\"background:url(image/bounty.png);\"></div>");
			$(this.domObject).append(bountyDiv);
			$(bountyDiv).append("<div style=\"color:white;position:absolute;top:40px;width:100%;text-align:center;\">" + this.bounty + "</div>");
		}
		
	},
	
	//enters a "placement" mode on the diagram.  Which will allow the user to select cargo hold spaces
	//they will be red if the placement is invalid and turn green when acceptable
	enterPlacementMode: function(item){
		this.placingItem = item;
		this.renderCargoHoldSelectionLayout();
	},
	
	renderCargoHoldSelectionLayout: function(){
		
		var me = this;
		me.removeCargoHoldSelectionLayout();
		var activeColor = "red";
		if(me.isPlacingItemValid())
			activeColor = "green";
		
		for(var i = 0; i < me.cargoHold.length; i++)
		{
			var row = me.cargoHold[i];
			for(var j = 0; j < row.length; j++)
			{
				var cell = row[j];
				if(cell)
				{
					var classes = "marker_cargo_hold";
					if(cell.selected)
						classes += " marker_cargo_hold_active_" + activeColor;
					var location = me.getCargoHoldCellLocation(cell);
					var singleCargoHold = $("<div style=\"top:" + location.top + "px;left:" + location.left + "px;\" class=\"" + classes + "\"></div>");
					singleCargoHold.data("cell", cell);
					singleCargoHold.data("ship", me);
					singleCargoHold.bind("click", me.highlightCargoHold);
					$(me.domObject).append(singleCargoHold);
				}
			}
		}
	},
	
	isPlacingItemValid: function(){
		var me = this;
		return me.placingItem && me.placingItem.findValidLayout(me.getSelectionMatrix());
	},
	
	placeItem: function(){
		var me = this;
		if(me.isPlacingItemValid())
		{
			var selectionMatrix = me.getSelectionMatrix();
			var location = me.getCargoHoldCellLocation(selectionMatrix[0][0]);
			var validLayout = me.placingItem.findValidLayout(me.getSelectionMatrix());
			me.placingItem.setLayout(validLayout);
			me.placingItem.renderOutfit($(me.domObject), location);
			me.saveOutfitToCells();
			me.outfits.push(me.placingItem);//into the list of outfits on the diagram for easy reference later?
			me.cleanupPlacementMode();
		}
		else
		{
			alert("invalid item placement, please do selection until all selected squares show green");
		}
	},
	
	cleanupPlacementMode: function(){
		var me = this;
		me.removeCargoHoldSelectionLayout();
		me.deselectAllCells();
		me.placingItem = null;
	},
	
	saveOutfitToCells: function(){
		var me = this;
		var selectionMatrix = me.getSelectionMatrix();
		for(var i = 0; i < selectionMatrix.length; i++)
		{
			var row = selectionMatrix[i];
			for(var j = 0; j < row.length; j++)
			{
				var cell = row[j];
				if(cell && cell.selected)
					cell.contains = me.placingItem;
			}
		}
	},
	
	deselectAllCells: function(){
		var me = this;
		var cargoHold = me.cargoHold;
		for(var i = 0; i < cargoHold.length; i++)
		{
			var row = cargoHold[i];
			for(var j = 0; j < row.length; j++)
			{
				var cell = row[j];
				if(cell)
					cell.selected = false;
			}
		}
	},
	
	removeCargoHoldSelectionLayout: function(){
		var me = this;
		$(me.domObject).find(".marker_cargo_hold").remove();
	},
	
	getCargoHoldCellLocation: function(cell){
		
		if(!cell)
			return null;
		
		var me = this;
		var top = me.cargoHoldLocation.top;
		var left = me.cargoHoldLocation.left;
		var cubeWidth = 42;
		var cubeHeight = 42;
		
		return {
			top:  (top + (cell.i * cubeHeight)),
			left: (left + (cell.j * cubeWidth))
		};
	},
	
	/*
		Click handler which will mark the cargo cell as selected when the user clicks on it
		Causes a reflow of the selection layout to visually indicate the cargo hold cell as selected
	*/
	highlightCargoHold: function(event){
		var cell = $(event.currentTarget).data("cell");
		
		var me = $(event.currentTarget).data("ship");
		
		if(me.placingItem)
			
		
		if(cell.selected)
			cell.selected = false;
		else
		{
			if(me.placingItem)
			{
				if(!cell.contains)
					cell.selected = true;
			}
			else
				cell.selected = true;
		}
		
		me.renderCargoHoldSelectionLayout();
	},
	
	/*
		Returns the area selected by the user when in renderCargoHoldSelectionLayout mode as a matrix
	*/
	getSelectionMatrix: function(){
		var me = this;
		var cargoHold = me.cargoHold;
		
		var minLeft = null;
		var minTop = null;
		var maxLeft = null;
		var maxTop = null;
		
		for(var i = 0; i < cargoHold.length; i++)
		{
			for(var j = 0; j < cargoHold[i].length; j++)
			{
				var cell = cargoHold[i][j];
				if(cell && cell.selected)
				{
					if(minLeft == null || j < minLeft)
						minLeft = j;
					if(minTop == null || i < minTop)
						minTop = i;
					if(maxLeft == null || j > maxLeft)
						maxLeft = j;
					if(maxTop == null || i > maxTop)
						maxTop = i;
				}
			}
			
		}
		
		if(minLeft == null || minTop == null)
			return [];
		
		var subMatrix = [];
		for(var i = minTop; i <= maxTop; i++)
		{
			var subRow = [];
			for(var j = minLeft; j <= maxLeft; j++)
				subRow.push(cargoHold[i][j]);
			subMatrix.push(subRow);
		}
		
		return subMatrix;
		
	}
});

Xia.ships.EasyTiger = new JS.Class(Xia.ships.Ship, {
	name: "Easy Tiger",
	playerColor: "red",
	cargoHoldLocation: {
		left: 221,
		top:  38
	},
	cargoHoldLayout: [
		[true, true, false, false],
		[true, true, true, false],
		[true, true, true, true],
		[true, true, false, false]
	],
	imageSrc:  "image/easy_tiger.gif",
	price:     1000,
	impulse:   3,
	energyMax: 8,
	energy0Location: {
		x: 72,
		y: 292
	},
	getSpecialAbilityDisplay: function(){
		return Xia.createRollOutcomeGridDisplay("Immediately after rolling any die: Spend 1 Energy and re-roll");
	}
});

Xia.ships.Ghoststalker = new JS.Class(Xia.ships.Ship, {
	name: "Ghoststalker",
	playerColor: "red",
	cargoHoldLocation: {
		left: 221,
		top:  38
	},
	cargoHoldLayout: [
		[false, true, true, true],
		[true, true, true, false],
		[false, true, true, true]
	],
	imageSrc:  "image/ghoststalker.gif",
	price:     1000,
	impulse:   3,
	energyMax: 8,
	energy0Location: {
		x: 72,
		y: 292
	},
	getSpecialAbilityDisplay: function(){
		return Xia.createRollOutcomeGridDisplay("As an Action: Spend 2 Energy and roll [d20]",
			[
				["1-8","pink","Nothing happens. (Field out of frequency)"],
				["9-19","lightgreen","You may pass through a Planetary Shield border one time this turn with no consequences"],
				["20","lightblue","Pass through a Planetary Shield border two times this turn with no consequences"]
			]
		);
	}
});

Xia.ships.PuddleJumper = new JS.Class(Xia.ships.Ship, {
	name: "Puddle Jumper",
	playerColor: "red",
	cargoHoldLocation: {
		left: 221,
		top:  38
	},
	cargoHoldLayout: [
		[false, false, true, true, false, false],
		[false, false, true, true, false, false],
		[true, true, true, true, true, true]
	],
	imageSrc:  "image/puddle_jumper.gif",
	price:     1000,
	impulse:   4,
	energyMax: 10,
	energy0Location: {
		x: 72,
		y: 292
	},
	getSpecialAbilityDisplay: function(){
		return Xia.createRollOutcomeGridDisplay("As an Action: Roll [d20]",
			[
				["1-4","pink","Nothing happens. (No Energy present)"],
				["5-13","lightyellow","Receive 2 Energy."],
				["14-19","lightgreen","Receive 3 Energy."],
				["20","lightblue","Receive Full Energy."]
			]
		);
	}
});

Xia.ships.PersistentMemory = new JS.Class(Xia.ships.Ship, {
	name: "Persistent Memory",
	playerColor: "red",
	cargoHoldLocation: {
		left: 221,
		top:  38
	},
	cargoHoldLayout: [
		[false, true, true, true, false],
		[true, true, false, false, false],
		[true, true, false, false, false],
		[false, true, true, true, true]
	],
	imageSrc:  "image/persistent_memory.gif",
	price:     1000,
	impulse:   3,
	energyMax: 9,
	energy0Location: {
		x: 72,
		y: 292
	},
	getSpecialAbilityDisplay: function(){
		var specialAbilityDisplay = "<div style=\"width:100%;\">This ability allows you to target any adjacent ship."
			+ "  On a successful roll, you may move along directly behind the target ship when it moves, up to"
			+ " the number of spaces specified below:</div>";
		
		specialAbilityDisplay += Xia.createRollOutcomeGridDisplay("At any time: Spend 1 Energy and roll [d20]",
			[
				["1-2","pink","Nothing happens. (Harpoon Misses)"],
				["3-13","lightyellow","Follow target up to 8 spaces."],
				["14-19","lightgreen","Follow target up to 12 spaces."],
				["20","lightblue","Follow target up to any amount of spaces."]
			]
		);
		
		return specialAbilityDisplay;
	}
});

Xia.ships.Numerator = new JS.Class(Xia.ships.Ship, {
	name: "Numerator",
	playerColor: "red",
	cargoHoldLocation: {
		left: 221,
		top:  38
	},
	cargoHoldLayout: [
		[true, true, true, false],
		[false, false, true, true],
		[false, false, true, true],
		[true, true, true, false],
	],
	imageSrc:  "image/numerator.gif",
	price:     1000,
	impulse:   4,
	energyMax: 9,
	energy0Location: {
		x: 72,
		y: 292
	},
	getSpecialAbilityDisplay: function(){
		return Xia.createRollOutcomeGridDisplay("Immediately after an Engine roll:<br>Spend 1 Energy and roll [d20].",
			[
				["1-4","pink","Nothing happens. (Burner fails to ignite)"],
				["5-10","lightyellow","Add +3 to the Engine roll."],
				["11-19","lightgreen","Add +5 to the Engine roll."],
				["20","lightblue","Add +8 or double the Engine roll."]
			]
		);
	}
});

Xia.ships.SwampRat = new JS.Class(Xia.ships.Ship, {
	name: "Swamp Rat",
	playerColor: "red",
	cargoHoldLocation: {
		left: 221,
		top:  38
	},
	cargoHoldLayout: [
		[true, true, true, true, true, true],
		[true, true, true, true, true, true]
	],
	imageSrc:  "image/swamp_rat.gif",
	price:     1000,
	impulse:   3,
	energyMax: 8,
	energy0Location: {
		x: 72,
		y: 292
	},
	getSpecialAbilityDisplay: function(){
		return "<div style=\"width:100%;\">" + Xia.createRollOutcomeGridDisplay("Immediately after an Engine roll:<br>Spend 1 Energy and roll [d20].", null) + "<br>Place one Damage Marker anywhere on an Outfit. You may then immediately use that Outfit as if you had placed an Armed Marker on a Use space</div>";
	}
});

Xia.ships.tier1 = [
	Xia.ships.EasyTiger,
	Xia.ships.Ghoststalker,
	Xia.ships.Numerator,
	Xia.ships.PersistentMemory,
	Xia.ships.PuddleJumper,
	Xia.ships.SwampRat
];