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

function filterByQuery(query, animalsArray) {
    let filteredResults = animalsArray;
    let personalityTraitsArray = [];

    if (query.personalityTraits) {
        //save personalityTraits as a dedicated array
        //if personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        //loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }

    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }

    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name) 
    }

    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id) [0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    //return finished code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }

    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }

    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }

    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }

    return true;
}


app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

app.post('/api/animals', (req, res) => {
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        //add animal to json file and animals array
        const animal = createNewAnimal(req.body, animals);
        //animal = req.body and is where incoming conten will be
        res.json(animal);
    }
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});