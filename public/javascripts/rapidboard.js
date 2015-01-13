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
	
	var getThreadResult = function( idlist )
	{
		var result = [];
		for(var i=0; i<idlist.length; i++)
		{
			result.push(db.thread[idlist[i]]);
		}
		return result;
	}

	var getThread = function ( idlist, callback )
	{
		var request = [];
		for (var i=0; i<idlist.length; i++)
			if (db.thread[idlist[i]] == null)
				request.push(idlist[i]);

		if (request.length > 0)
		{
			sendJson('/api/thread',{list:request}, function(data){
				var list = data.list;
				for (var i=0; i<list.length; i++)
				{
					db.thread[request[i]] = list[i];
					db.thread[request[i]].id = request[i];
				}
				callback(getThreadResult(idlist));
			});
		}
		else
		{
			callback(getThreadResult(idlist));
		}
	}

	var getMessageList = function( id, callback )
	{
		$.get('/api/message/list?id='+id, callback);
	}
	
	var getMessageResult = function( idlist )
	{
		var result = [];
		for(var i=0; i<idlist.length; i++)
		{
			result.push(db.message[idlist[i]]);
		}
		return result;
	}

	var getMessage = function ( idlist, callback )
	{
		var request = [];
		for (var i=0; i<idlist.length; i++)
			if (db.message[idlist[i]] == null)
				request.push(idlist[i]);

		if (request.length > 0)
		{
			sendJson('/api/message',{list:request}, function(data){
				var list = data.list;
				for (var i=0; i<list.length; i++)
				{
					db.message[request[i]] = list[i];
					db.message[request[i]].id = request[i];
				}
				callback(getMessageResult(idlist));
			});
		}
		else
		{
			callback(getMessageResult(idlist));
		}
	}
	
	var db = {
		catName : [],
		thread : [],
		message : []
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
		
		/// Get a list of category names
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
			getThreadList(categoryId, start, end, function(data){getThread(data.list, callback)});
		},

		ThreadCreate: function(categoryId, threadTitle, firstMessage, callback)
		{
			sendJson('/api/thread/create', {category:categoryId, name:threadTitle, message:firstMessage}, function(data){
				if (data.thread!=0) 
				{
					db.thread[data.thread] = {name:threadTitle, firstMessage:firstMessage, messageCount:1, id:data.thread};
					callback(data);
				}
				else
				{
					alert('API: Failed to create your thread!');
				}
			});
		},

		ThreadInfo: function(threadId, callback)
		{
			getThread([threadId], function(data){
				var thread = data[0];
				callback(thread);
			})
		},

		MessageList: function(threadId, callback)
		{
			getMessageList(threadId, function(data){getMessage(data.list, callback)});
		},

		MessageCreate: function(threadId, message, callback)
		{
			sendJson('/api/message/create', {thread:threadId, message:message}, function(data){
				if (data.message != 0)
				{
					callback(data);
				}
				else
				{
					alert('API: Failed to create your message.')
				}
			})
		}

	}
	
});
