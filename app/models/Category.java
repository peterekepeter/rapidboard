
package models;

import java.util.ArrayList;

class Category
{
	private int id;
	private String name;
	private ArrayList<Category> children;
	private ArrayList<Thread> threads;
	private Category parent;
	
	public Category(int id, String name, Category parent)
	{
		this.id = id;
		this.name = name;
		this.parent = parent;
		children = new ArrayList<Category>();
		threads = new ArrayList<Thread>();
	}
	public void addChild(Category category)
	{
		children.add(category);
	}
	public void removeChild(Category category)
	{
		//TODO semaphore sync with remove
		children.remove(category);
	}
	public Category getParent()
	{
		return parent;
	}
	public int[] getTopID(int count)
	{
		//TODO semaphore sync with remove
		ArrayList<Category> list = children; //save list on stack...
		if (count > list.size())
		{
			count = list.size();
		}
		int[] array = new int[count];
	
		for (int i=0; i<count; i++)
		{
			array[i] = list.get(i).id;
		}
		
		return array;
	}
	public String getName()
	{
		return this.name;
	}
	public void addThread(Thread t)
	{
		threads.add(t);
	}
	public void removeThread(Thread t)
	{
		threads.remove(t);
	}
	public int getThreadCount()
	{
		return threads.size();
	}
	public Thread getThread(int index)
	{
		return threads.get(index);
	}
	
}
