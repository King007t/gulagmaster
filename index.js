const discord = require("discord.js");
const client = new discord.Client();
const fs = require("fs");
var sounds = fs.readdirSync("./sounds");
//AudioStreams
var dispatcher = null;
var channel = null;
var playing = false;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

function play(){
    try{
        channel = client.channels.cache.get("806455732236320788");
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
        const sChannel = client.channels.cache.get("770399412647624705");
        sChannel.send("WHAT. THE. FUCK. How the fuck did you manage to get this message? This shouldn't even be possible.");
    }
}

client.on('voiceStateUpdate', (oldState, newState) => {

    if (oldState.member.user.bot) return;

    if(newState.channelID == "806455732236320788"){
        newState.member.roles.add(newState.guild.roles.cache.get("806462770982813707"));
        if(playing){
            return;
        }
        play();
        playing = true;
    }
})

client.login("ODA2NDcyMjU2NjExNTQ5MjE0.YBp70Q.Uk-4T3KSKnDGX0qmwBedI6udxTc");