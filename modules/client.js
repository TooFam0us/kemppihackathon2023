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
		button.addEventListener('click', function() {httpGet("file", "Id="+p._id)});
		column.append(name, category, date, button);
		row.appendChild(column);
		row.id = "listDownloads";
		document.getElementById("listDownload").appendChild(row)
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
	getRidOfChildren();
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

function getRidOfChildren()
{
	if(document.getElementById("listDownloads") && document.getElementById("listDownloads").childElementCount > 0)
		document.getElementById("listDownloads").forEach(p =>{replaceChildren()});
}


function upload(files, value, category) 
{
	socket.emit("upload", {File:files[0], Name:value, Category: category}, (status) => {
	  console.log(status);
	});
	getRidOfChildren();
	socket.emit("getData");

	
  }









