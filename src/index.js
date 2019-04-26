import "./styles.css";

const axios = require("axios");
const cheerio = require("cheerio");

let league = "40156";
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

let today_str = formatDate(today);
let tomorrow_str = formatDate(tomorrow);

let today_url = getMLBUrl(today_str);
let tomorrow_url = getMLBUrl(tomorrow_str);

const getPitchers = (url, day) => {
  axios
    .get("https://cors.io/?" + url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      let pitchers = [];
      $(".probable-pitchers__pitcher-name-link").each(function(i, l) {
        let pitcher = $(this).text();
        pitchers.push(pitcher);
      });
      console.log(pitchers);
      updatePitchers(pitchers, day);
    })
    .catch(error => {
      console.log(error.response);
    });
};

let todays_pitchers = getPitchers(today_url, "today");
let tomorrows_pitchers = getPitchers(tomorrow_url, "tomorrow");

function getMLBUrl(date_str) {
  return "https://www.mlb.com/probable-pitchers/" + date_str;
}

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const updatePitchers = (pitchers, day) => {
  pitchers.forEach(function(l, i) {
    console.log(l);
    $("#" + day + "s_pitchers").append(getLIByLink(getLinkByName(l)));
  });
};

const getLinkByName = name => {
  return {
    url:
      "https://baseball.fantasysports.yahoo.com/b1/" +
      league +
      "/playersearch?&search=" +
      name.split(" ")[0] +
      "%20" +
      name.split(" ")[1],
    name: name
  };
};

const getLIByLink = link => {
  return "<li><a href=" + link.url + ">" + link.name + "</li>";
};
