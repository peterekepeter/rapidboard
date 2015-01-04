
package models;

import java.util.ArrayList;

/* represents a single discussion thread */
class Thread
{
	private int id;
	private String name;
	private ArrayList<Message> messages;
	private Category parent;
	private int authorAllocator;
	
	public Thread(int id, String name, Category category)
	{
		this.id = id;
		this.name = name;
		this.parent = category;
		this.authorAllocator = 1; //start with id 1, 0 is nobody
		messages = new ArrayList();
	}
	
	public void addMessage(Message message)
	{
		messages.add(message);
	}
	
	public void removeMessage(Message message)
	{
		messages.remove(message);
	}
	
	public String getName(){
		return name;
	}	
	
	public int getId(){
		return id;
	}
	
	public Category getCategory()
	{
		return parent;
	}
	
	public Message getMessage(int index)
	{
		if (index<0 || index>=messages.size())
			return null;
		//ok
		return messages.get(index);
	}
	public int getMessageCount()
	{
		return messages.size();
	}
	public int allocateAuthor()
	{
		return authorAllocator++;
	}
	
}
