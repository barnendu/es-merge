# Project Title
es-merge

## Description
 This node module will help to update a document or a certain portion of document.In the below example, document of type2 will be updated by document of type1.
 The _id is the key identifier for the updated operation. If a particular _id is missing in type2, which is coming from type1 then a document will be generated with that _id. 
 It is based on elasticsearch scan and scroll api and _bulk api. 
 The scan search type and the scroll API are used together to retrieve large numbers of documents from Elasticsearch efficiently, without paying the penalty of deep pagination.
 We can customize the scroll size based on the computation power of the elasticsearch server.The bulk API makes it possible to perform many  operations in a single API call. 
 This can greatly increase the indexing speed. Inthis case we are using bulk update operation.

## Prerequisite
We need to take care about mapping of the type. Mapping must be same for the type at source index and destination index, otherwise data loss issue might be happened.

### Getting Started
```
npm i es-merge --save

sample code:

var ES_merge = require('es-merge');

var config = {
        "scroll_length":500,
        "index":"source_index",
        "destination_index":"test_001",
        "type1": "source",
        "type2":"destination",
        "source_server": "source_server_url" ,
       "destination_server": "destination_server_url"
    };

    try{
        ES_merge(config)
    }
    
    catch(e){

        console.log(e)
    }
```


## Authors

* **Barnendu Pal** - *Initial work* 



## License

This project is licensed under the MIT License.




"# es-merge" 
