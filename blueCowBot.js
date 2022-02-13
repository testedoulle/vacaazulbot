const tmi = require('tmi.js');
require('dotenv/config');
const process = require('process');

// Define configuration options
const opts = {
  identity: {
    username:  process.env.BOT_USERNAME,
    password:  process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

var participantes = [];

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  if(commandName == "!comandos"){
    client.say(target, `Você pode interagir com nosso bot, usando os seguintes comandos: !impar, !par, !dice`);
  }

  if(commandName == "!impar" || commandName == "!par"){
    client.say(target, playingTheOdds(context, commandName));
  }

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else {
    //console.log(`* Unknown command ${commandName}`);
  }

  if (commandName === 'sou moderador?' || commandName == 'o que sou eu?') {
    client.say(target, isModerator(context));
  }

}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

function playingTheOdds(context, commandName) {
    const numerSorteado = Math.random();
    const randomNumber = Math.floor(numerSorteado * 10);
    

    if((randomNumber % 2) != 0) {
        if(commandName == "!impar"){
            return `${context.username} parabéns você venceu o número sorteado foi ${randomNumber}`;
        }

        return `${context.username} perdeu :( o número sorteado foi ${randomNumber}`;
    } else {
        if(commandName == "!par"){
            return `${context.username} parabéns você venceu o número sorteado foi ${randomNumber}`;
        }

        return `${context.username} perdeu :( o número sorteado foi ${randomNumber}`;
    }

}

function playingTheOddsTobe(context, commandName){
    if(commandName == "!impar"){
        participantes.push(
            {
                pessoa: {
                    username: context.username,
                    escolha: "impar"
                }
            }
        );

        return `${context.username} escolheu impar`;
    }

    if(commandName == "!par"){
        participantes.push(
            {
                pessoa: {
                    username: context.username,
                    escolha: "par"
                }
            }
        );

        return `${context.username} escolheu impar`;
    }

    
}

function isModerator(context){
    if(context.badges != null){
        if (context.badges.moderator == 1){
            return  `${context.username} é modLove`;
        }
        if (context.badges.broadcaster == 1) {
            return  `${context.username} é o carinha ali da camera, tendeu?`;
        }
    }

    return  `${context.username} é pessoa boa`
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}