const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for( const file of commandFiles){
	const command = require('./commands/' + file);
	client.commands.set(command.name, command);
	console.log('./commands/' + file);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if(!message.content.startsWith(prefix)) return; // ignore non prefix commands
	const tokens = message.content.slice(prefix.length).trim().split(' ');
	const command = tokens.shift().toLowerCase();
	
	if(!client.commands.has(command)) return;
	
	try{
		client.commands.get(command).execute(message, tokens);
	}catch(err){
		console.error(err);
		message.reply('Error encountered while attempting to load command file');
	}
});

client.login(token);
