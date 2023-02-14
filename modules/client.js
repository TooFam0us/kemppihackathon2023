var socket=io();

var dl = document.getElementById('download');
var download2 = document.getElementById('download2');
dl.addEventListener('click',function() {httpGet("file","Filetype=a&Id=63ea5e18a2464ed1b87bdf6b")});
download2.addEventListener('click',function() {httpGet("file","Filetype=b&Id=63ea7fa64cf78b991d1ad822")});

socket.on("load", (data) => {
	console.log(data);
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
  }









