import moment from "moment";
import cookie from "react-cookies";

const TOKEN_KEY = "jwt";

export const login = () => {
  // const urlParams = parseURL(history.location.search);
  // cookie.save("vare", urlParams.app, {path: "/"});
  // localStorage.setItem(TOKEN_KEY, "TestLogin");
};

export const logout = () => {
  // cookie.remove("vare", {path: "/"});
  // localStorage.removeItem(TOKEN_KEY);
};

export const isLogin = () => {
  // if (localStorage.getItem(TOKEN_KEY)) {
  // alert(cookie.load("vare"));
  if (cookie.load("vare")) {
    return true;
  }

  return false;
};

export function groupBy({data, key}) {
  let group =
    key &&
    data &&
    Array.isArray(data) &&
    data.reduce((r, a) => {
      r[a[key]] = [...(r[a[key]] || []), a];
      return r;
    }, {});
  return group;
}

export function parseURL(url) {
  // if(!url) url = location.search;
  var query = url.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

export function getDatePeriod(time) {
  const now = moment();
  const expiration = moment(time);

  // get the difference between the moments
  const diff = expiration.diff(now);

  //express as a duration
  const diffDuration = moment.duration(diff);

  // display
  // console.log("Days:", diffDuration.days());
  // console.log("Hours:", diffDuration.hours());
  // console.log("Minutes:", diffDuration.minutes());
  if (diffDuration.minutes() < 61) {
    return diffDuration.minutes() + " minutes";
  } else if (diffDuration.hours() < 25) {
    return diffDuration.hours() + " hours";
  } else if (diffDuration.days() < 8) {
    return diffDuration.days() + " days";
  } else if (diffDuration.weeks() < 5) {
    return diffDuration.weeks() + " weeks";
  } else if (diffDuration.months() < 12) {
    return diffDuration.months() + " months";
  }
}
