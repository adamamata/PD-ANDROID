var fs = require('fs');
console.log('Incrementing build number...');
fs.readFile('src/meta-data.json',function(err,content) {
    if (err) throw err;
    var metadata = JSON.parse(content);
    metadata.buildRevision = new Date().getTime();

    if (metadata.buildRevision == 10000)
    {
        metadata.buildRevision = 0;
        metadata.buildMinor = metadata.buildMinor + 1;
    }

    if (metadata.buildMinor == 1000)
    {
        metadata.buildMinor = 0;
        metadata.buildMajor = metadata.buildMajor + 1;
    }
    
    fs.writeFile('src/meta-data.json',JSON.stringify(metadata),function(err){
        if (err) throw err;
        console.log(`Current build number: ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} ${metadata.buildTag}`);
    })
});