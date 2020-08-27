const mysql = require('mysql');
require('dotenv').config({path: '../.env'})
let Rcon = require('srcds-rcon');

process.env.IP_ARENA
process.env.RCON_ARENA

process.env.IP_PUBLIC
process.env.RCON_PUBLIC

process.env.IP_AWP
process.env.RCON_AWP

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

  publicP = {
    IP: process.env.IP_PUBLIC ,
    RCON: process.env.RCON_PUBLIC 
  }
  arenaP = {
      IP: process.env.IP_ARENA,
      RCON: process.env.RCON_ARENA
  }
  awpP = {
      IP: process.env.IP_AWP,
      RCON: process.env.RCON_ARENA
  }
  
  onlinePools = {
    public: publicP,
    arena: arenaP,
    awp: awpP
  }

module.exports.get_top = function (server) {
    let pool = pools[server];
    return new Promise((resolve, reject) => {
        if (pool) {
            pool.query(`SELECT name, value, kills, deaths, shoots, hits, playtime FROM lvl_base ORDER BY value DESC LIMIT 10`, function (error, results) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        } else reject('Unknown server');
    });
}

module.exports.get_online = function (serverArg) {
    let server = onlinePools[serverArg];

    return new Promise((resolve, reject) => {
    let rcon = Rcon({
        address: server.IP,
        password: server.RCON
    });
    rcon.connect().then(() => {
        return rcon.command('status').then(status => resolve(status))
        
    }).then(
        () => rcon.disconnect()
    ).catch(err => {
        console.log('caught', err);
        console.log(err.stack);
    });
})
}