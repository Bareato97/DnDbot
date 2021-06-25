module.exports = {
	name: 'roll',
	description: 'Takes user input and outputs a die roll',
	execute(message, tokens){
		if(tokens.length < 1) return message.reply('I need something to roll...');

		if(!tokens[0].startsWith('d')) return message.reply('Please format message as !roll d20 + 1');
		
		//check for advantage
		
		var dieString = tokens[0].substring(1);
		if(isNaN(parseInt(dieString))) return message.reply('can\'t roll that die, its not a number');
		var inputVal = 0, dieVal = 0;
		var rollTotal = 0;
		try{
			inputVal = parseInt(dieString);
			if(inputVal < 1) return message.reply('Dice roll must have alteast one side');
			dieVal = Math.floor(Math.random() * inputVal) + 1;
			rollTotal += dieVal;
		}catch(err){
			message.reply('I can\'t roll ' + dieString);
		}
		if(tokens.length > 2){
			var bonus;
			try{
				if(isNaN(parseInt(tokens[2]))) return message.reply('can\'t add that bonus, its not a number');
				bonus = parseInt(tokens[2]);
				if(tokens[1] === '+'){
					rollTotal += bonus;
				}else if(tokens[1] === '-'){
					rollTotal -= bonus;
				}else{
					return message.reply(tokens[1] + " Is not a valid parameter");
				}
			}catch(err){
				message.reply('I can\'t add/subtract ' + tokens[1]);
			}
		}
		if(inputVal == 20){
			if(dieVal == 20){
				message.channel.send('NATURAL 20');
			}else if(dieVal == 1){
				message.channel.send('natural 1');
			}	
		}
		if(tokens.length > 2){
			return message.reply('You rolled: ' + dieVal + ' ' + tokens[1] + ' ' + bonus + ' = ' + rollTotal);
		}else{
			return message.reply('You rolled: ' + dieVal);
		}
	}
}