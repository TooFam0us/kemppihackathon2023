var socket=io();


socket.on("load", (data) => {
	data.forEach(p => {
		var row = document.createElement("tr"); 
		//var column = document.createElement("td");
		var name = document.createElement("td");
		name.innerHTML = p.filename;
		var category = document.createElement("td");
		category.innerHTML = p.metadata.Category;
		var fileType = document.createElement("td");
		fileType.innerHTML = p.metadata.Extention;
		var date = document.createElement("td");
		date.innerHTML = p.uploadDate;
		var buttonData = document.createElement("td");
		var button = document.createElement("button");
		buttonData.innerHTML= "Download";
		buttonData.addEventListener('click', function() {httpGet("file", "Id="+p._id)});
		button.appendChild(buttonData);
		var buttonData2 = document.createElement("td");
		var button2 = document.createElement("button");
		buttonData2.innerHTML= "Delete";
		buttonData2.addEventListener('click', function() {deleteObj(p._id)});
		button2.appendChild(buttonData2);
		row.append(name, category, fileType, date, button, button2);
		row.className = "listDownloads";
		//row.appendChild(column);
		document.getElementById("listDownload").appendChild(row)
	});
});

document.getElementById("filterSubmit").addEventListener('click',function(){filter()});

function filter()
{
	var filterSel = document.getElementById("filtteri").value;
	var filterSel2 = document.getElementById("filtteri2").value;
	console.log(filterSel2);
	let filter = {"metadata.Category":filterSel.toString(), "metadata.Extention":filterSel2.toString()};
	console.log(filter);
	getRidOfChildren();
	socket.emit("getWithFilter",filter);
}

function deldata(){
	socket.emit('delete','all');
	getRidOfChildren();
	socket.emit("getData");
}

function httpGet(theUrl, params)
{
	let eul= theUrl+"?"+params;
	window.open(eul);
}

function deleteObj (params)
{
	socket.emit('delete', params);
	getRidOfChildren();
	socket.emit("getData");
}

let strippedFile;
let thefile;
function alertFilename(file)
{
	thefile = file;
	strippedFile = document.getElementById("fileInput").value.replace('C:\\fakepath\\', ' ');
}

function getRidOfChildren()
{
    const elements = document.getElementsByClassName("listDownloads");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}


function upload(files, value, category) 
{
	socket.emit("upload", {File:files[0], Name:value, Category: category}, (status) => {
	  console.log(status);
	});
	getRidOfChildren();
	socket.emit("getData");

	
  }









