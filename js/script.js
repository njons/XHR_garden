console.log("this is script.js");
const form = document.querySelector("#form-container");

function loadData() {
  event.preventDefault();
  const streetInput = document.querySelector("#street");
  const cityInput = document.querySelector("#city");
  const body = document.querySelector("body");

  // read street and city names from inputs
  let streetName = streetInput.value;
  let cityName = cityInput.value;

  // add the Google street View photo
  const address = getStreetView(streetName, cityName);

  // get NYT data
  const nytApiKey = config.nyt_api_key;
  const nytUrl =
    "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
    cityName +
    "&api-key=" +
    nytApiKey;
  xhrRequest("GET", nytUrl, extractNYTData);

  // get wiki data
  const wikiUrl =
    "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
    cityName +
    "&origin=*";
  xhrRequest("GET", wikiUrl, extractWikiData);

  // clear out old data before new request
  streetName = "";
  cityName = "";
}

form.addEventListener("submit", () => {
  loadData();
});

const getStreetView = (street, city) => {
  const comigSoon = document.querySelector("#coming-soon");
  const greeting = document.querySelector("#greeting");
  const address = street + ", " + city;
  greeting.textContent = "So, you want to live at " + address + "?";
  comigSoon.append(
    "Google StreeView images used to be accessible by just inserting the api url for the correct location, so imagine the background of this page as an image for: " +
      address
  );
};

const xhrRequest = (method, url, cb) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      cb(JSON.parse(xhr.responseText));
    } else {
      console.log("no reponse from server");
    }
  };
  xhr.open(method, url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send();
};

const extractNYTData = newsData => {
  const articles = newsData.response.docs;
  const nytElem = document.querySelector("#nytimes-articles");
  clearText(nytElem);
  articles.forEach(article => {
    const newsHeaders = [];
    newsHeaders.push(article.headline.main);
    const newsLinks = [];
    newsLinks.push(article.web_url);
    createElements(nytElem, newsHeaders, newsLinks);
  });
};

const extractWikiData = wikiData => {
  const wikiElem = document.querySelector("#wikipedia-links");
  clearText(wikiElem);
  const wikiHeaders = wikiData[1];
  const wikiLinks = wikiData[3];
  createElements(wikiElem, wikiHeaders, wikiLinks);
};

const createElements = (parentElement, headersArray, linksArray) => {
  headersArray.forEach((item, i) => {
    const newElement = document.createElement("a");
    newElement.textContent = item;
    newElement.setAttribute("href", linksArray[i]);
    newElement.classList.add("wikipedia-li");
    const newLi = document.createElement("li");
    parentElement.appendChild(newLi);
    newLi.appendChild(newElement);
  });
};

const clearText = elementName => {
  elementName.textContent = "";
};
