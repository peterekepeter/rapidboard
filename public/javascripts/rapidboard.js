//requires jQuery

var Rapidboard = (function(){
	
	var sendJson = function(url, obj, callback)
	{
		$.ajax({
			url: url,
			type: 'POST',
			data: JSON.stringify(obj),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			success: callback
		});
	}
	
	var getCatList = function (id, top, callback)
	{
		$.get('/api/category/list?id='+id+'&top='+top, callback);
	}
	
	var getCatNames = function(idlist, callback)
	{
		var request = [];
		
		for (var i=0; i<idlist.length; i++)
		{
			var item = idlist[i];
			if (db.catName[item] == null)
			{
				request.push(item);
			}
		}
		
		//request for new names
		if (request.length > 0)
		{
			sendJson('/api/category/name',{list:request},function(data){
				var list = data.list;
				for (var i=0; i<list.length; i++)
				{
					db.catName[request[i]] = list[i];
				}
				
				//build result
				var result = [];
				for(var i=0; i<idlist.length; i++)
				{
					result.push(db.catName[idlist[i]]);
				}
				callback(result);
			});
		}
		else
		{
			//build result
			var result = [];
			for(var i=0; i<idlist.length; i++)
			{
				result.push(db.catName[idlist[i]]);
			}
			callback(result);
		}
	}
	
	var getThreadList = function( id, start, end, callback )
	{
		$.get('/api/thread/list?id='+id+'&start='+start+'&end='+end, callback);
	}
	
	var getThreadNames = function ( idlist, callback)
	{
		var request = [];
		for (var i=0; i<idlist.length; i++)
			if (db.threadName[idlist[i]] == null)
				request.push(idlist[i]);
				
		
	}
	
	var db = {
		catName : [],
		threadName : []
	}
	
	var strcmp = function(a,b)
	{
		if ( a < b )
		  return -1;
		if ( a > b )
		  return 1;
		return 0;
	}
	
	return {
		
		/// get the list of categories and call the provided function with this list
		/// CategoryList(id,top,callback) 
		/// CategoryList(id,callback) - top defaults to 10
		/// CategoryList(callback) - calls for root (id=0)
		CategoryList : function (a,b,c)
		{
			//interpret variables
			var id,top,callback;
			if (b == null && c == null)
			{
				callback = a;
			}
			else if (c == null)
			{
				id = a;
				callback = b;
			}
			else
			{
				id = a;
				top = b;
				callback = c;
			}
			
			//default values
			if (id == null) id = 0;
			if (top == null) top = 10;
			
			//execution
			getCatList(id,top,function(data){
				var idlist = data.list;
				getCatNames(data.list,function(data){
					var namelist = data;
					var result = [];
					for (var i=0; i<idlist.length; i++)
					{
						result.push({id:idlist[i],name:namelist[i]});
					}
					callback(result);
				});
			});
		},
		
		CategoryNames: function(namelist, callback)
		{
			getCatNames(namelist,callback); 
		},
		
		CategoryCreate: function(name, parent, callback)
		{
			sendJson('/api/category/create',{name:name, parent:parent},function(data){
				db.catName[data.id] = name;	
				callback(data);
			})
		},
		
		ThreadList: function(categoryId, start, end, callback)
		{
			
		}
	}
	
});
