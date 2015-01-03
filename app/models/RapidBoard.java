
package models;

import java.util.ArrayList;
import java.util.HashMap;

/*
 * In memory implementation of the RapidBoardAPI.
 */
public class RapidBoard implements RapidBoardAPI
{
	/* global list of objects, categoryID, threadID and messageID are directly
       applied to these arrays, ID of 0 represents null*/
	 
	ArrayList<Category> categoryList; 
	ArrayList<Thread> threadList;
	ArrayList<Message> messageList;
	
	public RapidBoard()
	{
		/* initialize the global lists */
		categoryList = new ArrayList<Category>();
		categoryList.add(new Category(0,"root",null)); 
		threadList = new ArrayList<Thread>();
		threadList.add(null); 
		messageList = new ArrayList<Message>();
		messageList.add(null); 
		
		/* dummy data */
		int news = createCategory("news",0);
		createCategory("cars",0);
		createCategory("computers",0);
		createCategory("political", news);
		createCategory("local", news);
		createCategory("global", news);
		createCategory("it", news);
	}

	public int createCategory(String Name, int parentID) 
	{ 
		int id = categoryList.size();
		if (parentID >= id) return 0;
		Category parent = categoryList.get(parentID);
		if (parent == null) return 0;
		//OK
		Category newcat = new Category(id, Name, parent);
		synchronized(categoryList)
		{
			categoryList.add(newcat);
			parent.addChild(newcat);
		}
		return id;
	}
	
	public int createCategory(String Name) 
	{
		return createCategory(Name,0);
	}
	
	public boolean deleteCategory(int categoryID) { 
		if (categoryID == 0 || categoryID >= categoryList.size() || 
			categoryList.get(categoryID) == null)
			return false;
		//OK
		synchronized(categoryList)
		{
			Category selected = categoryList.get(categoryID);
			categoryList.set(categoryID, null);
			selected.getParent().removeChild(selected);
		}
		return true;
	}
	
	private static int[] EMPTY_INT_LIST = new int[0];
	
	public int[] getCategoryList(int categoryID, int topCount, boolean latent) 
	{ 
		if (categoryID >= categoryList.size())
			return EMPTY_INT_LIST;
		
		Category selected = categoryList.get(categoryID);
		
		if (selected == null)
			return EMPTY_INT_LIST;
			
		return selected.getTopID(topCount);
		/* TODO latent */
	}
	
	public int[] getCategoryList(int categoryID, int top) 
	{ 
		return getCategoryList(categoryID, top, false);
	}
	
	public String getCategoryName(int categoryID) 
	{
		if (categoryID >= categoryList.size())
			return null;
			
		Category selected = categoryList.get(categoryID);
		return selected.getName();
	}
	
	public String[] getCategoryName(int[] categoryID) { 
		String[] result = new String[categoryID.length];
		for (int i=0; i<categoryID.length; i++)
		{
			result[i] = getCategoryName(categoryID[i]);
		}
		return result;
	}
	
	public int createThread(int categoryID, String name) { /* TODO */return 0;}
	public int deleteThread(int threadID) { /* TODO */return 0;}
	public String getThreadName(int threadID) { /* TODO */return null;}
	public String[] getThreadName(int threadID[]) { /* TODO */return null;}
	public String getThreadFirstMessageBody(int threadID) { /* TODO */return null;}
	public String[] getThreadFirstMessage(int threadID[]) { /* TODO */return null;}
	public int[] getThreadMessageList(int threadID, int start, int end) { /* TODO */return null;}
	public int[] getThreadMessageList(int threadID) { /* TODO */return null;}
	public int getThreadMessageCount(boolean latent) { /* TODO */return 0;}
	public int getThreadMessageCount() { /* TODO */return 0;}
	public int allocateAuthor() { /* TODO */return 0;}
	public int createMessage(int threadID, String body) { /* TODO */return 0;}
	public int getMessageAuthor(int messageID) { /* TODO */return 0;}
	public String getMessageBody(int messageID) { /* TODO */return null;}
	public int[] getMessageAuthor(int messageID[]) { /* TODO */return null;}
	
	public String[] getMessageBody(int messageID[])
	{ 
		return null;
	}
	
}