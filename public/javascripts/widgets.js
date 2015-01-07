
function removeChildren(element)
{
	while (element.firstChild)
		element.removeChild(element.firstChild);
}

/// 
/// This object is used for hierarhical navigation
/// When location changes, the list of functions is called from the lsitener
/// list.
///
var Navigator = function(rootlocation, listenerList)
{
	if (rootlocation == null)
		rootlocation = 0;
	var rootloc = rootlocation;
	var stack = [rootlocation];
	var listeners;
	if (listenerList != null)
		listeners = listenerList;
	else 
		listeners = [];
	
	var locationChanged = function()
	{
		for (var i=0; i<listeners.length; i++)
		{
			listeners[i]();
		}
	}
	
	return {
		Enter:function(node){
			stack.push(node);
			locationChanged();
		},
		Return:function(){
			var oldlocation = stack.pop();
			locationChanged();
			return oldlocation;
		},
		ReturnTo:function(desiredLocation)
		{
			var i = stack.length - 1;
			var loc = stack[i];
			while (i>0 && stack[i] != desiredLocation) {
				stack.pop();
				i--;
			}
			if (loc != stack[stack.length - 1])
				locationChanged();
		},
		Current:function(){
			return stack[stack.length - 1];
		},
		IsRoot:function()
		{
			return Top() == rootloc;
		},
		AsList:function()
		{
			return stack;
		},
		AddListener:function(callback)
		{
			listeners.push(callback);
		},
		Count:function()
		{
			return stack.length;
		}
	}
}


///
/// This object facilitates category navigation using html.
/// It uses a navigator object and the rapidboard api.
///
var CategoryWidget = function(targetElement, navigatorInstance, apiInstance)
{
	var nav = navigatorInstance;
	var api = apiInstance;
	var element = targetElement;
	var amount = 10;

	var categoryListItemClicked = function()
	{	
		amount = 10;
		nav.Enter(Number(this.getAttribute('content')));
	}
	
	var generateCategoryListItem = function (data)
	{
		var e = document.createElement('li');
		e.setAttribute('class','categoryListItem');
		e.setAttribute('content',data.id);
		e.textContent = data.name;
		e.onclick = categoryListItemClicked;
		return e;
	}

	var generateDefaultListItem = function(data)
	{
		var e = document.createElement('li');
		e.textContent = data;
		return e;
	}

	var generateList = function(array, itemGenerator)
	{
		var list = document.createElement('ul');
		list.setAttribute('class','categoryList');
		for (var i=0; i<array.length; i++)
		{
			list.appendChild(itemGenerator(array[i]));
		}
		return list;
	}

	var generateCategoryList = function(data)
	{
		var list = generateList(data,generateCategoryListItem);
		return list;
	}
	
	var refresh = function(){
		var current = nav.Current();
		//console.log(nav,current);
		api.CategoryList(current,amount,function(list){
			//console.log(list);
			var html = generateCategoryList(list);
			removeChildren(element);
			
			if (html.firstChild != null)
				element.appendChild(html);
			
			if (nav.Count() > 1)
			{
				var er = generateDefaultListItem('back');
				er.setAttribute('class', 'categoryListItem categoryListFunction');
				er.onclick = function(){ nav.Return(); };
				element.appendChild(er);
			}
			
			if (list.length<amount)
			{
				var en = generateDefaultListItem('new');
				en.setAttribute('class', 'categoryListItem categoryListFunction');
				en.onclick = function(){
					var form = document.createElement("form");
					form.setAttribute('class', 'categoryCreateForm');
					var inputname = document.createElement("input");
					inputname.setAttribute('class', 'categoryCreateInput');
					inputname.setAttribute('placeholder', 'type here');
					form.appendChild(inputname);
					form.onsubmit = function(event){
						var name = form.firstChild.value;
						if (name.length>0)
							api.CategoryCreate(name, nav.Current(), 
								function(data){nav.Enter(data.id)});
						else 
							refresh();
						return false;
					}
					this.textContent = null;
					this.appendChild(form);
					this.onclick=null;
					this.setAttribute('class', 'categoryListItemCreate'); 			
				};
				element.appendChild(en);
			}
			else
			{
				var em = generateDefaultListItem('more');
				em.setAttribute('class', 'categoryListItem categoryListFunction');
				em.onclick = function(){
					amount *= 2;
					refresh();
				}
				element.appendChild(em);
			}
			
		})
	}
	
	refresh(); //initial render
	
	return {
		Refresh : function(){
			refresh();
		}
	}
}

///
/// This object displays the navigator object using html
/// and also allows breadcrumb-like navigation.
///
var BreadCrumbWidget = function(targetElement, navigatorInstance, apiInstance)
{
	var nav = navigatorInstance;
	var api = apiInstance;

	var element = targetElement;
	
	var breadItemClicked = function()
	{
		var val = Number(this.getAttribute('content'));
		nav.ReturnTo(val);
	}
	
	var generateBreadItem = function(name, target)
	{
		var li = document.createElement('span');
		li.textContent = name;
		li.setAttribute('content',target);
		li.setAttribute('class','breadItem');
		li.onclick = breadItemClicked;
		return li;
	}
	
	var refresh = function()
	{
		var list = nav.AsList();
		api.CategoryNames(list, function(data){
			var ul = document.createElement('span');
			ul.setAttribute('class','bread');
			
			heading = document.createElement('h1');
			heading.appendChild(generateBreadItem('rapidboard',list[0]));
			ul.appendChild(heading);
			for (var i=1; i<data.length; i++)
			{
				var sep = document.createElement('span');
				sep.textContent = ' / ';
				sep.setAttribute('class', 'breadSep');
				ul.appendChild(sep);
				ul.appendChild(generateBreadItem(data[i],list[i]));
			}
			removeChildren(element);
			element.appendChild(ul);
		});
	}
	
	refresh(); //initial render

	return {
		Refresh : function ()
		{
			refresh();
		}
	}
}
