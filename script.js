let leftColumn = document.getElementById("leftColumn");
let rightColumn = document.getElementById("rightColumn");
let resizeArea = document.getElementById("resizeArea");


// menu buttons
let viewList = document.getElementById("viewList");
let viewRecent = document.getElementById("viewRecent");
let viewFavourite = document.getElementById("viewFavourite");


let recentUL = document.getElementById("recentUL");
let favouriteUL = document.getElementById("favouriteUL");
let listUL = document.getElementById("listUL");

let listItems = listUL.children;
let preview = document.getElementById("preview");
let folderUp = document.getElementById("folderUp");

// function buttons
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


// menu view buttons
viewList.addEventListener("click", function () {
    listUL.classList.add("visible");
    recentUL.classList.remove("visible");
    favouriteUL.classList.remove("visible");
});

viewRecent.addEventListener("click", function () {
    listUL.classList.remove("visible");
    recentUL.classList.add("visible");
    favouriteUL.classList.remove("visible");
});

viewFavourite.addEventListener("click", function () {
    listUL.classList.remove("visible");
    recentUL.classList.remove("visible");
    favouriteUL.classList.add("visible");
});


// add an event listener to every file and folder
// folder: show the files inside of that folder
// files: preview the file with an iframe 
for (let i = 0; i < listItems.length; i++) {
    if (listItems[i].classList.contains("folder")) {
        listItems[i].addEventListener("click", function () {
            showFolder(this.id);
        })
    } else if (listItems[i].classList.contains("file")) {
        listItems[i].addEventListener("click", fileClickEvent);
    }
}
sortListItems();

// onClick event for the file list items
function fileClickEvent(e) {
    if (e.ctrlKey) {
        // ctrl + click -> open file in new tab
        window.open(this.id, '_blank');
    } else {
        setPreview(this);


        // ------------------
        // add clicked notes to the recent notes list

        // clone the clicked note
        let listItemCopy = this.cloneNode(true);
        listItemCopy.addEventListener("click", fileClickEvent);
        listItemCopy.style.display = "block";

        // check if item is already in recent list -> remove
        for (let i = 0; i < recentUL.children.length; i++) {
            if (this.id == recentUL.children[i].id) {
                recentUL.removeChild(recentUL.children[i]);
            }
        }

        // if there are more than 15 notes in the recent notes list -> remove last item
        // (+1) for the "Recent Notes" header
        if (recentUL.children.length >= 15 + 1) {
            recentUL.removeChild(recentUL.lastChild);
        }

        // insert the clicked note after the "Recent Notes" item
        recentUL.insertBefore(listItemCopy, recentUL.firstElementChild.nextSibling);


        // get alle elements of the recent notes list -> store in array
        let recentULElementsString = "";
        for (let i = 1; i < recentUL.children.length; i++) {
            recentULElementsString += recentUL.children[i].outerHTML;
            if (i < recentUL.children.length - 1) {
                recentULElementsString += "";
            }
        }
        // save recent notes array into local storage
        saveStorage("recentNotes", recentULElementsString);
    }
}


function setPreview(listItem) {
    preview.src = listItem.id;
    currentFilePath = listItem.id;
    currentTitle = listItem.textContent;
    document.title = listItem.textContent + " - Notability";

    let windowHref = window.location.href.split("#");
    let noteFolder = listItem.id.split("\\")[listItem.id.split("\\").length - 2];
    let noteFolderPossible = false;
    for (let i = 0; i < listItems.length; i++) {
        let listItemClass = listItems[i].classList;
        if (listItemClass != null && listItemClass.item(0) == "folder" && listItems[i].textContent.trim().slice(3) == noteFolder) {
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
        if (listItems[j].classList.contains("firstLayer")) {
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
    console.log(filter);
    // if (filter == "") {
    //     showFirstLayer();
    //     return;
    // }

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
            if (listItems[i].classList.contains("file")) {
                filesLi.push(listItems[i]);
            } else if (listItems[i].classList.contains("folder")) {
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
        // get the date from the filename
        let aDate = a.innerText.substring(a.innerText.length - 14, a.innerText.length - 4);
        let bDate = b.innerText.substring(b.innerText.length - 14, b.innerText.length - 4);

        aDate = aDate.split(".");
        aDate = new Date(aDate[2], aDate[1], aDate[0]);
        bDate = bDate.split(".");
        bDate = new Date(bDate[2], bDate[1], bDate[0]);

        // check if a and b are actually valid dates
        if (!isNaN(aDate.valueOf()) && !isNaN(bDate.valueOf())) {
            // return 1 if the date is nearer to the current date; else return -1 
            return ((aDate > bDate) ? 1 : -1);
        } else {
            return 0;
        }
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
    functionsDiv.style.borderTop = "2px solid var(--color-5)";
    functionsDiv.style.backgroundColor = "var(--color-1)";
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

    let recentNotes = getStorage("recentNotes");
    if (recentNotes != null) {
        recentNotes = recentNotes.split("");
        for (let i = 0; i < recentNotes.length; i++) {
            let frag = document.createRange().createContextualFragment(recentNotes[i]).firstChild;
            frag.addEventListener("click", fileClickEvent);
            recentUL.appendChild(frag);
        }
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
        note = replaceSpecialUrlCharacter(note);
        note = note.replace("/", "\\");
        for (let i = 0; i < listItems.length; i++) {
            let listItemId = listItems[i].id;

            // replacing special umlaute (Combining Diaeresis; "U+0308")
            listItemId = listItemId.replaceAll("Ü", "Ü");
            listItemId = listItemId.replaceAll("ü", "ü");
            listItemId = listItemId.replaceAll("Ä", "Ä");
            listItemId = listItemId.replaceAll("ä", "ä");
            listItemId = listItemId.replaceAll("Ö", "Ö");
            listItemId = listItemId.replaceAll("ö", "ö");

            if (listItemId.includes(note)) {
                setPreview(listItems[i]);
                showFolder(listItems[i].id.substring(0, listItems[i].id.lastIndexOf("\\")));
            }
        }
    }
})

function replaceSpecialUrlCharacter(input) {
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