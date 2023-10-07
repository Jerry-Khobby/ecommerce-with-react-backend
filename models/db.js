const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = "####################################################################################";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDb() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}

async function closeDb() {
  await client.close();
}

module.exports = {
  connectToDb,
  closeDb,
};
