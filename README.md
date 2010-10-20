A Node.js polling engine for use with the Kthxbye gem
=====================================================

Uses [Socket.io](http://github.com/LearnBoost/Socket.IO) with [Node.js](http://github.com/ry/node) to poll job queues 
in [Redis](http://code.google.com/p/redis/) and update the UI with a job's status.

Uses the PUBLISH/SUBSCRIBE functionality of Redis to subscribe to job queues.

## Requires

- [Redis 2.0.1+](http://github.com/antirez/redis)
- [Socket.io-node](http://github.com/LearnBoost/Socket.IO-node)
- [kthxbye](http://github.com/plukevdh/kthxbye)

## Usage

Simple example function for use in client:

    function openSocket(job_id) {
      // Connect to socket.io
      var socket = new io.Socket('localhost', {port:8081}) 
      if(socket.connect()) {
        socket.on('message', function(data) {
          try {
            var status = JSON.parse(data)
          } catch (SyntaxError) {
            return false;
          }
    
          if(status.id != parseInt(job_id)) return false;

          if(status.status == 'job.failed') {
            failed()
          } else if(status.status == 'job.completed') {
            succeeded()
          } else if(status.status == 'job.started') {
            active()
          } else {
            alert('Unknown option! ' + status.status)
          }
          return false;
        })
      }
    }
