import { Server, Socket } from "socket.io";
import { MessageBody } from "../interface/MessageBody";
import { io } from './../socket/Socket'
import { User } from "../interface/User";
import { MarkAsRead } from "../interface/MarkAsRead";

var connectedUsers: User[] = [];

const socketController = {

    connected: async (socketInstance: Socket, data: User) => {

        let connectedAlready = !!connectedUsers.find((value) => value.email === data.email)

        if(!connectedAlready){
            let d = new Date()
            connectedUsers.push({
                name: data.name,
                email: data.email,
                phone: data.phone,
                socketId: socketInstance.id,
                socketKey: socketInstance.handshake.query.socketKey,
                active: true,
                loggedTime: d.toLocaleTimeString(),
                messages: [],
                notification: 0
            })
        }else{
            connectedUsers = connectedUsers.map((value) => {
                if(value.email == data.email){
                    value.active = true
                }
                return value;
            })
        }
        io.emit('emit-connected-user-list', connectedUsers);
    },


    sendMessage: async(messageBody: MessageBody) => {

        let connectedAlready = !!connectedUsers.find((value) => value.email === messageBody.to)
        if(connectedAlready){
            connectedUsers = connectedUsers.map((userData: User) => {
                if(userData.email == messageBody.to){
                    userData.messages.push(messageBody)
                }

                if(userData.email == messageBody.from){
                    let senderData = connectedUsers.find((value) => value.email === messageBody.from)
                    senderData.messages.push(messageBody)
                }
                    
                return userData
            })
        }

        io.emit("emit-sent-message", connectedUsers);
    },


    getMessage: async(data: MarkAsRead) => {
        connectedUsers = connectedUsers.map((userData: User) => {
            let userMessages = userData.messages;
            userMessages.map((innerMessage) => {
                if(innerMessage.to == data.to && innerMessage.from == data.from){
                    innerMessage.read = true
                }
                return innerMessage
            }) 
            return userData
        })

        io.emit("emit-get-message", connectedUsers);
    },

    updateOpenedNotification: async(data: MarkAsRead) => {
        connectedUsers = connectedUsers.map((userData: User) => {
            let userMessages = userData.messages;
            userMessages.map((innerMessage) => {
                if(innerMessage.to == data.to && innerMessage.from == data.from){
                    innerMessage.read = true
                }
                return innerMessage
            }) 
            return userData
        })

        io.emit("emit-opened-notification", connectedUsers);
    },

    

    leaveRoom: async (socketInstance: Socket) => {
        let d = new Date()
        connectedUsers = connectedUsers.map((value) => {
            if(value.socketKey == socketInstance.handshake.query.socketKey){
                value.active = false,
                value.loggedTime = d.toLocaleTimeString()
            }
            return value;
        })  
        io.emit("emit-active-users", connectedUsers);
    },

    keepConnectionAlive: async () => {
        // emit Pong to client, to keep connection alive
        io.emit('pong', 'Pong from server');
    },

    getAllConnectedUsers() {
        io.emit('emit-connected-user-list', connectedUsers);
    },
    
    getAllActiveUsers: async (socketInstance: Socket) => {
     //   socketInstance.emit('emit-active-user-list', activeUsersList);
    }

}



module.exports = socketController
