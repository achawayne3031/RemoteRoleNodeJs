import { MessageBody } from "./MessageBody"

export interface User{
    name: string
    phone: string,
    email: string,
    socketId: string,
    socketKey: any,
    active: boolean,
    loggedTime: Date | any
    messages: MessageBody[]
    notification: number
}