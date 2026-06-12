import { model, Schema } from "mongoose";
import { IConversation } from "../../types/conversation";

const conversationSchema = new Schema<IConversation>(
  {
    type: {
      type: String,
      enum: ["dm", "group"],
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export const ConversationModel = model<IConversation>(
  "Conversation",
  conversationSchema,
);
