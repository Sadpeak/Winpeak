require('dotenv').config()
const Discord = require('discord.js');
const mysql = require('mysql');


//databases

const client = new Discord.Client();

client.once("ready", () => {
    console.log(`My name is ${client.user.username}`);
    client.user.setPresence({
        status: "dnd",
        activity: {name: 'with your life'}
    })
});


let publicPool = mysql.createPool({
  host     : process.env.DB_HOST_PUBLIC,
  user     : process.env.DB_USER_PUBLIC,
  port     : process.env.DB_PORT_PUBLIC,
  password : process.env.DB_PASS_PUBLIC,
  database : process.env.DB_DATABASE_PUBLIC
});
let arenaPool = mysql.createPool({
  host     : process.env.DB_HOST_ARENA,
  user     : process.env.DB_USER_ARENA,
  port     : process.env.DB_PORT_ARENA,
  password : process.env.DB_PASS_ARENA,
  database : process.env.DB_DATABASE_ARENA
});
let awpPool = mysql.createPool({
  host     : process.env.DB_HOST_AWP,
  user     : process.env.DB_USER_AWP,
  port     : process.env.DB_PORT_AWP,
  password : process.env.DB_PASS_AWP,
  database : process.env.DB_DATABASE_AWP
});

pools = {
    public: publicPool,
    arena: arenaPool,
    awp: awpPool
};



//discord bot
client.on('message', message => {
    console.log(message.author.username,':',message.content);


    const prefix = "$";

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd === "top" && args[0] == 'public' || args[0] == 'arena' || args[0] == 'awp') {
        let pool = pools[args];

        pool.getConnection(function(err, connection) {
          if (err) throw err; 
         
          
          connection.query('SELECT name, value, kills, deaths, shoots, hits, playtime FROM lvl_base ORDER BY value DESC LIMIT 10', function (error, results, fields) {
                console.log(results);
                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#33FFFF')
                    .setTitle(`Топ 10 сервера ${args[0]}`)
                    .addField(`1: ${results[0].name}: ${results[0].value} exp`,`KDR: ${parseFloat(results[0].kills/results[0].deaths).toFixed(2)}. accuracy: ${parseFloat((results[0].hits/results[0].shoots)*100).toFixed(2)}% online: ${parseFloat(results[0].playtime/60/60).toFixed(2)} hours`, false)
                    .addField(`2: ${results[1].name}: ${results[1].value} exp`,`KDR: ${parseFloat(results[1].kills/results[1].deaths).toFixed(2)}. accuracy: ${parseFloat((results[1].hits/results[1].shoots)*100).toFixed(2)}% online: ${parseFloat(results[1].playtime/60/60).toFixed(2)} hours`, false)
                    .addField(`3: ${results[2].name}: ${results[1].value} exp`,`KDR: ${parseFloat(results[2].kills/results[2].deaths).toFixed(2)}. accuracy: ${parseFloat((results[2].hits/results[2].shoots)*100).toFixed(2)}% online: ${parseFloat(results[2].playtime/60/60).toFixed(2)} hours`, false)
                    .addField(`4: ${results[3].name}: ${results[1].value} exp`,`KDR: ${parseFloat(results[3].kills/results[3].deaths).toFixed(2)}. accuracy: ${parseFloat((results[3].hits/results[3].shoots)*100).toFixed(2)}% online: ${parseFloat(results[3].playtime/60/60).toFixed(2)} hours`, false)
                    .addField(`5: ${results[4].name}: ${results[1].value} exp`,`KDR: ${parseFloat(results[4].kills/results[4].deaths).toFixed(2)}. accuracy: ${parseFloat((results[4].hits/results[4].shoots)*100).toFixed(2)}% online: ${parseFloat(results[4].playtime/60/60).toFixed(2)} hours`, false)
                    .addField(`6: ${results[5].name}: ${results[1].value} exp`,`KDR: ${parseFloat(results[5].kills/results[5].deaths).toFixed(2)}. accuracy: ${parseFloat((results[5].hits/results[5].shoots)*100).toFixed(2)}% online: ${parseFloat(results[5].playtime/60/60).toFixed(2)} hours`, false)
                    .addField(`7: ${results[6].name}: ${results[1].value} exp`,`KDR: ${parseFloat(results[6].kills/results[6].deaths).toFixed(2)}. accuracy: ${parseFloat((results[6].hits/results[6].shoots)*100).toFixed(2)}% online: ${parseFloat(results[6].playtime/60/60).toFixed(2)} hours`, false)
                    .addField(`8: ${results[7].name}: ${results[1].value} exp`,`KDR: ${parseFloat(results[7].kills/results[7].deaths).toFixed(2)}. accuracy: ${parseFloat((results[7].hits/results[7].shoots)*100).toFixed(2)}% online: ${parseFloat(results[7].playtime/60/60).toFixed(2)} hours`, false)
                    .addField(`9: ${results[8].name}: ${results[1].value} exp`,`KDR: ${parseFloat(results[8].kills/results[8].deaths).toFixed(2)}. accuracy: ${parseFloat((results[8].hits/results[8].shoots)*100).toFixed(2)}% online: ${parseFloat(results[8].playtime/60/60).toFixed(2)} hours`, false)
                    .addField(`10: ${results[9].name}: ${results[1].value} exp`,`KDR: ${parseFloat(results[9].kills/results[9].deaths).toFixed(2)}. accuracy: ${parseFloat((results[9].hits/results[9].shoots)*100).toFixed(2)}% online: ${parseFloat(results[9].playtime/60/60).toFixed(2)} hours`, false)
                    .setTimestamp()
                    .setFooter('made by sadpeak', 'https://i.imgur.com/wSTFkRM.png');

                    message.channel.send(exampleEmbed);
                
          });
        });
    }
    else {
        message.channel.send("Используй $top [server]\nДоступные сервера на данный момент: public, arena, awp");
    }

});
client.login(process.env.TOKEN);


