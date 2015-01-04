
var BreadCrumbWidget = function(target_element){

	var element = target_element;
	
	var breadItemClicked = function()
	{
		var val = Number(this.getAttribute('content'));
		var i = nav.length - 1;
		while (i>0 && nav[i] != val) {
			nav.pop();
			i--;
		}
		refresh();
		catmain();
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
		rb.CategoryNames(nav, function(data){
			var ul = document.createElement('div');
			ul.setAttribute('class','bread');
			
			heading = document.createElement('h1');
			heading.appendChild(generateBreadItem('rapidboard',nav[0]));
			ul.appendChild(heading);
			for (var i=1; i<data.length; i++)
			{
				var sep = document.createElement('span');
				sep.textContent = ' / ';
				sep.setAttribute('class', 'breadSep');
				ul.appendChild(sep);
				ul.appendChild(generateBreadItem(data[i],nav[i]));
			}
			removeChildren(element);
			element.appendChild(ul);
		});
	}

	return {
		Refresh : function ()
		{
			refresh();
		}
	}
}
