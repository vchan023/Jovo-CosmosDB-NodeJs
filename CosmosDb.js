const _ = require('lodash');

class CosmosDB{
  constructor(cosmosConfig){
    try {
      this.CosmosDB = require('@azure/cosmos');
    } catch(err){
      throw Error('Please install the CosmosDB Sdk: npm install @azure/cosmos --save');
    }

    if (cosmosConfig){
      //set client options from config
      this.clientConfig = { endpoint: cosmosConfig.authorization.endpoint, auth: { masterKey: cosmosConfig.authorization.authKey } };
      this.databaseId = cosmosConfig.database.databaseId;
      this.containerId = cosmosConfig.database.containerId;
      this.client = new this.CosmosDB.CosmosClient(this.clientConfig);
    }
  }

  async init() {
    try {
      const dbResponse = await this.client.databases.createIfNotExists({ id: this.databaseId });
      this.database = dbResponse.database;
      const coResponse = await this.database.containers.createIfNotExists({ id: this.containerId });
      this.container = coResponse.container;
    } catch(err) {
      throw err;
    }

    return this;
  }


  setMainKey(mainKey){
    this.mainKey = mainKey;
    return this;
  }

  async save(key, value, callback){
    try {
      const { body: doc } = await this.container.item(this.mainKey, this.mainKey).read();
      if(doc){
        //console.log(doc)
        let newData = doc
        newData[key] = value
        //console.log(newData)
        await this.container.item(this.mainKey, this.mainKey).replace(newData)
        .then(() => {
          callback("success, saved item")
        })
        .catch((err)=>{
          callback(err)
        })
      }
    } catch(err) {
      if (err.code == "404"){  //item not found
        callback("Mainkey " +this.mainKey+ " not found in database\n")
      }
      throw err;
    }
  }

  async saveObject(key, newData, callback){
    const newDoc = {
      userId: this.mainKey,
      key: newData,
      id: this.mainKey
    }
    try {
      const { body: doc } = await this.container.item(this.mainKey, this.mainKey).read();
      if(doc){
        await this.container.item(this.mainKey, this.mainKey).replace(newDoc)
        .then(() => {
          callback("success, replaced item")
        })
        .catch((err)=>{
          callback(err)
        })
      }
    } catch(err) {
      if (err.code == "404"){  //item not found
        await this.container.items.create(newDoc)
        .then(() => {
          callback("success, created item")
        })
        .catch((err)=>{
          callback(err)
        })
      }
    }
  }

  async loadObject(){
    try {
      //const { result : results } = await this.container.items.readAll().toArray();
      //return results;
    //  console.log(this.mainKey)
      const item = this.container.item(this.mainKey, this.mainKey);
      //console.log(item)
      const { body: readDoc } = await item.read();
      //const { body }  = await this.container.item(this.mainKey).read({partitionKey: this.mainKey});
      return readDoc;
    } catch(err) {
      console.log(err);
      throw err;
    }
  }

  async deleteUser(callback){
    try{
      return this.container.item(this.mainKey, this.mainKey).delete()
        .then(() => {
          callback("success, deleted item")
        })
    } catch(err){
      callback(err)
    }
  }

  async deleteData(key, callback){
    try {
      const { body: doc } = await this.container.item(this.mainKey, this.mainKey).read();
      if(doc){
        //console.log(doc)
        if(doc[key]){
          let newData = doc
          delete newData[key]
          //console.log(newData)
          await this.container.item(this.mainKey, this.mainKey).replace(newData)
          .then(() => {
            callback("success, deleted item data")
          })
          .catch((err)=>{
            callback(err)
          })
        } else
        callback("Data key " +key+ " not found for main key "+mainKey+ "\n")
      }
    } catch(err) {
      if (err.code == "404"){  //item not found
        callback("Mainkey " +this.mainKey+ " not found in database\n")
      }
      throw err;
    }
  }


}

module.exports.CosmosDB = CosmosDB;
