const $animalForm = document.querySelector('#animal-form');

const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  const animalObject = { name, species, diet, personalityTraits };

//So this fetch() function looks and works a lot like our previous experience with it when we made 
//GET requests. The big difference now, however, is that we need to add some more information about the 
//request.
//
//First and most importantly, we have to actually specify what type of request it is and set the method to 
//POST. This will allow the request to make it to the proper endpoint in our server, 
//which is the one we created in the previous lesson to add new animals to the JSON file.
//
//Next, we have to tell the request what type of data we're looking to send and then actually provide 
//the data. We set the headers property to inform the request that this is going to be JSON data. 
//That way, we can add stringified JSON data for our animalObject to the body property of the request. 
//Without these, we would never receive req.body on the server!

  fetch('/api/animals', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(animalObject)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert('Error:' + response.statusText);
    })
    .then(postResponse => {
      console.log(postResponse);
      alert('Thank you for adding an animal!');
    });

};

$animalForm.addEventListener('submit', handleAnimalFormSubmit);
