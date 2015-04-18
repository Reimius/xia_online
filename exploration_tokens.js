Xia.explorationTokens = {};
Xia.explorationTokens.stack = null;

Xia.explorationTokens.createStack = function(){
	Xia.explorationTokens.stack = [];
	for(var i = 0; i < 7; i++)
		Xia.explorationTokens.stack.push("CR");
	for(var i = 0; i < 7; i++)
		Xia.explorationTokens.stack.push("NOTHING");
	for(var i = 0; i < 7; i++)
		Xia.explorationTokens.stack.push("FP");
	
	Xia.shuffle(Xia.explorationTokens.stack);
};