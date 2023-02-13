var socket=io();
var inp=document.getElementById('buddon');
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

function deldata(){
	socket.emit('delete','all');
	board.innerHTML="";
}


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
});






