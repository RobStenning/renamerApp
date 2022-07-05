# renamerApp

### Problem
renamerApp started as a fun personal project to explore node.js in more depth. I aimed to solve the problem of renaming many PDF's to match a particular
naming convention which follows an ISO standard (ISO 19650). You can read more about the specifics of this format here
[BIM Document Numbering](https://www.bimlead.co.uk/iso-19650-drawing-naming-templates-for-revit-archicad)


### Solution
The PDF documents are created in a 3D modeling software called Revit. These drawings are created within the program and then printed to PDF to create a
friendly format for the documents. Within the program is a list of all of the drawings with the associated drawing names and numbers. This list can be 
exported to a .txt format which I used to feed into my renamerApp.

### Process

The user sets the project code,  the .txt file location and the folder location of the PDF's which are to be renamed.

The project code is the first four or five alaphanumeric characters of the file name.
First the code breaks down the data in the .txt file and searches for the project code, with this code renamer stores the full drawing number in to an array.

The code then collects all of the current PDF names from the selected folder. These shorter numbers are stored into another array which can be compared to the
first array containing the full drawing numbers. If there is a match between the first and second array the code updates the short PDF number to match the full
drawing number.

### Electron

With the base functionality working I then set about creating a front end to allow the user friendly input and finally I used the Electron framework
to package the app in a desktop format.


renamerApp helped me succesfully rename hundreds of drawings in a fraction of the time it would take to manually rename the PDF's

### Example

On the right hand side is the app, bottom left is the .txt file and it's contents and top left is the folder location of the PDF's to be renamed.

<img src="renamerAppGIF.gif?raw=true" width="200px">
