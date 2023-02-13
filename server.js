
const express = require('express');
const app =express();
const http=require('http');
const server= http.createServer(app);
const {Server}=require("socket.io");
const io =new Server(server);
const {MongoClient} = require('mongodb');

const url ='mongodb://127.0.0.1:27017'
const client= new MongoClient(url)
const dbname='chat';


app.use(express.static('modules'))
app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/index.html');
});


async function main(){

	console.log("abef");
	await client.connect();
	console.log('mongo connection');
	const db =client.db(dbname);
	const collection=db.collection('documents');


//	const res =await collection.find({}).toArray();
//	console.log(res)

	async function get_data(){
		const res =await collection.find({}).toArray();
		return res;
	}




	io.on('connection',(socket)=>{
	get_data().then(function(history){
	socket.emit('load',history);
	});

		socket.on('msg',(data)=>{
			collection.insertOne({messege:data});
			io.emit('msg',data);
		});
		socket.on('delete',(data)=>{
			get_data().then(function(messeges){
			for(let i=0;i<messeges.length;i++){
				collection.deleteOne(messeges[i]);
			}

			});
		});


		//connection end
	});




	server.listen(3000,()=>{
		console.log('listening');
	});

}
main();
