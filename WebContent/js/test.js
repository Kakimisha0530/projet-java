function getJson()
{
	if (window.XMLHttpRequest === undefined)
	{
		window.XMLHttpRequest = function()
		{
			try
			{
				// Use the latest version of the ActiveX object if available
				return new ActiveXObject("Msxml2.XMLHTTP.6.0");
			}
			catch (e1)
			{
				try
				{
					// Otherwise fall back on an older version
					return new ActiveXObject("Msxml2.XMLHTTP.3.0");
				}
				catch(e2)
				{
					// Otherwise, throw an error
					throw new Error("XMLHttpRequest is not supported");
				}
			}
		};
	}
}

var getJSON = function(url, successHandler, errorHandler)
{
	var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	xhr.open('get', url, true);
	xhr.onreadystatechange = function()
	{
		var status;
		var data;
		// http://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
		if (xhr.readyState == 4)
		{
			// `DONE`
			status = xhr.status;
			if (status == 200)
			{
				data = JSON.parse(xhr.responseText);
				successHandler && successHandler(data);
			}
			else
			{
				errorHandler && errorHandler(status);
			}
		}
	};
	xhr.send();
};

getJSON('http://mathiasbynens.be/demo/ip', function(data)
{
	alert(JSON.stringify(data));
}); 