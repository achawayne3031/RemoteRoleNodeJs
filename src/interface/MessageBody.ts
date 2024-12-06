
export interface MessageBody{
    from: string,
    to: string,
    message: string | BinaryType,
    timeAgo: Date | any,
    read: boolean
}