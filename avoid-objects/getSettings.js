/*
 * get a map of the query string
 */
function getParametersByName(url) {
    if (!url) return {};

    keyvalues = url.split('?');
    if (keyvalues.length != 2)
        return {}

    keyValueLst = keyvalues[1].split("&");
    result = {};

    for (var i = 0; i < keyValueLst.length; i++) {
        var lst = keyValueLst[i].split('=');
        if (lst.length != 2)
            continue;
        result[lst[0]] = lst[1];
    }
    
    return result;
}

// setup variables to create an ajax request for the settings file
var params = getParametersByName(document.location.href);
var myLocation = document.location
var protocol = location.protocol;
var host = location.host;
var pathname = location.pathname;
var settingsFile = protocol + "//" + host + pathname + "settings/" + params['settings'];

// variable that will hold settings object
var settings = null;

var request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
        settings = JSON.parse(request.responseText);
    }
};
request.open("GET", settingsFile); 
request.send();




/*

var headElements = document.head.children;
var firstScriptElement;

for (var i = 0; i < headElements.length; i++) {
    if (headElements[i].tagName == "SCRIPT") {
        firstScriptElement = headElements[i];
        break;
    }
}

var parameters = getParametersByName(document.location.href);

var scriptTag = document.createElement('script');
scriptTag.setAttribute('src', "settings/" + parameters['settings']);
document.head.insertBefore(scriptTag, firstScriptElement.nextSibling);
*/
