let leftColumn = document.getElementById("leftColumn");
let rightColumn = document.getElementById("rightColumn");

let listItems = document.getElementsByTagName("li");
let preview = document.getElementById("preview");
let folderUp = document.getElementById("folderUp");


// menu buttons
let functionsEle = document.getElementById("functions").childNodes;

let newTab = document.getElementById("newTab");
let searchInput = document.getElementById("searchInput");

let copyTitle = document.getElementById("copyTitle");
let copyFilePath = document.getElementById("copyFilePath");
let copyFolderPath = document.getElementById("copyFolderPath");
let currentTitle = undefined;
let currentFilePath = undefined;

let closeOverview = document.getElementById("closeOverview");
let openOverview = document.getElementById("openOverview");


// add an event listener to every file and folder
// folder: show the files inside of that folder
// files: previe the file with an iframe 
for (let i = 0; i < listItems.length; i++) {
    if (listItems[i].className.includes("folder")) {
        listItems[i].addEventListener("click", function () {
            showFolder(this.id);
        })
    } else if (listItems[i].className.includes("file")) {
        listItems[i].addEventListener("click", function () {
            preview.src = this.id;
            currentFilePath = this.id;
            currentTitle = this.textContent;
            document.title = this.textContent + " - Notability";
        })
    }
}
sortListItems();


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
    for (i = 0; i < visibleList.length; i++) {
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
    leftColumn.style.width = "0%";
    rightColumn.style.width = "100%";
    preview.style.borderLeft = "0";
    for (let i = 0; i < functionsEle.length; i++) {
        functionsEle[i].hidden = true;
    }
    openOverview.hidden = false;
})

// open the note overview and set the with of the current preview to 60%
openOverview.addEventListener("click", function () {
    leftColumn.style.width = "40%";
    rightColumn.style.width = "60%";
    preview.style.borderLeft = "1px solid #eee";
    for (let i = 0; i < functionsEle.length; i++) {
        functionsEle[i].hidden = false;
    }
    openOverview.hidden = true;
})