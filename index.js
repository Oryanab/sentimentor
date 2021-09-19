"use strict";

async function fetchSentiment(text) {
  const response = await fetch("https://sentim-api.herokuapp.com/api/v1/", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  // Fetch out the info
  const HttpStat = response.status;
  const result = [await response.json(), HttpStat];
  console.log(result);
  return result;
}

// async () => {
const textBoxContent = document.getElementById("textarea");
const submitBtn = document.getElementById("btn");
submitBtn.addEventListener("click", async (e) => {
  createLoader();
  RemoveSentimentToDom();
  try {
    const textSentiment = await fetchSentiment(textBoxContent.value);
    const textSentimentResult = textSentiment[0];
    console.log(textSentimentResult);
    let textSent = "";
    for (let i of textSentimentResult["sentences"]) {
      textSent += i["sentence"];
    }
    let polarity = textSentimentResult["result"]["polarity"];
    let type = textSentimentResult["result"]["type"];
    console.log(textSent, polarity, type);
    writeSentimentToDom(polarity, textSent, type, textSentiment[1]);
    textBoxContent.value = " ";

    removeLoader();
  } catch (error) {
    removeLoader();
    // alert(
    //   "We are sorry there may have been an error,  Make sure you have inserted Text into the textbox, otherwise comeback later... " +
    //     error
    // );
    displayError(error);
  }
});

function displayError(error) {
  const polarityDom = document.querySelector("#polarity");
  const userTextDom = document.querySelector("#text-sent");
  const userTextTypeDom = document.querySelector("#text-type");
  const statusDom = document.querySelector("#status");
  const showResultDiv = document.querySelector("#reuslt-div");

  polarityDom.textContent = "Error";
  polarityDom.style.color = "red";
  userTextDom.textContent = "Error";
  userTextDom.style.color = "red";
  userTextTypeDom.textContent = "Error";
  userTextTypeDom.style.color = "red";
  statusDom.textContent =
    " We are sorry there may have been an error,  Make sure you have inserted Text into the textbox, otherwise comeback later...  " +
    `Error: ${error}`;
  statusDom.style.color = "red";

  // Bonus
  //   showResultDiv.append(httpStatusImage(httpStatus));
}

function writeSentimentToDom(polarity, textSent, type, httpStatus) {
  const polarityDom = document.querySelector("#polarity");
  const userTextDom = document.querySelector("#text-sent");
  const userTextTypeDom = document.querySelector("#text-type");
  const statusDom = document.querySelector("#status");
  const showResultDiv = document.querySelector("#reuslt-div");

  polarityDom.textContent = " " + polarity;
  polarityDom.style.color = displayPolarityColor(polarity);
  userTextDom.textContent = " " + textSent;
  userTextTypeDom.textContent = " " + type;
  userTextTypeDom.style.color = displayTypeColor(type);
  statusDom.textContent = " " + httpStatus;

  // Bonus
  showResultDiv.append(httpStatusImage(httpStatus));
}

function displayTypeColor(type) {
  if (type === "positive") {
    return "green";
  } else if (type === "negative") {
    return "red";
  } else {
    return "grey";
  }
}

function displayPolarityColor(polarity) {
  if (polarity > 0) {
    return "green";
  } else if (polarity < 0) {
    return "red";
  } else {
    return "grey";
  }
}

function httpStatusImage(httpStatus) {
  const statusImage = document.createElement("img");
  statusImage.style.width = "250px";
  statusImage.style.height = "250px";
  statusImage.setAttribute("src", `https://http.cat/${httpStatus}`);
  statusImage.setAttribute("id", "image");
  return statusImage;
}

function RemoveSentimentToDom() {
  const polarityDom = document.querySelector("#polarity");
  const userTextDom = document.querySelector("#text-sent");
  const userTextTypeDom = document.querySelector("#text-type");
  const statusDom = document.querySelector("#status");
  const showResultDiv = document.querySelector("#reuslt-div");

  polarityDom.textContent = " ";
  userTextDom.textContent = " ";
  userTextTypeDom.textContent = " ";
  statusDom.textContent = " ";

  // Bonus
  try {
    const img = document.getElementById("image");
    img.remove();
  } catch (e) {
    return;
  }
}

function createLoader() {
  const loading = document.createElement("div");
  loading.setAttribute("id", "loader");
  loading.classList.add("loader");

  const imageLoader = document.createElement("img");
  imageLoader.setAttribute(
    "src",
    "https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
  );

  loading.appendChild(imageLoader);
  document.body.append(loading);
}

function removeLoader() {
  const loaderRemove = document.getElementById("loader");
  loaderRemove.remove();
}

// console.log(checkTextOutput);

// let textSent = "";
// for (let i of result["sentences"]) {
//     result += i["sentence"];
// }

// const HttpStat = response.status;
// const polarity = result["result"]["polarity"];
// const type = result["result"]["type"];

// console.log(textSent, HttpStat, polarity, type);
