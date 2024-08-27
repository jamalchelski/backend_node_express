let mysql = require('mysql');

let conn = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'admin123',
    database:'db_backend'
});

conn.connect(function(error){
    if(!!error){
        console.log(error)
    }else{
        console.log('Connection success')
    }
})

module.exports = conn;