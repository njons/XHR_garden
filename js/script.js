console.log("this is script.js");
const form = document.querySelector("#form-container");
const streetInput = document.querySelector("#street");
const cityInput = document.querySelector("#city");

function loadData() {
  event.preventDefault();
  console.log("you clicked submit");
  const body = document.querySelector("body");
  // read street and city names from inputs
  const streetName = streetInput.value;
  const cityName = cityInput.value;
  // add the Google street View photo
  const address = getStreetView(streetName, cityName);
  // add in NYTimes results
  const nytHeaderElem = document.querySelector("#nytimes-header");
  const nytElem = document.querySelector("#nytimes-articles");
  const nytApiKey = config.nyt_api_key;
  const nytUrl =
    "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
    cityName +
    "&api-key=" +
    nytApiKey;

  xhrRequest("GET", nytUrl, getNYTarticles);

  // get wiki data
  const wikiElem = document.querySelector("#wikipedia-links");
  const wikiUrl =
    "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
    cityName +
    "&origin=*";
  xhrRequest("GET", wikiUrl, getWikiArticles);

  // clear out old data before new request
  streetName.textContent = "";
  cityName.textContent = "";
  wikiElem.textContent = "";
  nytElem.textContent = "";

  body.append(
    "Google StreeView images used to be accessible by just inserting the api url for the correct location, so imagine the background of this page as an image for: " +
      address
  );
}

form.addEventListener("submit", () => {
  loadData();
});

const getStreetView = (street, city) => {
  const greeting = document.querySelector("#greeting");
  const address = street + ", " + city;
  greeting.textContent = "So, you want to live at " + address + "?";
  return address;
};

const xhrRequest = (method, url, cb) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    // console.log("this is xhr readyState:", xhr.readyState);
    // console.log("this is xhr status:", xhr.status);
    if (xhr.readyState === 4 && xhr.status === 200) {
      // console.log("this is xhr response:", xhr.responseText);
      cb(JSON.parse(xhr.responseText));
    } else {
      console.log("no reponse from server");
    }
  };
  xhr.open(method, url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send();
};

const getNYTarticles = newsData => {
  console.log("hi, you're in getNYTarticles");
  console.log("this is xhr data", newsData);
  const articles = newsData.response.docs;
  console.log("this is articles", articles);

  const nytHeaderElem = document.querySelector("#nytimes-header");
  const nytElem = document.querySelector("#nytimes-articles");

  articles.forEach(article => {
    const liEl = document.createElement("li");
    liEl.textContent = article.headline.main;
    console.log(article.headline.main);
    nytElem.appendChild(liEl);
  });
};

const getWikiArticles = wikiData => {
  const wikiElem = document.querySelector("#wikipedia-links");
  console.log("this is xhr data", wikiData);
  const wikiHeaders = wikiData[1];
  console.log("this is wiki headers", wikiHeaders);
  wikiHeaders.forEach((header, i) => {
    console.log("this is wiki header in the loop", header);
    console.log("this is i in the loop", i);
    const wikiLi = document.createElement("li");
    wikiLi.textContent = header;
    wikiElem.appendChild(wikiLi);
  });
  const wikiLinks = wikiData[3];
  console.log("this is wiki links", wikiLinks);
  wikiLinks.forEach((link, i) => {
    console.log("this is wiki link", link);
  });
};
