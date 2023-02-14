
const express = require('express');
const app =express();
const http=require('http');
const server= http.createServer(app);
const {Server}=require("socket.io");
const io =new Server(server,{maxHttpBufferSize:1e9});
const {MongoClient,GridFSBucket, ObjectId } = require('mongodb');
const { Readable } = require('stream');



const dbname='chat';
const mongodbUrl ='mongodb://127.0.0.1:27017'
const PORT = 3000;


const client= new MongoClient(mongodbUrl);
app.use(express.static('modules'))








// Get Request handler to serve index page
app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/index.html');
});



async function main(){

	await client.connect();
	console.log('mongo db has connected');
	const db =client.db(dbname);
	const collection=db.collection('documents');
	const bucket = new GridFSBucket(db,{bucketName:'FileBucket' });
	


	const cursor = bucket.find({}); 
	//cursor.forEach((doc) => {console.log(doc);})



	//Get Handler for File Download
	app.get('/file',(req,res)=>{
		console.log(req.query);
		let fileId=req.query["Id"];

		let find =new ObjectId(fileId)

		let fname;
		const cursor = bucket.find({_id:find});
		cursor.forEach((doc) => {
			fname=doc.filename;//this should npt be in for loop

			setTimeout(()=>{
				res.header('Content-Disposition', 'attachment; filename='+fname);
				bucket.openDownloadStream(find).pipe(res).on("error",function(error){console.log(error);});
			},100);
		});
	});




	//filter is what we need to find
	//sorter is the order that we want to find it in
	async function GetFilesWithFilters(filter){

		//let ext=filter.metadata.Extention;
		

		//filter is {} that should look like an obj
		//this filter SHOULD NOT HAVE the _id field
		const cursor = bucket.find(filter);
		//{"metadata.Category":"category"} values of keys should be strings


		return cursor.map(function(doc){return doc}).toArray();
	}


	//returns all data from db 
	async function GetAllBDData(){
		const cursor = bucket.find({});
		return cursor.map(function(doc){return doc}).toArray();
	}





	io.on('connection',(socket)=>{
		//this executes on connection to the server
		GetAllBDData().then((db )=>{ socket.emit('load',db); });


		socket.on('delete',(data)=>{
			console.log("delete gets: ",data);
			if (data=="all"){
				const cursor = bucket.find({});
				cursor.forEach(doc => bucket.delete(doc._id));
				return
			}

			let fileId=data;
			let find =new ObjectId(fileId)
			const cursor = bucket.find({_id:find});
			cursor.forEach(doc => bucket.delete(doc._id));

		});



		//Uploads file from the client to the servers database
		socket.on("upload", (fileData, callback) => {
			//console.log(fileData); // <Buffer 25 50 44 ...>

			var fileExt = fileData.Name.split('.').pop();

			const stream = Readable.from(fileData.File);
			stream.pipe(bucket.openUploadStream(fileData["Name"], {
				chunkSizeBytes: 1048576,

				metadata: { Category: fileData["Category"], Extention : fileExt  }
			}))
		});




		socket.on('getWithFilter',(data)=>{
			//change this to loop
			//if the entry is 0 remove it from the obj

			let FormattedFilter=data;
			//if the cat is 0 delete the entire thing from the obj.
			//if we search with the cat as 0 it will try to find one
			if(data["metadata.Category"]=='0'){
				delete FormattedFilter["metadata.Category"];
			}
			if (data["metadata.Extention"]=='0'){
				delete FormattedFilter["metadata.Extention"];
			}

			//console.log("after filtering the data is",FormattedFilter);

			//let FormattedFilter={metadata:{Category:data}};

			GetFilesWithFilters(FormattedFilter).then((db )=>{ console.log(db);io.emit('load',db); });
		})

		//returns all data from the db
		socket.on('getData',(data)=>{
			GetAllBDData().then((db )=>{ io.emit('load',db); });
		})


		//connection end
	});


	server.listen(PORT,()=>{
		console.log('listening');
	});

}
main();
