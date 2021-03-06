const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { animals } = require('./data/animals.json');
const PORT = process.env.PORT || 3001;
const app = express();

//Whenever we need to ask for another file's information in our HTML file, such as <script src="script.js"> 
//or <link href="style.css">, we're actually making HTTP GET requests for a file's data. 
//Yes, all of that code lives within our folder structure, but even local requests occur over HTTP.
//
//So as far as our problem goes, our HTML file loads and immediately makes requests to 
//http://localhost:3001/assets/js/script.js and http://localhost:3001/assets/css/style.css. 
//The problem here is that we never created explicit routes in our Express.js server 
//to look for and serve those files when requested. 
//Remember, any time we make a request to the server, it looks at every single route we've explicitly created. 
//If it doesn't find a matching route name, it will think that there's something wrong 
//and won't provide a response.
//
//We need to fix this in our server so it knows that when we ask for front-end resources such as 
//images, client-side JavaScript code, or CSS code, the server knows how to respond. 
//Here's the thing, though—do we have to actually create a route for every front-end asset that we could ever 
//possibly have to use? What happens if we have 10 pages with their own CSS, JavaScript, and images? 
//That's a lot of routes!
//
//Luckily, we don't have to do that. Instead, we can set up some more Express.js middleware that instructs 
//the server to make certain files readily available and to not gate it behind a server endpoint.
//
//Add the following code to the top of the server.js file, near the two app.use() methods:

//We added some more middleware to our server and used the express.static() method. 
//The way it works is that we provide a file path to a location in our application 
//(in this case, the public folder) and instruct the server to make these files static resources. 
//This means that all of our front-end code can now be accessed without having a specific server endpoint 
//created for it!
app.use(express.static('public'));

//parse incoming string or array data
app.use(express.urlencoded({extended: true}));

//parse incoming JSON data
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});