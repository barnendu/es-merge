var elasticsearch = require('elasticsearch'),
   cp = require('child_process'),
   path = require('path');
   exports = module.exports = copy_ES;
var  filePath = path.join(__dirname ,'elasticsearch' , 'handler.js');

 function copy_ES(config){
    var args=[];
    args.push(JSON.stringify(config));
    var child = cp.fork(filePath,args);
        child.on('exit',function(){
          console.log(`child process ${child.pid} has been completed.`);
        })
  }
     
