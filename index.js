
const Discord = require('discord.js');
require('dotenv').config()
const { get_top } = require('./utils/database.js');
const { get_online } = require('./utils/database.js');
const { exec_cmd } = require('./utils/database.js');


const client = new Discord.Client();

client.once("ready", () => {
  console.log(`My name is ${client.user.username}`);
  client.user.setPresence({
    status: "dnd",
    activity: { name: 'with your life' }
  })
});



//discord bot
client.on('message', message => {
  console.log(message.author.username, ':', message.content);

  const prefix = "$";

  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  if (args.length > 3) {
    for (let i = 3; i < args.length; i++) {
      args[2] += ' ' + args[i];
      delete args[i];
    }
  }
  const cmd = args.shift().toLowerCase();
  if (cmd === "top") {
    if (args[0] == 'public' || args[0] == 'arena' || args[0] == 'awp') {

      get_top(args[0]).then(results => {
        console.log(results);
        const topEmbed = new Discord.MessageEmbed()
          .setColor('#33FFFF')
          .setTitle(`Топ 10 сервера ${args[0]}`)
        for (let i = 0; i < 10; i++) {
          topEmbed.addField(`1: ${results[i].name}: ${results[i].value} exp`, `KDR: ${parseFloat(results[i].kills / results[i].deaths).toFixed(2)}. accuracy: ${parseFloat((results[i].hits / results[i].shoots) * 100).toFixed(2)}% online: ${parseFloat(results[i].playtime / 60 / 60).toFixed(2)} hours`, false)
        }
        topEmbed.setTimestamp()
        topEmbed.setFooter('made by sadpeak', 'https://i.imgur.com/wSTFkRM.png');

        message.channel.send(topEmbed);



      }).catch(e => console.error(e));
    }
  }
  if (cmd === 'online') {
    if (args[0] == 'public' || args[0] == 'arena' || args[0] == 'awp') {
      get_online(args[0]).then(status => {
        let str = Array.from(status.match(/\s".*(["])\s/g));
        let steamid = Array.from(status.match(/STEAM_\d:\d:\d*/g));
        let curOnline = status.match(/players : \d+/).toString().split('players : ').pop();

        const onlineEmbed = new Discord.MessageEmbed()
          .setColor('#33FFFF')
          .setTitle(`онлайн на сервере ${args[0]} ${curOnline}/30`)

        for (let i = 0; i < curOnline; i++) {
          onlineEmbed.addField(`**` + str[i].replace(/["]/g, ' ') + `**\n`, steamid[i])
        }
        onlineEmbed.addField(`Текущая карта на сервере:`, `${status.match(/map     :\s.*/)}`);
        message.channel.send(onlineEmbed);
      }).catch(e => console.error(e));
    } else {
      message.channel.send('На сервере нет никого онлайн');
    }
  }


  if (cmd === 'cmd') {
    if (args[0] == 'public' || args[0] == 'arena' || args[0] == 'awp') {
      if ((message.author.id == '215418064412344321' || message.author.id == '334840965409931267')) {
        exec_cmd(args[0], args[1]).then(result => {
          message.channel.send(result);
        }).catch(e => console.error(e));

      }
      else {
        message.channel.send('You don\'t have permission for this command');
      }

    }
  }
  if (cmd == 'help') {
    message.channel.send("Используй $top [server] или $online [server]\nДоступные сервера на данный момент: public, arena, awp");
  }
})
client.login(process.env.TOKEN);