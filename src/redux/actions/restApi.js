// import axios from 'axios';
// import RESTCall from './restApi'
import axios from "axios";
import cookie from "react-cookies";

// import Constants from 'expo-constants';
// import environment from "../components/environment";

// function getDataString({queryData,id,postType,keyName}){
//             //console.log('lll',query,id,postType)
//     var query=queryData ? queryData : {}
//     query['id']= id
//     query['postType']=postType
//     query['keyName']=keyName ? keyName : 'aa'
//     var data = ''
//     Object.keys(query).map((info,index) =>{
//     var addAnd=index<Object.keys(query).length-1 ? '&' : ''
//         data+=info+'='+query[info]+addAnd
//     })
//     return data
// }

//delete document
// http://localhost:5000/vareapp/delete/
//post
// {
//     "key":["item_id","user_id"],
//     "doc":"vare_vote",
//     "data": [
//         {
//             "user_id": "Shavae2006@yahoo.com",
//             "item_id": "hr6760-116",
//             "keyName": "hhhhhh"
//         }
//     ]
// }

//group votes and count response
//endppoint: http://localhost:5000/vareapp/votes
//type: post
// {
//     "doc":"vare_vote",
//     "data": ["hr6760-116","ccxxxhhhhhh","P60012143_voteMeIn"]
// }

//find all document
//endppoint: http://localhost:5000/vareapp/find/
//type: post
// {
//     "doc":"vare_vote",
//     "data": [
//         {"user_id":"Shavae2006@yahoo.com","item_id":"hr6760-116"}
//     ]
// }

//search with query document
//endppoint: http://localhost:5000/vareapp/find/
//type: post
// {
//     "doc":"vare_vote",
//     "data": [
//         {"user_id":"Shavae2006@yahoo.com","item_id":"hr6760-116"}
//     ]
// }

//update document
// http://localhost:5000/vareapp/update/
//post
// {
//     "key":["item_id","user_id"],
//     "doc":"vare_vote",
//     "data": [
//         {
//             "user_id": "Shavae2006@yahoo.com",
//             "item_id": "hr6760-116",
//             "keyName": "hhhhhh"
//         }
//     ]
// }

//create single document
//endppoint: http://localhost:5000/vareapp/single/
//type: post
// {
//     "key":["user_id","item_id"],  //where user_id and item_id values does not exist
//     "doc":"vare_vote",
//     "data": [
//         {
//             "user_id": "Shavae2006@yahoo.com",
//             "item_id": "hr6760-116",
//             "vote": "yes",
//             "Timestamp": "0000-00-00 00:00:00",
//             "installId": "ww7FB4E2EF-4722-48F2-9324-1B51468F39B0",
//             "keyName": ""
//         }
//     ]
// }

export default {
  axiosQuery: async myRequest => {
    const {
      search,
      request,
      resource,
      id,
      keyName,
      check,
      query,
      orderBy,
      sortBy,
      limit,
      skip
    } = myRequest;
    const urlPrefix = "https://media.varehall.com";
    // const urlPrefix = "http://localhost:5000";
    const urlPrefixMiddle = "https://vare-middleware.herokuapp.com";
    // const urlPrefixMiddle = "http://localhost:5000";

    // const urlPrefix = window.location.host.includes("localhost")
    //   ? "http://localhost:5000"
    //   : "https://media.varehall.com";
    // console.log("ccc", myRequest);
    // var orderBy = "asc";
    var url = "";
    var data = {};
    var timestamp = `${new Date().getTime()}`;
    var method = "post";
    var route = "";

    if (resource == "vare_user" && request == "vareappprofile") {
      url = `${urlPrefix}${"/auth/vareappprofile"}`;
      data = {
        doc: resource,
        data: [query ? query : {}]
      };
      method = "POST";
    } else if (resource == "vare_user" && request == "login") {
      url = `${urlPrefix}${"/auth/login"}`;
      data = {
        doc: resource,
        data: [query ? query : {}]
      };
      method = "POST";
    } else if (resource == "vare_user" && request == "register") {
      url = `${urlPrefix}${"/auth/register"}`;
      data = {
        doc: resource,
        data: [query ? query : {}]
      };
      method = "POST";
    } else if (resource == "vare_user" && request == "update_profile") {
      url = `${urlPrefix}${"/auth/updateprofile"}`;
      data = {
        doc: resource,
        data: [query ? query : {}]
      };
      method = "POST";
    } else if (request == "find") {
      url = `${urlPrefix}/vareapp/find?id=${id}&doc=${resource}`;
      data = {};
      method = "GET";
    } else if (request == "read" || request == "get") {
      url = `${urlPrefix}${"/vareapp/findall?doc="}${resource}${
        sortBy ? "&sortBy=" + sortBy : ""
      }${orderBy ? "&orderBy=" + orderBy : ""}${skip ? "&skip=" + skip : ""}${
        limit ? "&limit=" + limit : ""
      }`;
      // console.log("ssss", url);
      data = {};
      method = "GET";
    } else if (request == "search") {
      url = `${urlPrefixMiddle}/vareapp/search`;
      data = {
        doc: resource,
        data: [query ? query : {}],
        limit,
        skip
      };
      if (search && check) {
        data["search"] = search;
        data["key"] = check;
      }
      if (sortBy) data["sortBy"] = sortBy;
      if (orderBy) data["orderBy"] = orderBy;
      method = "POST";
    } else if (request == "searchArray") {
      url = "https://media.varehall.com/vareapp/votes";
      data = {
        doc: "vare_vote",
        data: query ? query : {}
      };
      method = "POST";
    } else if (request == "insert") {
      //insert
      url = "https://media.varehall.com/vareapp/update";
      // url = 'http://localhost:5000/vareapp/update'
      query["installId"] = "tbd";
      data = {
        key: check, //where user_id and item_id values does not exist
        doc: resource,
        data: [query ? query : {}]
      };
      // console.log('ZZxxxx',data)
      method = "POST";
    } else if (request == "insertstats") {
      //insert
      url = "https://media.varehall.com/vareapp/insertstats";
      // url = 'http://localhost:5000/vareapp/update'
      query["installId"] = "tbd";
      data = {
        key: check, //where user_id and item_id values does not exist
        doc: resource,
        data: [query ? query : {}]
      };
      // console.log('ZZxxxx',data)
      method = "POST";
    } else if (request == "patch") {
      //edit
      url = "https://media.varehall.com/vareapp/update";
      data = {
        key: check,
        doc: resource,
        data: [query ? query : {}]
      };
      method = "post";
    } else if (request == "delete") {
      url = `${urlPrefix}${"/vareapp/delete?id="}${id}&doc=${resource}`;
      data = {};
      method = "DELETE";
    } else if (request == "upload") {
      url = "https://media.varehall.com/vareapp/upload";
      data = {
        doc: resource,
        data: [query ? query : {}]
      };
      method = "POST";
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("auth-token", cookie.load("vare"));

    var raw = JSON.stringify(data);

    var requestOptions =
      method != "GET"
        ? {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          }
        : {
            method: method,
            headers: myHeaders,
            redirect: "follow"
          };

    var headers = {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
      "Access-Control-Allow-Origin": "*",
      "auth-token": cookie.load("vare")
    };
    if (method && method.toUpperCase() == "GET") {
      return axios.get(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "auth-token": cookie.load("vare")
        }
      });
    } else {
      var instance = axios.create({});
      return instance({
        method: method.toUpperCase(),
        url: url,
        data: JSON.stringify(data),
        headers
        //headers:method=='post' && headers,
        //withCredentials:true
      })
        .then(res => {
          // console.log('cccc',res)
          if (res && res.message) {
            return res.message;
          } else {
            return res && res.data ? res.data : "";
          }
        })
        .catch(err => {
          console.log("err-restApi", err);
        });
    }

    // return fetch(url, requestOptions)
    //  .then(response => {
    //    // console.log('response',url,requestOptions,response)
    //    return response.text()
    //  })
    //  .then(result => {
    //    // console.log('result',result)
    //    return JSON.parse(result)
    //  })
    //  .catch(error => {
    //    console.log('error', error)
    //    return []
    //  });
  },

  imageQuery: myRequest => {
    var requestUrl =
      myRequest.url == undefined && window.location.hostname == "localhost"
        ? "https://otgplaya.com/data/upload-file.php"
        : "https://otgplaya.com/data/upload-file.php";
    var timestamp = `${new Date().getTime()}`;
    var url = requestUrl + "&timestamp=" + timestamp;
    // var data = getDataString(myRequest)
    var method = "post";

    var raw = JSON.stringify(myRequest.query ? myRequest.query : "");

    var headers = {
      //'Content-Type': 'application/json',
      "Content-Type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      "Access-Control-Allow-Origin": "otgplaya.com"
      // 'Access-Control-Allow-Origin': 'http://localhost:3000'
    };
    var instance = axios.create({});
    return instance({
      method: method,
      url: url,
      data: raw,
      headers
    });
  }
};

// export { axiosQuery };
