package controllers;
import play.*;
import play.mvc.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import play.libs.Json;

import views.html.*;


public class WebApi extends Controller {

	static models.RapidBoardAPI api = new models.RapidBoard();

    public static Result index() {
        return ok("hi");
    }
	
	public static Result getCategoryList(int id, int top)
	{
		int[] res = api.getCategoryList(id,top);
	
		ObjectNode result = Json.newObject();
		ArrayNode array = result.putArray("list");
		for (int r : res)
		{
			array.add(r);
		}
		return ok(result);
	}
	
	public static Result getCategoryName(int id)
	{
		return ok(api.getCategoryName(id));
	}
	

	public static Result getCategoryNames()
	{
		JsonNode json = request().body().asJson();
		JsonNode list = json.get("list");
		
		ObjectNode resultJson = Json.newObject();
		ArrayNode resultList = resultJson.putArray("list");
		
		for (JsonNode element : list)
		{
			resultList.add(api.getCategoryName(element.asInt()));
		}
		
		//System.out.println("request = " + json);
		//System.out.println("response = " + resultJson);
		
		return ok(resultJson);
	}
	
	public static Result createCategory()
	{
		JsonNode json = request().body().asJson();
		JsonNode name = json.get("name");
		JsonNode parent = json.get("parent");
		ObjectNode resultJson = Json.newObject();
		resultJson.put("id", api.createCategory(name.asText(), parent.asInt()));
		return ok(resultJson);
	}
	
	public static Result getThreadList(int id, int start, int end)
	{
		int[] list = api.getThreadList(id, start, end);
		ObjectNode result = Json.newObject();
		ArrayNode array = result.putArray("list");
		if (list != null)
		for (int item : list)
		{
			array.add(item);
		}
		return ok(result);
	}
	
	public static Result getThread(int id)
	{
		ObjectNode item = Json.newObject();
		item.put("name", api.getThreadName(id));
		item.put("firstMessage", api.getThreadFirstMessageBody(id));
		item.put("firstMessage", api.getThreadFirstMessageBody(id));
		item.put("messageCount", api.getThreadMessageCount(id, false));
		return ok(item);
	}


	public static Result getThreads()
	{
		JsonNode json = request().body().asJson();
		JsonNode list = json.get("list");
		
		ObjectNode resultJson = Json.newObject();
		ArrayNode array = resultJson.putArray("list");
		
		for (JsonNode element : list)
		{
			int id = element.asInt();
			ObjectNode item = Json.newObject();
			item.put("name", api.getThreadName(id));
			item.put("firstMessage", api.getThreadFirstMessageBody(id));
			item.put("messageCount", api.getThreadMessageCount(id, false));
			array.add(item);
		}
		
		//System.out.println("request = " + json);
		//System.out.println("response = " + resultJson);
		
		return ok(resultJson);
	}

	private static void sessionAuthor(int t, int a)
	{
		session("t"+t,Integer.toString(a));
	}

	private static int sessionAuthor(int t)
	{
		String val = session("t"+t);
		if (val == null) return 0;
		return Integer.parseInt(val);
	}

	public static Result createThread()
	{
		JsonNode json = request().body().asJson();

		int category = json.get("category").asInt();
		String name = json.get("name").asText();
		String message = json.get("message").asText(); 

		if (name.trim().length() == 0 || message.trim().length() == 0)
		{
			ObjectNode resultJson = Json.newObject();
			resultJson.put("thread", 0);
			return ok(resultJson);
		}

		int tid = api.createThread(category, name);
		int aid = api.allocateAuthor(tid);
		api.createMessage(tid,aid,message);

		ObjectNode resultJson = Json.newObject();
		resultJson.put("thread", tid);

		sessionAuthor(tid, aid);

		return ok(resultJson);
	}
	
	public static Result getMessageList(int id)
	{
		int[] list = api.getThreadMessageList(id);
		ObjectNode result = Json.newObject();
		ArrayNode array = result.putArray("list");
		if (list != null)
		for (int item : list)
		{
			array.add(item);
		}
		return ok(result);
	}

	public static Result getMessageCount(int id)
	{
		return ok();
	}

	public static Result getMessage(int id)
	{
		return ok();
	}

	public static Result getMessages()
	{
		return ok();
	}

	public static Result createMessage()
	{
		return ok();
	}


}
