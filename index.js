require('dotenv').config()
const Discord = require('discord.js');
const mysql = require('mysql');

//SELECT name, value FROM lvl_base ORDER BY value DESC LIMIT 10

//databases

const client = new Discord.Client();

client.once("ready", () => {
    console.log(`My name is ${client.user.username}`);
    client.user.setPresence({
        status: "dnd",
        activity: {name: 'with your life'}
    })
});

console.log(process.env.DB_HOST);
let publicPool = mysql.createPool({
  host     : process.env.DB_HOST_PUBLIC,
  user     : process.env.DB_USER_PUBLIC,
  port	   : process.env.DB_PORT_PUBLIC,
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

pools = {
    public: publicPool,
    arena: arenaPool
};


publicPool.getConnection(function(err, connection) {
  if (err) throw err; // not connected!
 
  // Use the connection
  connection.query('SELECT name, value FROM lvl_base ORDER BY value DESC LIMIT 10', function (error, results, fields) {
    // When done with the connection, release it.
    console.log(results);
    connection.release();
 
    // Handle error after the release.
    if (error) throw error;
 
    // Don't use the connection here, it has been returned to the pool.
  });
});




//discord bot
client.on('message', message => {
	console.log(message.author.username,':',message.content);
	if (message.content === '$ping') {
	// send back "Pong." to the channel the message was sent in
	message.channel.send('Pong.');
}

});
client.login(process.env.TOKEN);


