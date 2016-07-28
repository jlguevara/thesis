// get reference to first script tag

var headElements = document.head.children;
var firstScriptElement;

for (var i = 0; i < headElements.length; i++) {
    if (headElements[i].tagName == "SCRIPT") {
        firstScriptElement = headElements[i];
        break;
    }
}

parameters = getParametersByName(document.location.href);

var scriptTag = document.createElement('script');
scriptTag.setAttribute('src', "settings/" + parameters['settings']);
document.head.insertBefore(scriptTag, firstScriptElement.nextSibling);

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
