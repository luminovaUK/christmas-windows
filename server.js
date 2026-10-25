"use strict";
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname,port=Number(process.env.PORT||3000);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 let name;try{name=decodeURIComponent(url.pathname)}catch{res.writeHead(400);return res.end('Bad request')}
 if(name==='/' ) name='/index.html';
 const filename=path.resolve(root,'.'+name);
 if(!filename.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden')}
 fs.stat(filename,(err,s)=>{if(err||!s.isFile()){res.writeHead(404);return res.end('Not found')}
 res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=300'});fs.createReadStream(filename).pipe(res);});
}).listen(port,'0.0.0.0',()=>console.log('Christmas Windows listening on '+port));
