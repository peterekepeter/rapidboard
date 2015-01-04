
package models;

/* 
 * non-mutable class, represents a single message from a thread 
 */
 
class Message
{
	private int id;
	private int author;
	private String body;
	
	public Message(int id, int author, String body)
	{
		this.id = id;
		this.body = body;
		this.author = author;
	}
	
	public int getAuthor() 
	{ 
		return author; 
	}
	
	public String getBody() 
	{ 
		return body;
	}
	
	public int getId()
	{
		return id;
	}
}
