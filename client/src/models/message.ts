export interface Message {
  id: number;
  senderId: string;
  senderUsername: string;
  senderPhotoUrl: string;
  recipientId: string;
  recipientUsername: string;
  recipientPhotoUrl: string;
  content: string;
  dateRead?: any;
  messageSent: any;
}

export interface Group {
  name: string;
  connections: Connection[];
}

export interface Connection {
  name: string;
  username: string;
}