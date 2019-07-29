(function() {
  "user strict";

  window.addEventListener("load", initialize);
  const IGDB_API_BASE = "https://api-v3.igdb.com/";
  const API_KEY = "afd781f4d6fb0c25784eac9dbb7054ba";
  const PROXYURL = "https://cors-anywhere.herokuapp.com/";

  function initialize() {
    most_popular();

    // add hover events to all cards
    let cards = qsa(".card");
    for (let i = 0; i < cards.length; i++) {
      cards[i].addEventListener("mouseover", function() {
        preview(cards[i].src);
      });
    }
  }

  // preview the screenshots on the left container
  function preview(imgSrc) {
    $("preview-img").style.backgroundImage = "url(" + imgSrc + ")";
  }

  // populate the most popular Nintendo switch games
  function most_popular() {
    let url = IGDB_API_BASE + "games";
    let qry =
    "fields name, cover.url; " +
    "where platforms = [130] & rating != null & screenshots != null & rating > 90; " +
    "sort popularity desc; " +
    "limit 5; offset 3;";

    fetch(PROXYURL + url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "user-key": API_KEY
        },
        body: qry
      })
        .then(checkStatus)
        .then(JSON.parse)
        .then(most_popular_handler)
        .catch(console.log);
  }

  function most_popular_handler(response) {
    let targetCard = qsa("#most-popular .card");
    for (let i = 0; i < response.length; i++) {
      let coverSrc = response[i]["cover"]["url"];
      targetCard[i].src = coverSrc;

      
    }
  }

  // function upcoming() {
  //   let today = new Date();
  //   let today_time_stamp = today.getTime();
  //
  //   let url = IGDB_API_BASE + "release_dates";
  //   let qry = "fields *; where date > " + today_time_stamp + "; sort date asc; limit 5;";
  //
  //   fetch(PROXYURL + url, {
  //     method: "POST",
  //     headers: {
  //       "Accept": "application/json",
  //       "user-key": API_KEY
  //     },
  //     body: qry
  //   })
  //     .then(checkStatus)
  //     .then(JSON.parse)
  //     .then(upcoming_handler)
  //     .catch(console.log);
  // }
  //
  // function upcoming_handler(response) {
  //   for (let i = 0; i < response.length; i++) {
  //     let referenceID = response[i]["id"];
  //     let raw_name = get_game_name(referenceID);
  //     if (raw_name) {
  //       console.log(raw_name["name"]);
  //     }
  //   }
  // }

  // -------------------------- helper functions --------------------------
  /**
   * @param {Promise} response - the response sent back from the requested server
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status == 0){
      return response.text();
    }else {
      return Promise.reject(new Error(response.status + ":" + response.statusText));
    }
  }

  function $(id) {
    return document.getElementById(id);
  }

  function qs(query) {
    return document.querySelector(query);
  }

  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();
