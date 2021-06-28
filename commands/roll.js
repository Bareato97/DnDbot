module.exports = {
	name: 'roll',
	description: 'Takes user input and outputs a die roll',
	execute(message, tokens){
		/*
			This is the logic for the !roll command
			It will take arguements of variable length
			Example:
			!roll 2d20kh + 3 + 1d4 + 10 - 5
			
			TODO: add roll modifiers like rerolls, and minimum rolls
			
		*/
	}
		
		
	
	/*
		This function takes user input and converts it to a workable value
		It also configures bonuses and operators
		input - string input, each word of the original message is broken up and passed into this function
		return values:
		-3 for error
		-2 for negative operators
		-1 for positive operators
	*/
	function parseDieInput(input){
		
		const keepHighest = 'kh';
		const keepLowest = 'kl';
		const reRoll = 'ro'; // will be used later for rerollin
		const mn = 'mn'; // will be used later for minimum rolls
		
		if(input === '+'){
			return -1;
		}else if(input === '-'){
			return -2;
		}
		
		
		var numDie = 1;
		var dieFaces;
		var adv = 0, advIndex = input.length;
		if(!isNaN(parseInt(input))){
			return parseInt(input);
		}
		
		var ro = 0, roIndex = input.length, roThreshold; // reroll
		if(!input.includes('d')) return -3;
		var dIndex = input.indexOf('d'); // where the d in the input is located
		if(dIndex != 0){ // if input is provided before d
			
			var temp = input.substr(0, dIndex);
			numDie = parseInt(temp);
			if(isNaN(numDie)) numDie = 1;
		}
		
		// disadvantage and advantage are mutually exclusive
		if(input.includes(keepHighest)){
			adv = 1;
			advIndex = input.indexOf(keepHighest);
		}else if(input.includes(keepLowest)){
			adv = -1;
			advIndex = input.indexOf(keepLowest);
		}
		if(input.includes(reroll)){
			ro = 1;
			roIndex = input.indexOf(ro);
			var temp = input.substr(roIndex + reroll.length, input.length - roIndex); // returns the last few variables
			roThreshold = praseInt(temp);
			if(isNaN(roThreshold)) return -3;
		}
		var toNextArg = min(roIndex, advIndex); // both default to length of input, this way there won't need to be checks if either/both are present in the string to get the end of the number of die argument
		var dieFacesString = input.substr(dIndex + 1, toNextArg - dIndex);
		dieFaces = parseInt(dieFacesString);
		if(isNaN(dieFaces)) return -3;
		
		return rollDice(numDice, dieFaces, adv, ro, roThreshold, 0,0);
	}
	
	
	/*
		This function takes the trimmed input from the user's message and rolls a number of dice with provided parameters
		
		It only handles the die roll, it does not include any bonuses
		
		numDice - number of dice to roll
		numFaces - number of faces on the die to roll
		adv - the advantage parameter, -1 disadv, 0 normal, 1 advantage
		ro - reroll parameter
		roVal - the reroll threshold, inclusive
		mn - minimum parameter
		mnVal = minimum value to be rolled.
	*/
	function rollDice(numDice = 1, numFaces, adv = 0, ro = 0, roVal = 0, mn = 0, mnVal = 0){
		var highest = 0;
		var lowest = numFaces;
		var total = 0;
		
		for(int i = 0; i < numDice; i++){
			var tempRoll = Math.floor(Math.random() * numFaces) + 1;
			if(ro != 0 && tempRoll <= roVal){ // reroll it if the value is below the threshold, and rerolling is enabled
				tempRoll = Math.floor(Math.random() * numFaces) + 1;
			}
			if(adv < 0){ // calculate highest roll
				if(tempRoll < lowest) lowest = tempRoll;
				tempRoll = lowest;
			}else if(adv > 0){ // calculate lowest roll
				if(tempRoll > highest) highest = tempRoll;
				tempRoll = highest;
			}
			if(mn != 0){ // input min value
				tempRoll = Math.max(tempRoll, mnVal);
			}
			if(adv == 0){
				total += tempRoll;
			}else{
				total = tempRoll;
			}
		}
		return total;
	}
}