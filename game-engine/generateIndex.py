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
imagesDir = cwd + "/images"

for file in os.listdir(imagesDir):
    if not os.path.isdir(imagesDir + "/" + file):
        continue

    href = "engine.html?settings=" + file + ".json" 

    link = '<a href="' + href + '">' + file + '</a>'
    body += link + "\n"

body += "</body>\n"

result = header + body + "</html>"

file = open("index.html", 'w')
file.write(result)

