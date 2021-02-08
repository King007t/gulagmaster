const discord = require("discord.js");
const client = new discord.Client();
const fs = require("fs");
const { get } = require("http");
var sounds = fs.readdirSync("./sounds");
//AudioStreams
var dispatcher = null;
var channel = null;
var playing = false;

var token = "ODA2NDcyMjU2NjExNTQ5MjE0.YBp70Q.Uk-4T3KSKnDGX0qmwBedI6udxTc"; //AUSTAUSCHEN
var chid = "806455732236320788"; //AUSTAUSCHEN
var roleID = "806462770982813707"; //AUSTAUSCHEN
var textID = "806777012810285066"; //AUSTAUSCHEN
var guildID = "763383918069809174"; //AUSTAUSCHEN
var channelIDS = [];
var plays = [];
var players = [];

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

function play(){
    try{
        channel = client.channels.cache.get(chid);
        channel.join().then(connection => {
        dispatcher = connection.play(`./sounds/gulag.mp3`, {volume: 3});
            dispatcher.on("finish",() =>{
                dispatcher.destroy();
                channel.leave();
                playing = false;
            })
        })
        .catch(err => {
            console.error(err);
        });
    }catch{
        console.log("ERR: What the fuck?");
        const sChannel = client.channels.cache.get(textID);
        sChannel.send("WHAT. THE. FUCK. How the fuck did you manage to get this message? This shouldn't even be possible.");
    }
}

client.on("message", (msg) => {

    if(msg.author.bot){
        return;
    }

    if(msg.channel.id == textID){
        var play = null;
        var index = -1;
        for(i = 0; i < plays.length; i++){
            if(msg.member.id == plays[i].uID){
                play = plays[i];
                index = i;
            }
        }

        if(play == null){
            play = {uID: msg.member.id, pWins: 0, aWins: 0, turns: 0}
            plays.push(play);
            index = plays.length-1;
        }

        var a = -1;
        var e  = Math.floor(Math.random() * 3);

        if(msg.content.toUpperCase().includes("SCISSORS")){
            a = 0;
        }
        else if(msg.content.toUpperCase().includes("ROCK")){
            a = 1;
        }
        else if(msg.content.toUpperCase().includes("PAPER")){
            a = 2;
        }

        if(a == -1){
            return;
        }

        if(e == 0){
            msg.channel.send("Scissors");

            switch(a){
                case(0):
                break;
                case(1):
                plays[index].pWins += 1;
                break;
                case(2):
                plays[index].aWins += 1;
                break;
            }
        }
        else if(e == 1){
            msg.channel.send("Rock");
            switch(a){
                case(0):
                plays[index].aWins += 1;
                break;
                case(1):
                break;
                case(2):
                plays[index].pWins += 1;
                break;
            }
        }
        else if(e == 2){
            msg.channel.send("Paper");
            switch(a){
                case(0):
                plays[index].pWins += 1;
                break;
                case(1):
                plays[index].aWins += 1;
                break;
                case(2):
                break;
            }
        }
        plays[index].turns += 1;

        if(plays[index].turns == 2){
            if(plays[index].pWins > plays[index].aWins){
                msg.channel.send("You won. You have earned your freedom.");
                plays.splice(index,1);
                win(msg.member.id);
                return;
            }
            else if(plays[index].aWins > plays[index].pWins){
                msg.channel.send("I won. Let's play another round.");
                plays[index].pWins = 0;
                plays[index].aWins = 0;
                plays[index].turns = 0;
                return;
            }
            else if(plays[index].aWins == plays[index].pWins){
                msg.channel.send("Its a draw. We're gonna play another round.")
                plays[index].pWins = 0;
                plays[index].aWins = 0;
                plays[index].turns = 0;
                return;
            }
        }
        msg.channel.send(plays[index].pWins + " : " + plays[index].aWins);
    }
})

client.on('voiceStateUpdate', (oldState, newState) => {

    if (oldState.member.user.bot) return;
    
    if(newState.channelID == chid){
        
        if(newState.member.id == "416230291489816578" || newState.member.id == "763379589183176735"){
            
            var channel = client.guilds.cache.get(guildID).channels.cache.get(oldState.channelID);
            oldState.member.voice.setChannel(channel);
            return;
        } 
        
        if(playing){
            return;
        }
        play();
        var id = 0;
        if(oldState.channelID != null){
            id = oldState.channelID;
        }
        var ids = [];

        oldState.member.roles.cache.forEach(role => ids.push(role.id));

        for(i = 0; i < ids.length; i++){
            switch(ids[i]){
                case('798522636837715979'):
                case('770992989291937834'):
                case('781235479764402247'):
                case('799265077826945034'):
                case('770399886637662268'):
                case('770282942290853928'):
                case('763383918069809174'):
                case('808245137641046036'):
                case('799265077826945034'):
                case('808332485137924116'):
                ids.splice(i,1);
            }
        }

        channelIDS.push({userID: oldState.member.id, chid: id, roleIDS: ids});
        client.channels.cache.get(textID).send(oldState.member.user.username + ", play rock-paper-scissors with me to earn your freedom.");
        newState.member.roles.add(newState.guild.roles.cache.get(roleID));
        for(i = 0; i < ids.length; i++){
            newState.member.roles.remove(newState.guild.roles.cache.get(ids[i]));
        }
        playing = true;
    }
    if(oldState.channelID == chid){
        var index = -1;
        for(i = 0; i < plays.length; i++){
            if(oldState.member.id == plays[i].uID){
                index = i;
            }
        }

        if(index != -1){
            win(newState.member.id);
        }
    }
})

function win(_USERID){
    for(i = 0; i < channelIDS.length; i++){
        if(channelIDS[i].userID == _USERID){

            var user = client.guilds.cache.get(guildID).members.cache.get(_USERID);
            user.roles.remove(client.guilds.cache.get(guildID).roles.cache.get(roleID));

            for(i1 = 0; i1 < channelIDS[i].roleIDS.length; i1++){
                user.roles.add(client.guilds.cache.get(guildID).roles.cache.get(channelIDS[i].roleIDS[i1]));
            }

            if(channelIDS[i].chid == 0){
                user.voice.kick();
                channelIDS.splice(i,1);
                return;
            }
            
            var channel = client.guilds.cache.get(guildID).channels.cache.get(channelIDS[i].chid);

            user.voice.setChannel(channel);
            channelIDS.splice(i,1);
        }
    }
}

client.login(token);
