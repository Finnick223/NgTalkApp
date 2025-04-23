export interface ConversationMessage {
  id?: string;
  authorId: string;
  conversationId?: string;
  content: string;
  timestamp: Date;
}

export interface ConversationMessageWithFlag extends ConversationMessage {
  isSentByMe: boolean;
}
