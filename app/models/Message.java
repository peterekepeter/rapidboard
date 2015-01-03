
package models;

/* 
 * non-mutable class, represents a single message from a thread 
 */
 
class Message
{
	private long author;
	private String body;
	
	public Message(long author, String body)
	{
		this.body = body;
		this.author = author;
	}
	
	public long getAuthor() 
	{ 
		return author; 
	}
	
	public String getBody() 
	{ 
		return body; 
	}
}
