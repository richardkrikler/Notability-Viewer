import os
import webbrowser


files_first_layer = [os.path.abspath("../" + x) for x in os.listdir("../")]

out = """<!DOCTYPE html>
<html lang="en">
<head>
<link rel="shortcut icon" type="image/x-icon" href="Notability-icon.ico"/>
<meta charset="UTF-8">
<script src="script.js" defer>
</script><link rel="stylesheet" href="style.css">
<title>Notability</title>
</head>
<body>
<div class="row">
<div class="column" id="leftColumn">
<div id="menu">
<button id="viewList">List</button>
<button id="viewRecent">Recent</button>
<button id="viewFavourite">Favourite</button>
</div>
<ul id="listUL" class="visible">
<li id="folderUp">◀</li>"""

# add the files and folders from the first layer to the output string
for x in files_first_layer:
    basename = os.path.basename(x)
    if os.path.isfile(x):
        out += '<li class="file firstLayer" id=\"' + x + '\">' + basename + '</li>'
    else:
        out += '<li class="folder firstLayer" id=\"' + x + '\">▶   ' + basename + '</li>'

# get all the files and folders of the folders from the first layer
files_path = []
for x in files_first_layer:
    if os.path.isdir(x):
        for j in os.listdir(x):
            files_path.append(x + os.path.sep + j)

# add the files of those folders
for x in files_path:
    basename = os.path.basename(x)
    if os.path.isfile(x):
        out += '<li class="file" id=\"' + x + \
            '\" style="display:none">' + basename + '</li>'
    else:
        out += '<li class="folder" id=\"' + x + \
            '\" style="display:none">▶   ' + basename + '</li>'

# add the menu buttons
out += """</ul>
<ul id="recentUL">
<li>Recent Notes</li></ul>
<ul id="favouriteUL">
<li>Favourite Notes</li></ul>
</div>
<div class="column" id="resizeArea"></div>
<div class="column" id="rightColumn">
<iframe src="about:blank" id="preview"></iframe>
</div>
</div><div id="functions">
<button id="closeOverview" title="Close overview">◀</button>
<button id="openOverview" hidden title="Open overview">▶</button>
<button id="newTab" title="Open in new Tab">New Tab</button>
<button id="newTabFile" title="Open File in new Tab">New Tab File</button>
<input type="search" id="searchInput" incremental placeholder="Search" title="Search">
<button id="copyTitle" title="Copy Title">Title</button>
<button id="copyFilePath" title="Copy File Path">File Path</button>
<button id="copyFolderPath" title="Copy Folder Path">Folder Path</button>
</div>
</body>
</html>"""

# UTF-8 encoding
with open("Notability.html", "w", encoding="utf-8") as f:
    print(out, file=f)

# open the generated .html file in the browser
webbrowser.open(os.path.realpath("Notability.html"))
