import os
import webbrowser


files_first_layer = [os.path.abspath("../" + x) for x in os.listdir("../")]

out = '<!DOCTYPE html><html lang="en"><head><link rel="shortcut icon" type="image/x-icon" href="Notability-icon.ico"/><meta charset="UTF-8"><script src="script.js" defer></script><link rel="stylesheet" href="style.css"><title>Notability</title></head>'
out += '<body><div class="row"><div class="column" id="leftColumn"><ul id="fileasFoldersUL"><li id="folderUp">◀</li>'

# add the files and folders from the first layer to the output string
for x in files_first_layer:
    basename = os.path.basename(x)
    if os.path.isfile(x):
        out += '<li class="file firstLayer" id=\"' + x + '\">' + basename + '</li>'
    else:
        out += '<li class="folder firstLayer" id=\"' + x + '\">' + basename + '</li>'

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
        out += '<li class="file" id=\"' + x + '\" style="display:none">' + basename + '</li>'
    else:
        out += '<li class="folder" id=\"' + x + '\" style="display:none">' + basename + '</li>'

# add the menu buttons
out += '<div id="functions">'
out += '<button id="closeOverview" title="Close overview">◀</button>'
out += '<button id="openOverview" hidden title="Open overview">▶</button>'
out += '<button id="newTab" title="Open in new Tab">New Tab</button>'
out += '<input type="search" id="searchInput" placeholder="Search" title="Search">'
out += '<button id="copyTitle" title="Copy Title">Title</button>'
out += '<button id="copyFilePath" title="Copy File Path">File Path</button>'
out += '<button id="copyFolderPath" title="Copy Folder Path">Folder Path</button>'
out += '</div></ul></div><div class="column" id="rightColumn">'
out += '<iframe src="about:blank" id="preview"></iframe>'
out += '</div></div></body></html>'

# UTF-8 encoding
with open('Notability.html', 'w', encoding='utf-8') as f:
    print(out, file=f)

# open the generated .html file in the browser
webbrowser.open(os.path.realpath("Notability.html"))
