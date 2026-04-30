import { IMessage } from "./message";

export interface SendMessagePayload {
  message: string;
  roomId: string;
}
export type GetMessagesCallback = (messages: IMessage[]) => void;
