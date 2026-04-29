import { IMessage } from "./message";

export interface SendMessagePayload {
  message: string;
  username: string;
}
export type GetMessagesCallback = (messages: IMessage[]) => void;
