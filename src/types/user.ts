export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  lastSeen?: Date;
  avatar: string;
  bio: string;
  isOnline: boolean;
}
