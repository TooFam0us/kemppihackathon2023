var socket=io();


socket.on("load", (data) => {
	data.forEach(p => {
		var item = document.createElement("li");
		item.innerHTML="DownloadableFile1<button id='download'>Download</button>";
		item.addEventListener('click', function() {httpGet("file","Id="+p._id)});
		document.getElementById("listDownload").appendChild(item);
	});
});

// download2.addEventListener('click',function() {httpGet("file","Filetype=b&Id=63ea7fa64cf78b991d1ad822")});
// dl.addEventListener('click',function() {httpGet("file","Filetype=a&Id=63ea5e18a2464ed1b87bdf6b")});
// var download2 = document.getElementById('download2');
// var dl = document.getElementById('download');

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
  }









