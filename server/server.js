const http = require('http');
const path = require('path');
const fs = require('fs').promises;

const server = http.createServer(async (req, res) => {
    //exttract the method and url from the req object
    const { method, url } = req;
    //create a url object using the url and baseUrl
    const parsedUrl = new URL(url, `http://${req.headers.host}`);
    //setPathName of url
    const pathname = parsedUrl.pathname;

    const clientResolve = path.resolve(__dirname, '..', 'client');
    const staticDir = path.join(clientResolve, 'assets');

    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.json': 'application/json',
    };

    //default all of our cors to this
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    


    //if request is a prefight, reply with 204{No-content} so borwoser can proceed with main request
    if (method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    //get the co-worker main page
    if(method === "GET" && pathname === "/coworkermain"){
        //get html file
        const reqFile = path.join(clientResolve, 'coWorkerMain.html');

        //get file extension and set contentType using our mimeTypes object
        const ext = path.extname(reqFile).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        //readFile to confirm it exists
        const data = await readFile(reqFile);

        //if it exists then serve file
        if(data){
            res.writeHead(200, {"content-type": contentType});
            return res.end(data);
        }

        //else return not found error
        res.writeHead(404, {"content-type":"text/html"});
        return res.end('<h1>404 — Not Found</h1>');
    }

    //setup path for public images
    if(method === "GET" && !pathname.startsWith('/api')){

        if(pathname.startsWith('/pictures')){
            //get name of file
            const pictureName = pathname.split('/')[2];
            console.log(pictureName);

            const ext = path.extname(pictureName).toLowerCase();
            console.log(ext);
            const contentType = mimeTypes[ext] || 'text/html';

            const fileOnDisk = path.resolve(__dirname, 'pictures', pictureName);
            
            const data = await fs.readFile(fileOnDisk);

            if(data){
                res.writeHead(200, {"content-type": contentType});
                return res.end(data);
            }

            //else return not found error
            res.writeHead(404, {"content-type":"text/html"});
            return res.end('<h1>404 — Not Found</h1>');
        }

        //get file extension of path
        const ext = path.extname(pathname).toLowerCase();
        //get mimeType or default to html file
        const contentType = mimeTypes[ext] || 'text/html';

        const fileOnDisk = path.join(staticDir, pathname);

        const data = await readFile(fileOnDisk);
        
        if(data){
            res.writeHead(200, {"content-type": contentType});
            return res.end(data);
        }

        //else return not found error
        res.writeHead(404, {"content-type":"text/html"});
        return res.end('<h1>404 — Not Found</h1>');
    }


    res.writeHead(200, {
        "content-type": "text/plain"
    });

    res.end('helllloooo');


    //functions readFile to see if it exists
    async function readFile(filePath){
        try{
            const data = await fs.readFile(filePath, 'utf-8');
            return data;
        }
        catch(err) {
            console.error('Error reading file:', err)
            return null;
        }
    }

});

server.listen(4500, () => {
    console.log(`Server is listening on Port 4500`);
});