const CosmosDB = require('./CosmosDb').CosmosDB;
const mainKey = "amzn1.ask.account.AG74BLYKKWCA7TJPFG2N656A5YEPPONGNL5FCB54JGHR7IPYR6E6PQZOOSWZJDQL3EDU25MBH6ITLE5DFL3KTM2WSYZM7HD7NWMOXB3VVL42H5P27FJAU4UILQIQWBYARYTRPQI7ZCIOQBVDJVKSIGXQSH7FTNBKAS6CLW5PKEVKIDSJMGLO5QXIG7AD2KP35RMDHLKIXBYERIY"
var config = {
  authorization:{
    authKey: "mwxIOzlLXVTcetXa4rauGECi3VMKbvdwFLUaXT5y1pbIpr4t8I0Alt21lg4tOnsReWyDK6VDhspvH19sbl1kpg==",
    endpoint: "https://eedda326-0ee0-4-231-b9ee.documents.azure.com:443/"
  },
  database:{
    databaseId:"DOG_AlexaSkill",
    containerId:"AlexaUsersPilot"
  }
};

const cosmos = new CosmosDB(config);
var database = null;
cosmos.init().then((db) => {
  database = db;
  callback();
})
.catch((err) => {
  console.log(err);
});

function deleteUserCallback(data){
  console.log("the function returned with:\n" , data)
}

function deleteDataCallback(data){
  console.log("the function returned with:\n" , data)
}
function saveDataCallback(data){
  console.log("the function returned with:\n" , data)
}

function saveObjectCallback(data){
  console.log("the function returned with:\n" , data)
}


function callback() {
  database.setMainKey("ABC123");
  database.saveObject('test', 'this is a value',saveObjectCallback)
    .then(() => {
      database.loadObject()
        .then((doc) => {
          console.log("LOADED");
          //console.log(doc);
          database.deleteData('key', deleteDataCallback)
            .then(() => {
              console.log('finished deleting')
              database.save('key', 'another value', saveDataCallback)
              console.log('finished saving')
            })
          })
        .catch((err) => {
          console.log(err);
        });
     })
    .catch((err) => {
     console.log(err)
   });
}
