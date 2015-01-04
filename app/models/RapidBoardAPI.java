
package models;

public interface RapidBoardAPI{
	
	/* Categories (discussion topics) */ 
	
	/*
	 * Create a new category and return its id.
	 *
	 * Second parameter is optional. It specifies the parent category, in case
	 * we want to create a new subcategory we give the  ID of the parent
	 * category. Category ID 0 means the root category.
	 *
	 * The return value is the category ID of the new category. If creation
	 * failed then 0 is returned. 
	 */
	int createCategory(String Name, int parentID);
	int createCategory(String Name); /* parentID = 0 */
	
	boolean deleteCategory(int categoryID);
	
	/*
	 * Query for the list of categories.
	 *
	 * The first parameter is category ID. It will return the children of this
	 * category. To get the main categories from the root level, set it to 0.
	 *
	 * The second parameter specified how many categories do we want maximum. 
	 *
	 * The third specifies whether this request is from a int polling request
	 * meaning that it will only return if the result changes.
	 *
	 * The return value is the list of category IDs if the given category ID 
	 * exists, otherwise its null.
	 */
	int[] getCategoryList(int categoryID, int top, boolean latent);
	int[] getCategoryList(int categoryID, int top); /* latent = false */
	
	/*
	 * Return the name of a given category. The response for an existing
	 * category should never ever change. Null is returned if category does
	 * not exist.
	 */
	String getCategoryName(int categoryID); //cache
	/*
     * Returns the name of multiple categories at once.
	 * A vectorized version of the above. The parameter is a vector of
	 * category IDs and the result is a vector of category names.
	 * For each category that doesn't exist, null is returned.
	 */
	String[] getCategoryName(int[] categoryID); //vectorized cache

	
	/* Threads (discussion threads) */
	
	/*
	 * Creates a new thread and returns its ID.
	 * The first parameter is the ID of the category inside which we want to
	 * have this discussion thread.
	 * 0 is returned if creation failed.
	 */
	int createThread(int categoryID, String name);
	
	int[] getThreadList(int categoryID, int start, int end);
	
	int deleteThread(int threadID);
	
	/*
	 * Returns the name of a single thread. This does not change and can be
	 * cached. Null is returned if the thread doesn't exist.
	 */
	String getThreadName(int threadID); //cache
	/*
	 * Returns the name of multiple threads. The parameter is a vector of
	 * thread IDs and the result is a vector of thread names.
	 * For each thread that doesn't exist, null is returned.
	 */
	String[] getThreadName(int threadID[]); //vectorized cache
	/*
	 * Returns the body of the first message from a thread. This is used as a 
	 * description when listing the threads. The result can be cached as it
	 * never changes.
	 */
	String getThreadFirstMessageBody(int threadID); //cache
	/*
	 * Returns the first message of multiple threads. 
	 */
	String[] getThreadFirstMessage(int threadID[]); //vectorized cache
	/*
	 * Returns a range of message IDs. 
	 * The first parameter is the ID of the thread from which we want to find
	 * the list of messages. The second parameter is the index of the first 
	 * message. The third parameter is the index of the last message.
	 */
	int[] getThreadMessageList(int threadID, int start, int end);
	int[] getThreadMessageList(int threadID); /* start = 0, end = MAX value */
	
	/*
	 * Returns the number of messages from a thread. If the parameter is set
	 * to true, then this method is used in long polling mode and will only
	 * return once the number if messages in the thread changes.
	 */
	int getThreadMessageCount(int threadID, boolean latent);
	int getThreadMessageCount(int threadID); /* latent = false; */
	
	/*
	 * Allocates a local authorID for a thread.
	 */
	int allocateAuthor(int threadID);

	/*
	 * Creates a new message inside a thread.
	 */ 
	int createMessage(int threadID,int author, String body);
	
	int getMessageAuthor(int messageID); //cacheable
	String getMessageBody(int messageID); //cacheable
	int[] getMessageAuthor(int messageID[]); //vectorized cacheable
	String[] getMessageBody(int messageID[]); //vectorized cacheable
}