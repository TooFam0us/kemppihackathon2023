
const express = require('express');
const app =express();
const http=require('http');
const server= http.createServer(app);
const {Server}=require("socket.io");
const io =new Server(server,{maxHttpBufferSize:1e9});
const {MongoClient,GridFSBucket, ObjectId } = require('mongodb');

const { writeFile,createReadStream , createWriteStream} =require("fs");
const { log } = require('console');

//app.use(express.urlencoded({extended:false,limit:'2gb'}));



const url ='mongodb://127.0.0.1:27017'
const client= new MongoClient(url)
const dbname='chat';


app.use(express.static('modules'))
app.use(express.static('upload'))

app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/index.html');
});





async function main(){

	await client.connect();
	console.log('mongo connection');
	const db =client.db(dbname);
	const collection=db.collection('documents');
	const bucket = new GridFSBucket(db,{bucketName:'FileBucket' });


//	const res =await collection.find({}).toArray();
//	console.log(res)

	async function get_data(){
		const res =await collection.find({}).toArray();
		return res;
	}


app.get('/file',(req,res)=>{
	console.log(req.query);
	let fileId=req.query["Id"];
	//console.log(fileId);

	let find =new ObjectId(fileId)

	let fname;
	const cursor = bucket.find({_id:find});
	//cursor.forEach(doc => fname=doc["meatadata"]["Name"]);
	//cursor.forEach(doc => console.log(doc.metadata.Name));
	cursor.forEach((doc) => {
	fname=doc.metadata.Name;//this should npt be in for loop
	

	setTimeout(()=>{
	console.log(fname);
//		bucket.openDownloadStream(find).pipe(res).on("error",function(error){console.log(error);});
		let downloadStream = bucket.openDownloadStream(find);
downloadStream.on('data', (chunk) => {
    res.write(chunk);
  });

  downloadStream.on('error', (err) => {
	console.log(err);
    res.sendStatus(404);
  });

  downloadStream.on('end', () => {
    res.end();
  });
	},100);
	/*
	setTimeout(()=>{
		bucket.openDownloadStream(find).
		pipe(createWriteStream('./upload/'+"dl_"+fname));


	setTimeout(()=>{

		res.download('./upload/'+"dl_"+fname);
		console.log("timeoutover");

	},1000)


	},4000)
	*/
	
	});





	/*
	let fpath=`${__dirname}/upload/jklö.jpg`;
	console.log(req.query["Filetype"]);
	console.log(req.query);
	console.log(req.url);

	if(req.query.Filetype=='a'){
		res.download(fpath,"customfilenam,e.jpg");
	}
			
	if(req.query.Filetype=='b'){
		const rs=createReadStream("./upload/jklö.zip");
		res.setHeader('Content-Type', 'attachment;');
        res.setHeader('Content-Disposition', 'inline; filename="gamne.zip"');
		rs.pipe(res);

	}
	*/

});


	io.on('connection',(socket)=>{
	get_data().then(function(history){
	socket.emit('load',history);
	});

		socket.on('msg',(data)=>{
			collection.insertOne({messege:data});
			io.emit('msg',data);
		});

		socket.on('delete',(data)=>{
			const cursor = bucket.find({});
			cursor.forEach(doc => bucket.delete(doc._id));
			//cursor.forEach(doc => console.log(doc));
			//cursor.forEach(doc => console.log(doc._id));
			});

		socket.on("upload", (fileData, callback) => {
			console.log(fileData); // <Buffer 25 50 44 ...>




			writeFile("./upload/j_"+fileData["Name"], fileData["File"], (err) => {
				console.log(err);
				callback({ message: err ? "failure" : "success" });
			});

			createReadStream('./upload/j_'+fileData["Name"]).
				pipe(bucket.openUploadStream(fileData["Name"], {
				chunkSizeBytes: 1048576,
				metadata: { Category: fileData["Category"],Name:fileData["Name"]  }
			}))
		});


		/*
			createReadStream('./upload/jklö.jpg').
				pipe(bucket.openUploadStream('jklö', {
				chunkSizeBytes: 1048576,
				metadata: { field: 'jklö', value: 'test somethign' }
     }))
		*/




		//connection end
	});




	server.listen(3000,()=>{
		console.log('listening');
	});

}
main();
