document.getElementById("reloadArtist").addEventListener("click", function() { getArtist(); });
document.getElementById("reloadName").addEventListener("click", function(){getName()});
document.getElementById("reloadCover").addEventListener("click", function(){getCover()});

function getArtist(){
  console.log('a request for new artist was sent');

  const data = {message: 'hi there'};
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  fetch('/name', options)
  .then(d => {return d.json()})
  .then(response => {
    document.getElementById("artistSpan").innerText = response.new;
    console.log(response)
  })
}

function getName(){
  console.log('a request for new album name was sent');

  const data = {message: 'I want album'};
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  fetch('/album', options)
  .then(d => {return d.json()})
  .then(response => {
    document.getElementById("albumSpan").innerText = response.new;
    console.log(response)
  })
}

function getCover(){
  console.log('a request for new album name was sent');

  const data = {message: 'I want a new cover'};
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  fetch('/cover', options)
  .then(d => {return d.json()})
  .then(response => {
    document.getElementById("images").innerHTML = "<img id='theImg' src="+ response.source + ">";
    document.getElementById("photoCredit").innerHTML = "Photo by <a href='https://unsplash.com/@" + response.username +"?utm_source=your_app_name&utm_medium=referral'>" + response.user + "</a> on <a href='https://unsplash.com/?utm_source=your_app_name&utm_medium=referral'>Unsplash</a>";
    console.log(response)
  })

}
