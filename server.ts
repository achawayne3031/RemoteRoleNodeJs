
import { MarkAsRead } from './src/interface/MarkAsRead';
import { MessageBody } from './src/interface/MessageBody';
import { User } from './src/interface/User';
const socketController = require('./src/controller/socketController')
import { io, app, server, port } from './src/socket/Socket'




io.on('connection', (socket) => {
    // console.log('user connected', socket.handshake.query);

    //// Handle connected users 
    socket.on('connected', (data: User) => {
        socketController.connected(socket, data);
        socketController.getAllConnectedUsers()
    });


    /// Handle send messages 
    socket.on("send-message", (data: MessageBody) => {
        socketController.sendMessage(data)
    });

     /// Handle Get messages ///
     socket.on("get-message", (data: MarkAsRead) => {
        socketController.getMessage(data)
    });
   
     /// Handle Update Opened Notification messages ///
     socket.on("update-notification", (data: MarkAsRead) => {
        socketController.updateOpenedNotification(data)
    });
   

    

     // Handle disconnection ///
    socket.on('disconnect', async () => {
        await socketController.leaveRoom(socket)
        let currentUser = await socketController.getAllConnectedUsers()
    });


    // Listen for ping event from the client, keep the client connected
    socket.on('ping', () => {
        // Respond with a pong
        socketController.keepConnectionAlive()
    });

    socket.on('connected-user-list', () => {
        // Respond with a pong /////
        socketController.getAllConnectedUsers()
    });
 });




app.get('/', (req, res) => {
    res.send('Hello World! Happy new day and July 13 2024')
})


server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);  
});


// Improved graceful shutdown
function gracefulShutdown() {
  server.close(() => {
    socketController.serverShutDown()
      console.log('\nExpress server closed');
      // Ensure the queue stops before exiting the process
      process.exit(0)
  });
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);




