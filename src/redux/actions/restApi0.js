 import axios from 'axios';


// //get all table data
// axiosQuery({
//   request:'get',
//   resource:'??', //add table name
// })
//
// //filter table data by id
// axiosQuery({
//   request:'post',
//   resource:'??', //add table name
//   id:?,  //add request id
// })
//
// //search
// axiosQuery({
//   request:'search',
//   query:{id:1}, //add table key value peers to search for
//   resource:'??', //add table name
//   id:'',
//   orderme:'asc'
// })
//
// //edit
// axiosQuery({
//   request:'patch',
//   query:{id:1}, //add table key value to edit
//   resource:'??', //add table name
//   id:? //id of data
// })
//
// //delete
// axiosQuery({
//   request:'delete',
//   resource:'??', //add table name
//   id:? // object id to delete
// })

function getDataString(queryData,id,postType){
            //console.log('lll',query,id,postType)
    var query=queryData ? queryData : {}
    query['id']= id
    query['postType']=postType
    var data = ''
    Object.keys(query).map((info,index) =>{
    var addAnd=index<Object.keys(query).length-1 ? '&' : ''
        data+=info+'='+query[info]+addAnd
    })
    return data
}

export default {

          axiosQuery: (myRequest) => {
            var that = this
            var request = myRequest.request == undefined
              ? '' : myRequest.request
            var resource = myRequest.resource == undefined
              ? '' : myRequest.resource
            var id = myRequest.id == undefined
              ? '' : myRequest.id
            // var sortBy = myRequest.sortme == undefined
            //   ? myRequest.filters.property[0] : myRequest.sortme
            var orderBy = myRequest.orderme == undefined
              ? 'asc' : myRequest.orderme
              var requestUrl = myRequest.url == undefined
                ? 'https://gss.goproverify.com/data/data-post.php' : 'https://gss.goproverify.com/data/data-post.php' //myRequest.url
            var url = ''
            var data = ''

            var method = 'post'

            if (request == 'get') {
                var id=id ? id : -1
              url = requestUrl  +  '?table='+resource
              //url = 'https://goproverify.com/data/data.php?postType=' + data[0] + '&tableName=' + resource + '&id=' + id
              data = JSON.stringify(getDataString(myRequest.query,id,'read'))
              method = 'get'
              //console.log('REQUEST ',requestUrl,url,data,method,headers)
            }
            else if (request == 'post') {
              var postType='read'
                var id=id ? id : -1
              url = requestUrl  +  '?table='+resource
              data = getDataString(myRequest.query,id,postType)
              method = 'post'
            }
            else if (request == 'search') {
              var postType='search'
                var id=id ? id : -1
              url = requestUrl  +  '?table='+resource
              data = getDataString(myRequest.query,id,postType)
              method = 'post'
            }
            else if (request == 'insert') { //insert
                var id=-1
                var postType= 'insert'
              url = requestUrl  +  '?table='+resource
              data = getDataString(myRequest.query,id,postType)
              method = 'post'
            }
            else if (request == 'patch') { //edit
                var id=id
                var postType= 'update'
              url = requestUrl  +  '?table='+resource
              data = getDataString(myRequest.query,id,postType)
              method = 'post'
            }
            else if (request == 'delete') {
              var id=id ? id : -1
              url = requestUrl  +  '?table='+resource
              data = getDataString(myRequest.query,id,'delete')
              method = 'post'
            }
            var headers = {
              //'Content-Type': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Control-Allow-Origin': '*'
            }
            var instance = axios.create({
            })
            return instance({
              method: method,
              url: url,
              data: data,
              headers
              //headers:method=='post' && headers,
              //withCredentials:true
            })
      }

}

// export { axiosQuery };
