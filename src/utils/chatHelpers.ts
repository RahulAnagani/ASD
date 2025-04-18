/**
 * Helper functions for chat-related operations
 */

/**
 * Check if a chat with a user already exists in the chat list
 * This checks both by ID and username for maximum reliability
 * 
 * @param chatList The current list of chats
 * @param userId The user ID to check for
 * @param username The username to check for (optional)
 * @returns boolean indicating if the chat exists
 */
export const doesChatExist = (
    chatList: any[], 
    userId: string, 
    username?: string
  ): boolean => {
    return chatList.some(chat => 
      chat.user._id === userId || 
      (username && chat.user.username.toLowerCase() === username.toLowerCase())
    );
  };
  
  /**
   * Find an existing chat in the chat list
   * 
   * @param chatList The current list of chats
   * @param userId The user ID to find
   * @param username The username to find (optional)
   * @returns The chat object if found, or null
   */
  export const findExistingChat = (
    chatList: any[],
    userId: string,
    username?: string
  ) => {
    return chatList.find(chat => 
      chat.user._id === userId || 
      (username && chat.user.username.toLowerCase() === username.toLowerCase())
    );
  };