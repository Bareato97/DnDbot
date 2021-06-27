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
		
		const keepHighest = 'kh';
		const keepLowest = 'kl';
		// const reRoll = 'ro'; will be used later for rerollin
		// const min = 'min'; will be used later for minimum rolls
		
		var advantage = 0; // -1 for disadv, 0 for normal, 1 for advantage
		
		var rolls = []; // store rolled values, 2D dimensional, index[i,0] is roll 1 while [i,1] is the second roll
		var bonuses = []; // store the bonuses
		var nextMultipler = 1; // changes the value of the next arg, if the previous arg '-' then it will turn the next value negative
		
		var totalBonus = 0;
		var dieTotal = 0;
		var rollTotal = 0; // integer total
		
		var output; // output string
		
		var input = message.content.substring(name.length + 1); // input already validated to get to this function, can just slice the !roll
		
		input = input.replace(' '); // remove all white space, store in modified input
		var args = input.split(/?=[+-]|?<=[+-]/); // split string at operators, but keep them in the new array of arguments
		
		if(args.length < 1) return message.reply('Need something to roll'); // validate input
		
		for(int i; i < args.length; i++){
			// check what kind of value it is
			if(args[i] === '+'){
				if(nextMultipler < 0){
					nextMultiplier = 1;
					continue;
				}
			}else if(args[i] === '-'){
				if(nextMultipler > 0){
					nextMultiplier = -1;
					continue;
				}
			}
			
			advantage = 0; // reset advantage 
			
			var dieVals = args[i].split(/[0-9]/g);
			if(dieVals.length > 0){
				if(dieVals[0].toLowerCase() != 'd') continue;
				if(dieVals.length > 1){
					if(dieVals[1] === keepHighest){
						advantage = 1;
					}else if(dieVals[1] === keepLowest){
						advantage = 0;
					}
				}
			}
			var dieNums = args[i].split(/\D/g);
			var numToRoll = 1; // number of times to roll the dice
			if(dieNums.length < 1) continue; // check for valid input
			if(dieNums.length == 1){
				var tempBonus = parseInt(dieNums[0]);
				tempBonus = tempBonus * nextMultipler;
				bonuses.push(tempBonus);
				totalBonus += tempBonus;
			}
			if(dieNums.length > 1){
				var roll = args[i].split(/?=[dD]|?<=[dD]/);
				/*
					Following code is to check that the input is in the correct format, xdx not xd
				*/
				if(roll.length != 3 || roll.length != 2) continue; // 3 is for xdx, as each one is will be its own entry, 2 is for dx
				if(roll.length = 2){ //if no number of dice is specified
					roll[1] = roll[1].replace(/\D/g, '');
					if(isNan(parseInt(roll[1])) || roll[1] === '') continue;
					var rolledNum = Math.floor(Math.random() * roll[1]) + 1;
					rolledNum = rolledNum * nextMultipler; // adjust for addition or subtraction
					rolls.push(rolledNum);
				}else{
					var tempRolls[]; // holds arrays to be pushed later, so they can be seperated in the output
							
					var ntrString = roll[0].replace(/\D/g, ''); // number to roll string
					var dieString = roll[2].replace(/\D/g, ''); // number of die faces
					
					if(isNan(parseInt(ntrString))) continue;
					if(isNan(parseInt(dieString))) continue;
					
					numToRoll = parseInt(roll[0]);
					var die = parseInt(dieString);
					switch(advantage){
						case -1: // disadvantage
							var lowest = die;
							
							for(int i = 0; i < numToRoll; i++){
								var rolledNum = Math.floor(Math.random() * die) + 1;
								rolls.push(rolledNum);
								if(rolledNum < lowest) lowest = rolledNum;
							}
							rollTotal += lowest * nextMultipler;
							rolls.push(tempRolls);
							break;
						case 0: // normal
							for(int i = 0; i < numToRoll; i++){
								var rolledNum = Math.floor(Math.random() * die) + 1;
								rolls.push(rolledNum);
								rollTotal += rolledNum * nextMultipler;
							}
							rolls.push(tempRolls);
							break;	
						case 1:
							var highest = 0;
							
							for(int i = 0; i < numToRoll; i++){
								var rolledNum = Math.floor(Math.random() * die) + 1;
								rolls.push(rolledNum);
								if(rolledNum > highest) highest = rolledNum;
							}
							rollTotal += highest * nextMultipler;
							rolls.push(tempRolls);
							break;
						default:
						break;
					}
				}
			}
		}
		
		
	}
	
	/*
		This function takes user input and converts it to a workable value
		It also configures bonuses and operators
		input - string input, each word of the original message is broken up and passed into this function
	*/
	function parseDieInput(input){
		
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