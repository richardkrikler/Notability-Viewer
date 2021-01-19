let leftColumn = document.getElementById("leftColumn");
let rightColumn = document.getElementById("rightColumn");
let resizeArea = document.getElementById("resizeArea");

let listItems = document.getElementsByTagName("li");
let preview = document.getElementById("preview");
let folderUp = document.getElementById("folderUp");


// menu buttons
let functionsDiv = document.getElementById("functions");
let functionsEle = functionsDiv.childNodes;

let newTab = document.getElementById("newTab");
let newTabFile = document.getElementById("newTabFile");
let searchInput = document.getElementById("searchInput");

let copyTitle = document.getElementById("copyTitle");
let copyFilePath = document.getElementById("copyFilePath");
let copyFolderPath = document.getElementById("copyFolderPath");
let currentTitle = undefined;
let currentFilePath = undefined;

let closeOverview = document.getElementById("closeOverview");
let openOverview = document.getElementById("openOverview");

// set the width of the functions div to the width of the left column
function setFunctionsDivWidth() {
    functionsDiv.style.width = leftColumn.clientWidth + "px";
}
window.addEventListener("load", setFunctionsDivWidth);
window.addEventListener("resize", setFunctionsDivWidth);


// add an event listener to every file and folder
// folder: show the files inside of that folder
// files: previe the file with an iframe 
for (let i = 0; i < listItems.length; i++) {
    if (listItems[i].className.includes("folder")) {
        listItems[i].addEventListener("click", function () {
            showFolder(this.id);
        })
    } else if (listItems[i].className.includes("file")) {
        listItems[i].addEventListener("click", function (e) {
            if (e.ctrlKey) {
                // ctrl + click -> open file in new tab
                window.open(this.id, '_blank');
            } else {
                setPreview(this);
            }
        })
    }
}
sortListItems();

function setPreview(listItem) {
    preview.src = listItem.id;
    currentFilePath = listItem.id;
    currentTitle = listItem.textContent;
    document.title = listItem.textContent + " - Notability";

    let windowHref = window.location.href.split("#");
    let noteFolder = listItem.id.split("\\")[listItem.id.split("\\").length-2];
    let noteFolderPossible = false;
    for (let i = 0; i < listItems.length; i++) {
        let listItemClass = listItems[i].classList;
        if (listItemClass != null && listItemClass.item(0) == "folder" && listItems[i].textContent.trim() == noteFolder) {
            noteFolderPossible = true;
        }
    }
    if (!noteFolderPossible) {
        noteFolder = "";
    }

    window.location.href = windowHref[0] + "#" + noteFolder + "/" + listItem.textContent;
}


// show the elements of a folder
function showFolder(folderPath) {
    for (let j = 0; j < listItems.length; j++) {
        if (listItems[j].id.includes(folderPath)) {
            listItems[j].style.display = "block";
        } else {
            listItems[j].style.display = "none";
        }
    }
    folderUp.style.display = "block";
    searchInput.value = "";
    setFunctionsDivWidth();
    sortListItems();
}


// show the first layer of files and folders
function showFirstLayer() {
    for (let j = 0; j < listItems.length; j++) {
        if (listItems[j].className.includes("firstLayer")) {
            listItems[j].style.display = "block";
        } else {
            listItems[j].style.display = "none";
        }
    }
    folderUp.style.display = "block";
    sortListItems();
}


// go one folder up back to the first layer
folderUp.addEventListener("click", function () {
    showFirstLayer();
    searchInput.value = "";
})


// open the currently open note in a new browser tab
newTab.addEventListener("click", function () {
    window.open(window.location.href, '_blank');
})


// open the currently open note in a new browser tab (just the file)
newTabFile.addEventListener("click", function () {
    window.open(preview.src, '_blank');
})


// search in the currently visible elements
searchInput.addEventListener("keyup", function () {
    let filter = searchInput.value.toUpperCase();
    if (filter == "") {
        showFirstLayer();
        return;
    }

    let visibleList = [];
    for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].style.display != "none") {
            visibleList.push(listItems[i]);
        }
    }

    // Loop through all list items, and hide those who don't match the search query
    for (let i = 0; i < visibleList.length; i++) {
        let txtValue = visibleList[i].textContent || visibleList[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            visibleList[i].style.display = "";
        } else {
            visibleList[i].style.display = "none";
        }
        folderUp.style.display = "block";
    }

    sortListItems();
})


// sort the currently visible files and folders
// files are sorted after their date at the end of the filename (e.g. "...31.08.2020.pdf")
// folders are sorted alphabetically
function sortListItems() {
    let visibleList = [];
    let foldersLi = [];
    let filesLi = [];
    for (let i = 1; i < listItems.length; i++) {
        if (listItems[i].style.display != "none") {
            if (listItems[i].className.includes("file")) {
                filesLi.push(listItems[i]);
            } else if (listItems[i].className.includes("folder")) {
                foldersLi.push(listItems[i]);
            }
            visibleList.push(listItems[i]);
        }
    }

    // alphabetical sorting for folders
    foldersLi.sort(function (a, b) {
        if (a.innerText < b.innerText) {
            return -1;
        }
        if (a.innerText > b.innerText) {
            return 1;
        }
        return 0;
    })
    foldersLi.reverse();

    filesLi.sort(function (a, b) {
        let aDate = a.innerText.substring(a.innerText.length - 14, a.innerText.length - 4);
        let bDate = b.innerText.substring(b.innerText.length - 14, b.innerText.length - 4);
        if (aDate.charAt(2) == '.' && bDate.charAt(2) == '.') {
            aDate = aDate.split(".");
            bDate = bDate.split(".");

            // if the year of aDate is bigger than the year of bDate
            if (aDate[2] > bDate[2]) {
                return 1;
            }

            // if the year and the month of aDate is bigger than the year and the month of bDate
            if (aDate[2] >= bDate[2]) {
                if (aDate[1] > bDate[1]) {
                    return 1;
                }
            }

            // if the year, month and the day is of aDate is bigger than the year, month and day of bDate
            if (aDate[2] >= bDate[2]) {
                if (aDate[1] >= bDate[1]) {
                    if (aDate[0] > bDate[0]) {
                        return 1;
                    }
                }
            }

            return -1;
        }

        return 0;
    })


    for (let i = listItems.length - 1; i >= 0; --i) {
        for (let j = 0; j < visibleList.length; j++) {
            if (listItems[i] == visibleList[j]) {
                listItems[i].remove();
            }
        }
    }

    for (let i = 0; i < filesLi.length; i++) {
        listItems[1].parentNode.insertBefore(filesLi[i], listItems[1]);
    }

    for (let i = 0; i < foldersLi.length; i++) {
        listItems[1].parentNode.insertBefore(foldersLi[i], listItems[1]);
    }
}


// copy a given string into the clipboard
function copyStringToClipboard(str) {
    // generate a temporary element
    var el = document.createElement('input');
    // put the string that has to be copied into the element
    el.value = str;
    // set the element to an uneditable state and move it out of the window
    el.setAttribute('readonly', '');
    el.style = {
        position: 'absolute',
        left: '-9999px'
    };
    document.body.appendChild(el);
    // select the text inside of the element
    el.select();
    // copy the selected text into the clipboard
    document.execCommand('copy');
    // delete temporary element
    document.body.removeChild(el);
}

// copy the title of the currently open note into the clipboard
copyTitle.addEventListener("click", function () {
    copyStringToClipboard(currentTitle);
})

// copy the full file path of the currently open note into the clipboard
copyFilePath.addEventListener("click", function () {
    copyStringToClipboard(currentFilePath);
})

// copy the folder path of the currently open note into the clipboard
copyFolderPath.addEventListener("click", function () {
    copyStringToClipboard(currentFilePath.substring(0, currentFilePath.lastIndexOf("\\")));
})


// close the note overview and set the with of the current preview to 100%
closeOverview.addEventListener("click", function () {
    leftColumn.style.display = "none";
    resizeArea.style.display = "none";
    functionsDiv.style.borderTop = "none";
    functionsDiv.style.backgroundColor = "unset";
    for (let i = 0; i < functionsEle.length; i++) {
        functionsEle[i].hidden = true;
    }
    openOverview.hidden = false;
})

// open the note overview and set the with of the current preview to 60%
openOverview.addEventListener("click", function () {
    leftColumn.style.display = "block";
    resizeArea.style.display = "block";
    functionsDiv.style.borderTop = "1px solid var(--main-color-3)";
    functionsDiv.style.backgroundColor = "var(--main-color-1)";
    for (let i = 0; i < functionsEle.length; i++) {
        functionsEle[i].hidden = false;
    }
    openOverview.hidden = true;
})



// movable divider

let isMdResizeArea = 0;
resizeArea.addEventListener('mousedown', mdResizeArea);

// if the mouse is down on the resize area div call mdResizeArea
function mdResizeArea() {
    isMdResizeArea = 1;

    // make the left column unselectable during the resize phase
    leftColumn.classList.add("unselectable");

    // make no interaction in the iframe for the preview possible during the resize phase
    preview.style.pointerEvents = "none";

    document.body.addEventListener('mousemove', mVResizeArea);
    document.body.addEventListener('mouseup', endMmResizeArea);
}

// if the mouse is moved during the time that the mouse is down on the resize area call mVResizeArea
function mVResizeArea(event) {
    if (isMdResizeArea === 1) {
        // change the width of the functionsDiv and the leftColumn to the position of the mouse
        functionsDiv.style.width = event.clientX + "px";
        leftColumn.style.flexBasis = event.clientX + "px";
    } else {
        endMmResizeArea();
    }
}

// if the mouse is up again rest the mouse down state, remove the added event listeners,
// remove the unselectable state of the left column, make the iframe usable again
function endMmResizeArea() {
    isMdResizeArea = 0;
    document.body.removeEventListener('mouseup', endMmResizeArea);
    resizeArea.removeEventListener('mousemove', mVResizeArea);
    leftColumn.classList.remove("unselectable");
    preview.style.pointerEvents = "unset";
    saveStorage("resizePos", leftColumn.style.flexBasis);
}



// local storage

window.addEventListener("load", loadStorage);

function loadStorage() {
    let resizePos = getStorage("resizePos");
    if (resizePos != null) {
        leftColumn.style.flexBasis = resizePos;
        setFunctionsDivWidth();
    }
}

// get the value of the name in the local storage
function getStorage(name) {
    return localStorage.getItem(name);
}

// save to local storage
function saveStorage(name, value) {
    localStorage.setItem(name, value);
}



// current note in URL

window.addEventListener("load", function () {
    let note = window.location.href.split("#")[1];
    if (note != null) {
        note = replaceSpecialCharacter(note);
        note = note.replace("/", "\\");
        for (let i = 0; i < listItems.length; i++) {
            let listItemId = listItems[i].id;
            listItemId = listItemId.replaceAll("Ü", "Ü");
            listItemId = listItemId.replaceAll("ü", "ü");
            if (listItemId.includes(note)) {
                setPreview(listItems[i]);
                showFolder(listItems[i].id.substring(0,listItems[i].id.lastIndexOf("\\")));
            }
        }
    }
})

function replaceSpecialCharacter(input) {
    input = input.replaceAll("%20", " ");
    input = input.replaceAll("%C3%84", "Ä");
    input = input.replaceAll("A%CC%88", "Ä");
    input = input.replaceAll("%C3%96", "Ö");
    input = input.replaceAll("O%CC%88", "Ö");
    input = input.replaceAll("%C3%9C", "Ü");
    input = input.replaceAll("U%CC%88", "Ü");
    input = input.replaceAll("%C3%A4", "ä");
    input = input.replaceAll("a%CC%88", "ä");
    input = input.replaceAll("%C3%B6", "ö");
    input = input.replaceAll("o%CC%88", "ö");
    input = input.replaceAll("%C3%BC", "ü");
    input = input.replaceAll("u%CC%88", "ü");
    return input;
}