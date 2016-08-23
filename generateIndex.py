import os
import json

def getIconSrc(gameEngine, gameName):
    path = gameEngine + "/settings/" + gameName + ".json"
    print path
    f = open(path)
    settings = json.loads(f.read())
    imagesDir = gameEngine + "/images/" + gameName + "/" 

    if gameEngine == 'avoid-objects':
        iconSrc = imagesDir + settings['playerImage'] + ".png" 
    elif gameEngine == 'pop-objects':
        iconSrc = imagesDir + settings['goalImage'] + ".png"

    return iconSrc


header = """<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Games</title>
        <style>
        /*
            img {   width: 120px;
                    height: 120px;
            }
        */
        </style>
    </head>
    """

body = "<body>\n"


cwd = os.getcwd()
for engine in os.listdir(cwd):
    if not os.path.isdir(engine) or engine[0] == '.':
        continue

    body += "<h2>" + engine + "</h2>\n"

    imagesDir = engine + "/images"

    for dirName in os.listdir(imagesDir):
        gameImages = imagesDir + "/" + dirName
        if not os.path.isdir(gameImages):
            continue

        href = engine + "/?settings=" + dirName + ".json" 
        iconSrc = getIconSrc(engine, dirName)

        entry = '<p><a href="' + href + '">'  
        entry += '<img src="' + iconSrc + '" />' + dirName + '</a></p>'
        body += entry + "\n"

body += "</body>\n"

result = header + body + "</html>"

file = open("index.html", 'w')
file.write(result)

