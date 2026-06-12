type ConversationType = "dm" | "group";

export interface IConversation {
  _id: string;
  type: ConversationType;
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
}
