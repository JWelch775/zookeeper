const path = require('path');
const router = require('express').Router();


//GET path for the HTML

//So far we've only used routes that have actual names like /api/animals, 
//so where do you think the / route points us to? It brings us to the root route of the server! 
//This is the route used to create a homepage for a server.
//
//Unlike most GET and POST routes that deal with creating or return JSON data, this GET route 
//has just one job to do, and that is to respond with an HTML page to display in the browser. 
//So instead of using res.json(), we're using res.sendFile(), and all we have to do is tell them 
//where to find the file we want our server to read and send back to the client.
//
//Notice in the res.sendFile() that we're using the path module again to ensure that we're 
//finding the correct location for the HTML code we want to display in the browser. 
//This way, we know it will work in any server environment!

//Before Express.js and its res.sendFile() method, the process for serving an HTML page was a 
//little more manual. It involved using the fs module to locate and read the file's content, 
//then send it back to the client using the simpler res.send() method.
//
//When we use res.sendFile(), all of that functionality is built into the method. All we need to do is 
//tell them where exactly our file is located and the method will do the rest!

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

module.exports = router;