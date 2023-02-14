var socket=io();


socket.on("load", (data) => {
	data.forEach(p => {
		var row = document.createElement("tr"); 
		var column = document.createElement("td");
		var name = document.createTextNode(p.filename);
		var category = document.createTextNode(p.metadata.Category);
		var date = document.createTextNode(p.uploadDate);
		var button = document.createElement("button");
		button.innerHTML= "Download";
		button.addEventListerner('click', function() {httpGet("file", "Id="+p._id)});
		column.appendChild(name, category, date, button);
		row.appendChild(column);
	});
});

document.getElementById("filterSubmit").addEventListener('click',function(){filter()});

function filter()
{
	var filterSel = document.getElementById("filtteri").value;
	var filterSel2 = document.getElementById("filtteri2").value;
	console.log(filterSel2);
	let filter = {"metaData.Category":+filterSel, "metaData.Extention":filterSel2.toString()};
	console.log(filter);
	document.getElementById("listDownload").replaceChildren();
	socket.emit("getWithFilter",filter);
}

function deldata(){
	socket.emit('delete','all');
}

function httpGet(theUrl, params)
{
	let eul= theUrl+"?"+params;
	window.open(eul);
}

let strippedFile;
let thefile;
function alertFilename(file)
{
	thefile = file;
	strippedFile = document.getElementById("fileInput").value.replace('C:\\fakepath\\', ' ');
}


function upload(files, value, category) 
{
	socket.emit("upload", {File:files[0], Name:value, Category: category}, (status) => {
	  console.log(status);
	});
	document.getElementById("listDownload").replaceChildren();
	socket.emit("getData");

	
  }









