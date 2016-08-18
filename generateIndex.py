import os

header = """<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Games</title>
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
        if not os.path.isdir(imagesDir + "/" + dirName):
            continue

        href = engine + "/?settings=" + dirName + ".json" 

        link = '<p><a href="' + href + '">' + dirName + '</a></p>'
        body += link + "\n"

body += "</body>\n"

result = header + body + "</html>"

file = open("index.html", 'w')
file.write(result)

