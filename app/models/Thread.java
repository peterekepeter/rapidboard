
package models;

import java.util.ArrayList;

/* represents a single discussion thread */
class Thread
{
	private String title;
	private ArrayList<Message> messages;
	
	public Thread(String title, Message firstMessage)
	{
		this.title = title;
		messages = new ArrayList();
		messages.add(firstMessage);
	}
	
	public void post(Message message)
	{
		messages.add(message);
	}
	
	public String getTitle(){
		return title;
	}	
	
}