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
	
	public static Result getThreadName(int id)
	{
		return ok(api.getThreadName(id));
	}


	public static Result getThreadNames()
	{
		JsonNode json = request().body().asJson();
		JsonNode list = json.get("list");
		
		ObjectNode resultJson = Json.newObject();
		ArrayNode resultList = resultJson.putArray("list");
		
		for (JsonNode element : list)
		{
			resultList.add(api.getThreadName(element.asInt()));
		}
		
		//System.out.println("request = " + json);
		//System.out.println("response = " + resultJson);
		
		return ok(resultJson);
	}
	
}
