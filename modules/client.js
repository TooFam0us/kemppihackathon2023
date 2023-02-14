var socket=io();


socket.on("load", (data) => {
	data.forEach(p => {
		var item = document.createElement("li");
		item.innerHTML=p.filename+"	"+p.metadata.Category+" "+p.uploadDate;
		var button = document.createElement("button");
		button.innerHTML= "Download";
		button.addEventListener('click', function() {httpGet("file","Id="+p._id)});
		item.appendChild(button);
		document.getElementById("listDownload").appendChild(item);
	});
});

document.getElementById("filterSubmit").addEventListener('click',function(){filter()});

function filter()
{
	var filterSel = document.getElementById("filtteri").value;
	var filterSel2 = document.getElementById("filtteri2").value;
	var filterBy = {Category:filterSel, Extention:filterSel2};
	document.getElementById("listDownload").replaceChildren();
	socket.emit("getWithFilter",filterBy);
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









