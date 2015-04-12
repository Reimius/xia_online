
Xia.outfits = {};

/*
This function is able to take a single matrix representing the outfit layout
and generate the 8 possible positions it can be laid on the ship cargo hold
*/
function createAllLayouts(layout){
	var layouts = [];
	
	var scaleX = 1;
	
	for(var i = 0; i < 4; i++)
	{
		layouts.push({
			layout: rotateMatrix90(layout, i),
			rotate: i * 90,
			scaleX: 1
		});
	}
	
	var reverseLayout = reverseMatrixX(layout);
	
	for(var i = 0; i < 4; i++)
	{
		layouts.push({
			layout: rotateMatrix90(reverseLayout, i),
			rotate: i * 90,
			scaleX: -1
		});
	}
	
	return layouts;
	
};

/*
This function will take a matrix and flip it along the x-axis
*/
function reverseMatrixX(matrix){
	var newMatrix = [];
	for(var i = 0; i < matrix.length; i++)
	{
		var row = matrix[i];
		var newRow = [];
		for(var j = row.length - 1; j >= 0; j--)
		{
			newRow.push(row[j]);
		}
		newMatrix.push(newRow);
	}
	return newMatrix;
}

/*
This will turn a matrix clockwise 90 degrees
*/
function rotateMatrix90(matrix, rotations){
	if(rotations == 0)
		return matrix;
	
	for(var i = 0; i < rotations; i++)
	{
		var xLength = matrix.length;
		var yLength = matrix[0].length;
		var newMatrix = [];
		for(var y = 0; y < yLength; y++)
		{
			var newRow = [];
			for(var x = xLength - 1; x >= 0; x--)
			{
				newRow.push(matrix[x][y]);
			}
			newMatrix.push(newRow);
		}
		matrix = newMatrix;
	}
	return newMatrix;
}

/*
This function will take a matrix and copy it
*/
function copyMatrix(matrix){
	var newMatrix = [];
	for(var i = 0; i < matrix.length; i++)
	{
		var row = matrix[i];
		var newRow = [];
		for(var j = 0; j < row.length; j++)
		{
			newRow.push(row[j]);
		}
		newMatrix.push(newRow);
	}
	return newMatrix;
}

//the first test outfit
Xia.outfits.Outfit = new JS.Class({
	
	name:        null,
	type:        null,
	imageSrc:    null,
	imageWidth:  null,
	imageHeight: null,
	price:       null,
	dice:        null,
	layouts:     null,
	layout:      null,
	rotate:      null,
	scaleX:      null,
	
	initialize: function() {
		var me = this;
		//figure out what the image height and width should be based on the configuration matrix
		me.imageWidth = me.layouts[0].layout[0].length * 42;
		me.imageHeight = me.layouts[0].layout.length * 42;
	},
	
	//this function will find the valid layout for this class based on a matrix representing what a user selected on the cargo hold diagram
	findValidLayout: function(selectedCargoHoldMatrix){
		
		if(!selectedCargoHoldMatrix || selectedCargoHoldMatrix.length == 0)
			return null;
		
		var me = this;
		var layoutsToCheck = me.layouts;
		var width = selectedCargoHoldMatrix[0].length;
		var height = selectedCargoHoldMatrix.length;
		for(var i = 0; i < layoutsToCheck.length; i++)
		{
			var checkLayout = layoutsToCheck[i].layout;
			var checkWidth = checkLayout[0].length;
			var checkHeight = checkLayout.length;
			if(width == checkWidth && height == checkHeight)
			{
				var isValid = true;
				for(var y = 0; y < checkHeight; y++)
				{
					for(var x = 0; x < checkWidth; x++)
					{
						if(!((selectedCargoHoldMatrix[y][x] && selectedCargoHoldMatrix[y][x].selected && checkLayout[y][x]) || ((!selectedCargoHoldMatrix[y][x] || !selectedCargoHoldMatrix[y][x].selected) && !checkLayout[y][x])))
						{
							isValid = false;
						}
					}
				}
				if(isValid)
				{
					//if a valid layout was found, return the configuration for it
					return {
						layout: copyMatrix(checkLayout),
						rotate: layoutsToCheck[i].rotate,
						scaleX: layoutsToCheck[i].scaleX
					};
				}
				
			}
		}
		return null;
	},
	
	setLayout: function(standardLayoutConfig){
		var me = this;
		me.layout = standardLayoutConfig.layout;
		me.rotate = standardLayoutConfig.rotate;
		me.scaleX = standardLayoutConfig.scaleX;
	},
	
	renderOutfit: function(renderTo, location){
		var me = this;
		var rotateDelta = 0;
		if(me.rotate == 90 || me.rotate == 270)
			rotateDelta = (me.imageWidth - me.imageHeight) / 2;
		var top = location.top + rotateDelta;
		var left = location.left - rotateDelta;
		var outfitImage = $("<div style=\"background:url(" + me.imageSrc + ");background-size:100% 100%;position:absolute;top:" + top + "px;left:" + left + "px;width:" + me.imageWidth + "px;height:" + me.imageHeight + "px;transform: rotate(" + me.rotate + "deg)scaleX(" + me.scaleX + ");\"></div>");
		renderTo.append(outfitImage);
	}

});

Xia.outfits.RaptorKEngine = new JS.Class(Xia.outfits.Outfit, {
	name:      "raptor_k_engine",
	name:     "raptor_k_engine",
	type:     "MOVEMENT",
	imageSrc: "image/engine_raptor_k.gif",
	price:    3000,
	dice:     12,
	layouts: createAllLayouts([
		["BLANK", "BLANK", "USE"],
		[null, "USE", "USE"]
	])
});

Xia.outfits.init = function(){
	//not sure if I need an init for this page yet
};