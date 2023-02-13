var socket=io();

var dl = document.getElementById('download');
var download2 = document.getElementById('download2');
dl.addEventListener('click',function() {httpGet("file","Filetype=a, Id=63ea5e18a2464ed1b87bdf6b")});
download2.addEventListener('click',function() {httpGet("file","Filetype=b")});


/*var inp=document.getElementById('buddon');
var txtinput=document.getElementById('txtibnpu');
var board=document.getElementById('messege_field');
var messegearea=document.getElementById("msgarea")
inp.addEventListener('click',func);
txtinput.addEventListener('keyup',(event)=>{

	if (event.key==="Enter"){
		func()
	}
});

document.getElementById('deletekey').addEventListener('click',deldata)

let isbottom=false;
function scroll(){
	if (isbottom){
	messegearea.scrollTo(0,messegearea.scrollHeight)
	}
}


function func(){
	socket.emit('msg',txtinput.value);
	txtinput.value="";
}
*/
function deldata(){
	socket.emit('delete','all');
}

function httpGet(theUrl, params)
{
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open("GET", theUrl +'?'+params); // true for asynchronous 
    xmlHttp.send();
	var iframe = document.createElement("iframe");
iframe.style.display = "none";
document.body.appendChild(iframe);
iframe.src = theUrl + "?" + params;
}
/*

socket.on('load',function(data){
	console.log(data);
	//forloop make paragraph fo every item in the arrayo
	for (let i =0;i<data.length;i++){
	//
	var item=document.createElement('p');
	var child =data[i];
	item.textContent=child['messege'];
	board.appendChild(item);
	scroll();
	}
});


socket.on('msg',function(data){
	if (messegearea.scrollHeight==messegearea.scrollTop+500){
		isbottom=true;
	}else{
		isbottom=false;
	}

	var item=document.createElement('p');
	item.textContent=data;
	board.appendChild(item);
	scroll();
});*/

let strippedFile;
let thefile;
function alertFilename(file)
{
	thefile = file;
	strippedFile = document.getElementById("fileInput").value.replace('C:\\fakepath\\', ' ');
}


  function upload(files, value, category) {
	socket.emit("upload", {File:files[0], Name:value, Category: category}, (status) => {
	  console.log(status);
	});
  }









