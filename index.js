var express = require('express');
var app = express();
app.use(express.static('public'));
app.use(express.json());
const fetch = require("node-fetch");
var helmet = require('helmet')
app.use(helmet());
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
require('dotenv').config();

const port = process.env.PORT || 3000;

const wikiurl = process.env.WIKI_API;
const quoteurl = process.env.QUOTE_API;
const unsplashAPI = process.env.SPLASH_API;

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.listen(port, function() {
  console.log(`app listening on port ${port}!`);
});

app.post('/name', async (req, res, next) => {
  console.log('a response was recieved: ')
  console.log(req.body);
  const restext = await requestName();
  res.send(restext)
  })


app.post('/album', async (req, res, next) => {
  console.log('a response was recieved: ')
  console.log(req.body);
  const restext = await requestAlbum();
  res.send(restext)
  })

app.post('/cover', async (req, res, next) => {
  console.log('a response was recieved: ')
  console.log(req.body);
  const restext = await requestCover();
  res.send(restext)
  })

async function requestCover() {

  const fetched = await fetch(unsplashAPI);
  const json = await fetched.json();

  let userName = json.user.username;
  let user = json.user.name;
  let im = json.urls.raw + "&w=200&h=200&fit=crop";

  return {source: im, user: user, username: userName, raw: json.urls.raw}
};

async function requestName() {

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }

  }
  const fetched = await fetch(wikiurl, options)
  const json = await fetched.json()
  let newArtist = json.query.random[0].title;
  newArtist = newArtist.replace(/\([^()]*\)/g, "")
  newArtist = newArtist.split(",")[0];
  newArtist = newArtist.trim();
  newArtist = newArtist.toLowerCase().replace(/(^| )(\w)/g, s => s.toUpperCase());

  let rThe = Math.random(1);
  if (rThe > 0.8) {
    newArtist = "The " + newArtist;
  }

  let rPlural = Math.random(1);
  if (rPlural > 0.9) {
    newArtist = newArtist + "s";
    }

  console.log(newArtist)
  return {new: newArtist};

}

async function requestAlbum() {
  const quoteurl = "https://en.wikiquote.org/w/api.php?action=query&format=json&origin=*&prop=&titles=List%20of%20people%20by%20name&generator=links&gplnamespace=0&gpllimit=20";
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }

  }
  const fetched = await fetch(quoteurl, options)
  const json = await fetched.json()
  var links = json.query.pages;
  var pageIds = [];
  for (var prop in links) {
    pageIds.push(links[prop].pageid);
  }
  var randid = pageIds[Math.floor(Math.random() * pageIds.length)];


  let randurl = "https://en.wikiquote.org/w/api.php?action=query&format=json&origin=*&prop=links&pageids=" + randid + "&redirects=1";
  const ranfetched = await fetch(randurl)
  const ranjson = await ranfetched.json()
  let newId = Object.keys(ranjson.query.pages)[0]

  var ranlinks = ranjson.query.pages[newId].links;
  var randPerson = ranlinks[Math.floor(Math.random() * ranlinks.length)].title;
  while (randPerson.indexOf("List of people") != -1) {
    randPerson = ranlinks[Math.floor(Math.random() * ranlinks.length)].title;
  }
  currentAuthor = randPerson;

  const url = "https://en.wikiquote.org/w/api.php?" +
  new URLSearchParams({
    action: "parse",
    format: "json",
    origin: "*",
    page: currentAuthor,
    prop: "text",
    section: "1",
    disablelimitreport: 1,
    disabletoc: 1
    });


    const personFetched = await fetch(url);
    const personJson = await personFetched.json();

    var personText = personJson.parse.text["*"];
    const dom = new JSDOM(personText)
    while (dom.window.document.querySelector("li > ul > li")) {
      var toRemove = dom.window.document.querySelector("li > ul");
      toRemove.parentNode.removeChild(toRemove);
    }
    var quotes = dom.window.document.querySelectorAll("ul > li");
    var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    currentQuote = randomQuote.textContent || randomQuote.innerText;

    let str = currentQuote
      .replace(/[^A-Za-z0-9\s]/g, "")
      .replace(/\s{2,}/g, " ")
      .toLowerCase();

    let ary = str.split(" ");
    let newStr;
    if (ary.length >= 5) {
      let r1 = Math.random(1);
      if (r1 < 0.05) {
        newStr = ary[0] + " " + ary[1];
      } else if (r1 < 0.1) {
        newStr = ary[0];
      } else if (r1 < 0.15) {
        newStr = ary[ary.length - 1];
      } else if (r1 < 0.3) {
        newStr =
          ary[0] + " " + ary[1] + " " + ary[2] + " " + ary[3] + " " + ary[4];
      } else if (r1 < 0.4) {
        newStr = ary[0] + " " + ary[1] + " " + ary[2] + " " + ary[3];
      } else if (r1 < 0.5) {
        newStr =
          ary[ary.length - 5] +
          " " +
          ary[ary.length - 4] +
          " " +
          ary[ary.length - 3] +
          " " +
          ary[ary.length - 2] +
          " " +
          ary[ary.length - 1];
      } else {
        newStr = ary[ary.length - 2] + " " + ary[ary.length - 1];
      }
    } else {
      newStr = ary[ary.length - 1];
    }
    let albumName = newStr.replace(/^\w/, c => c.toUpperCase());
    return {new: albumName};

}
