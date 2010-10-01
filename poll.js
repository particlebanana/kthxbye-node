// This is a poll/status report engine for Kthxbye 
// (http://github.com/plukevdh/kthxbye). It is meant to allow us to poll the 
// status of a job by id and once returned successfully, update a notification
// mechanism to notify the user of the result. 


var sys = require('sys'),
    http = require('http')
    io = require('./socket.io-node/lib/socket.io'),

    npm = require('npm'),
    redis = require('redis'),
    

    server = http.createServer(),

    redis_client = redis.createClient(6379, "itwebpriv1.hargray.org"),
    json = JSON.stringify

server.listen(8081)

// socket opens from rails.

var socket = io.listen(server)

// redis connection issue
redis_client.on("error", function(err) {
  console.log("Redis connection error to " + redis_client.host + ":" + redis_client.port + " - " + err)
})

// recieve a message from redis regarding a job, broadcast it to all listeners
redis_client.on("pmessage", function(pattern, channel, message) {
  console.log("Client channel " + channel + " got message: " + message)
  socket.broadcast(json({'status':channel, 'id':parseInt(message)}))
})

// subscribe to the job notification channels
redis_client.psubscribe('job.*')

socket.on("connection", function(client) { 
  //client.send("Connected to Kthxbye notification server to watch job")
})
