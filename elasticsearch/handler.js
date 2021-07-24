var elasticsearch = require('elasticsearch'),
     q = require('q'),
    request = require('request')
     _ = require('lodash'),
   synRequest = require('sync-request');

var args = process.argv.slice(2),
   config = JSON.parse(args);
var client = new elasticsearch.Client({
  host: config.destination_server,
   log: 'trace'
});

var scroll_id, scroll_size,dataCount;
   try{
 var query={"query": { "match_all": {}}, "size": config.scroll_length};
  var deferred = q.defer();
  scroll_size=1;
  dataCount=0;
   var options = {
        method: 'POST',
        url: 'http://' + config.source_server + '/'+ config.index +'/' + config.type1 + '/_search?scroll=1m',
        headers: { contentType: 'application/json' },
        body: JSON.stringify(query)
    }
    request(options, function (err, res, body) {
        if (err) {
             deferred.reject(err);
        }else{
        scroll_id=JSON.parse(body)._scroll_id;
        fetchNextDataSet(config.type1)
        }   
     });
   
return deferred.promise;
   }catch(e){
    console.log(e)
   }
function fetchNextDataSet(type){
                if(scroll_size>0){
                var url= 'http://' + config.source_server  +  '/_search/scroll?scroll=1m&scroll_id='+scroll_id;
                var res =synRequest('GET',url, {'headers': { 'contentType': 'application/json' }
                });
                scroll_size =JSON.parse(res.getBody('utf8')).hits.hits.length;
                scroll_id=JSON.parse(res.getBody('utf8'))._scroll_id;
                dataCount +=scroll_size
                console.log("No. of data fetched:"+dataCount)
                if(scroll_size)
                updateDataSet(config.type2,JSON.parse(res.getBody('utf8')).hits.hits);
              
                 }
         else
            return true;
             

}
function updateDataSet(type,data){
var index = config.destination_index;
 var deferred = q.defer()
var query='';
_.each(data,function(rslt,ind){
    if(!_.isEmpty(rslt._source)){
         if(!query){
        query =JSON.stringify({"update":{"_id" :rslt._id , "_type" : type, "_index" : index}})+"\n" +
       JSON.stringify({"doc":JSON.parse(JSON.stringify(rslt._source).replace(/"\s+|\s+"/g,'"')),"doc_as_upsert":true})+"\n" ;
        }else{
       query +=JSON.stringify({"update":{"_id" :rslt._id , "_type" : type, "_index" : index}})+"\n" +
       JSON.stringify({"doc":JSON.parse(JSON.stringify(rslt._source).replace(/"\s+|\s+"/g,'"')),"doc_as_upsert":true})+"\n" ;
        }
    }
})     
client.bulk({
  body: [query]
  
}, function (err, resp) {
  if(resp){
   
fetchNextDataSet(config.type1)
deferred.resolve({ status: resp.statusCode, body: resp });
  }
});

    return deferred.promise;
    
}