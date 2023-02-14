var socket=io();


socket.on("load", (data) => {
	data.forEach(p => {
		var item = document.createElement("li");
		item.innerHTML=p.filename;
		var button = document.createElement("button");
		button.innerHTML= "Download";
		button.addEventListener('click', function() {httpGet("file","Id="+p._id)});
		item.appendChild(button);
		document.getElementById("listDownload").appendChild(item);
	});
});


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









