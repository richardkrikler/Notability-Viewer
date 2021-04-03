# Notability-Viewer
Notability Note Viewer for the Backup PDFs inside of a file system (e.g. with OneDrive integration in Windows).

![Overview of the Notability-Viewer](https://github.com/richardkrikler/Notability-Viewer/blob/master/images/Notability-Viewer.png?raw=true)


## Features
 - [x] Resizable menu (position stored in local storage)
 - [x] Folder & File name in URL (Example: "*/Notability-Viewer/Notability.html#Sonstiges/Quick%20Notes%20-%2024.07.2020.pdf")
 - Notes List
   - [x] List all Notes (PDF) from the Backup-Folder
   - [x] Sort Folders alphabetically
   - [x] Sort Files via the date at the end (if possible)
   - [x] Ctrl+Click -> Open File in new Tab
 - Recent Notes
   - [x] Display 15 recently viewed Notes (Newest first; `<li>` elements stored in local storage)
 - Favourite Notes
   - [ ] Display your favourite Notes (marked with star)
 - Functions
   - [x] Open / Close the menu
   - [x] New Tab: Open the File in a new Tab with Notability-Viewer
   - [x] New Tab File: Only open the File in a new Tab
   - [ ] Search-Box
   - [x] Title: Copy the Filename
   - [x] File Path: Copy the complete File-Path
   - [x] Folder Path: Copy the complete Folder-Path

## Installation
1. Clone the repository into the Notability Backup-Folder
2. Start "Notability-Viewer.py": the file "Notability.html" will be generated and automatically opendend in the preferred browser

### Additional:
3. Create a Desktop-Shortcut from "Notability-Viewer.py" and move it back into the repository-folder.
4. If you want, you can change the icon of the shortcut to the Notability-Icon.
5. To start the python file without a Python window opening, go into the file properties of the shortcut and add "pythonw.exe " in front of the target path. This also makes "6." possible.
6. Now you can Pin the shortcut to Start or put it into the taskbar.
![Start Menu - Taskbar](https://github.com/richardkrikler/Notability-Viewer/blob/master/images/Start-Taskbar.png?raw=true)