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
         
          
          connection.query('SELECT name, value FROM lvl_base ORDER BY value DESC LIMIT 10', function (error, results, fields) {
            
                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Топ 10 сервера ${args[0]}`)
                    .addField(`1: ${results[0].name}`,`${results[0].value} exp`, false)
                    .addField(`2: ${results[1].name}`,`${results[1].value} exp`, false)
                    .addField(`3: ${results[2].name}`,`${results[2].value} exp`, false)
                    .addField(`4: ${results[3].name}`,`${results[3].value} exp`, false)
                    .addField(`5: ${results[4].name}`,`${results[4].value} exp`, false)
                    .addField(`6: ${results[5].name}`,`${results[5].value} exp`, false)
                    .addField(`7: ${results[6].name}`,`${results[6].value} exp`, false)
                    .addField(`8: ${results[7].name}`,`${results[7].value} exp`, false)
                    .addField(`9: ${results[8].name}`,`${results[8].value} exp`, false)
                    .addField(`10: ${results[9].name}`,`${results[9].value} exp`, false)
                    .setTimestamp()
                    .setFooter('made by sadpeak', 'https://i.imgur.com/wSTFkRM.png');

                    message.channel.send(exampleEmbed);
                
          });
        });
    }

});
client.login(process.env.TOKEN);


