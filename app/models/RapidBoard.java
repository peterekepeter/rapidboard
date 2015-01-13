
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
		
		/* dummy data for testing */
		int th = createThread(0, "Bug Reports!");
		int op;
		createMessage(th,allocateAuthor(th),"Post bug reports here!");
		th = createThread(0, "Feature Requests");
		createMessage(th,allocateAuthor(th),"Put your feature requests here!");
		th = createThread(0, "RapidBoard was Lauched!");
		createMessage(th,op = allocateAuthor(th),"Good news everyone! RapidBoard was lauched!.\nIt's a beautiful place where data can get deleted at any moment!");
		createMessage(th,op,"https://www.youtube.com/watch?v=xB_nKpEkILs");
		createMessage(th,op,"Testing URLs http://z0r.de/4789");
		
		createCategory("random",0);
		createCategory("interests",0);
		createCategory("creative",0);
		createCategory("political",0);
		createCategory("filesharing",0);
		
		
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
		int id = createCategory(Name,0);
		return id;
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
	
	public int createThread(int categoryID, String name) { 
		int id = threadList.size();
		if (categoryID >= categoryList.size()) { return 0; };
		Category cat = categoryList.get(categoryID);
		if (cat == null) { return 0; }
		//ok
		Thread t = new Thread(id,name,cat);
		cat.addThread(t);
		threadList.add(t);
		return id;
	}
	
	public int[] getThreadList(int categoryID, int start, int end)
	{
		if (start<end && categoryID >= categoryList.size()) return null;
		Category cat = categoryList.get(categoryID);
		int threadCount = cat.getThreadCount();
		if (start<0) start = 0;
		if (end>threadCount) end = threadCount;
		int count = end-start;
		if (count <= 0) return null;
		//ok
		int[] result = new int[count];
		for (int i=0; i<count; i++)
		{
			result[i] = cat.getThread(start+i).getId();
		}
		return result;
	}
	
	public int deleteThread(int threadID) { 
		if (threadID >= threadList.size()) return 0;
		Thread t = threadList.get(threadID);
		if (t == null) return 0;
		//ok
		t.getCategory().removeThread(t);
		threadList.set(threadID,null);
		return threadID;
	}
	
	public String getThreadName(int threadID) { 
		if (threadID >= threadList.size()) return null;
		Thread t = threadList.get(threadID);
		if (t == null) return null;
		return t.getName();
	}
	
	public String[] getThreadName(int threadID[]) { 
		String[] result = new String[threadID.length];
		for (int i=0; i<threadID.length; i++)
		{
			result[i] = getThreadName(threadID[i]);
		}
		return result;
	}
	
	public String getThreadFirstMessageBody(int threadID) { 
		if (threadID >= threadList.size()) return null;
		Thread t = threadList.get(threadID);
		if (t == null) return null;
		Message first = t.getMessage(0);
		if (first == null) return null;
		return first.getBody();
	}
	
	public String[] getThreadFirstMessage(int threadID[]) { 
		String[] result = new String[threadID.length];
		for (int i=0; i<threadID.length; i++)
		{
			result[i] = getThreadFirstMessageBody(threadID[i]);
		}
		return result;
	}
	
	public int[] getThreadMessageList(int threadID, int start, int end) {
		if (threadID >= threadList.size()) return null;
		Thread t = threadList.get(threadID);
		if (t == null) return null;
		//ok
		int count = end-start;
		int[] result = new int[count];
		for (int i=0; i<count; i++)
		{
			Message msg = t.getMessage(start + i);
			int val = 0;
			if (msg != null)
				val = msg.getId();
			result[i] = val; 
		}
		return result;
	}
	
	public int[] getThreadMessageList(int threadID) { 
		if (threadID >= threadList.size()) return null;
		Thread t = threadList.get(threadID);
		if (t == null) return null;
		//ok
		int count = t.getMessageCount();
		int[] result = new int[count];
		for (int i=0; i<count; i++)
		{
			Message msg = t.getMessage(i);
			int val = 0;
			if (msg != null)
				val = msg.getId();
			result[i] = val; 
		}
		return result;
	}
	
	public int getThreadMessageCount(int threadID, boolean latent) {
		//TODO latent
		if (threadID >= threadList.size()) return 0;
		Thread t = threadList.get(threadID);
		if (t == null) return 0;
		//ok 
		return t.getMessageCount();
	}
	
	public int getThreadMessageCount(int threadID) { 
		return getThreadMessageCount(threadID, false);
	}
	
	public int allocateAuthor(int threadID) { 
		if (threadID >= threadList.size()) return 0;
		Thread t = threadList.get(threadID);
		if (t == null) return 0;
		//ok 
		return t.allocateAuthor();
	}
	
	public int createMessage(int threadID, int author, String body) { 
		int id = messageList.size();
		if (threadID >= threadList.size()) return 0;
		Thread t = threadList.get(threadID);
		if (t == null) return 0;
		//ok

		Message m = new Message(id,author,body);
		t.addMessage(m);
		messageList.add(m);
		return id;
	}
	
	public int getMessageAuthor(int messageID) { 
		if (messageID < 0 || messageID >= messageList.size()) return 0;
		Message msg = messageList.get(messageID);
		if (msg == null) return 0;
		return msg.getAuthor();
	}
	
	public String getMessageBody(int messageID) {
		if (messageID < 0 || messageID >= messageList.size()) return null;
		Message msg = messageList.get(messageID);
		if (msg == null) return null;
		return msg.getBody();
	}
	
	public int[] getMessageAuthor(int messageID[]) 
	{ 
		int[] result = new int[messageID.length];
		for (int i=0; i<messageID.length; i++)
		{
			result[i] = getMessageAuthor(messageID[i]);
		}
		return result;
	}
	
	public String[] getMessageBody(int messageID[])
	{ 
		String[] result = new String[messageID.length];
		for (int i=0; i<messageID.length; i++)
		{
			result[i] = getMessageBody(messageID[i]);
		}
		return result;
	}
}