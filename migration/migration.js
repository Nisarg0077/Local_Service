const express = require("express");
const router = express.Router();


const collections = {
  User: {
    model: require("../models/User"),
    data: require("../jsons/users.json"),
  },
  Provider: {
    model: require("../models/Provider"),
    data: require("../jsons/providers.json"),
  },
  Service: {
    model: require("../models/Service"),
    data: require("../jsons/services.json"),
  },
  Bookings: {
    model: require("../models/Bookings"),
    data: require("../jsons/bookings.json"),
  },
  Category: {
    model: require("../models/Category"),
    data: require("../jsons/categories.json"),
  },
  Review: {
    model: require("../models/Review"),
    data: require("../jsons/reviews.json"),
  },
  Notification: {
    model: require("../models/Notification"),
    data: require("../jsons/notifications.json"),
  }
};



const migration = async (collectionName) => {
  if (collectionName.toLowerCase() === "all") {
    const results = [];

    for (const [name, { model: Model, data }] of Object.entries(collections)) {
      const count = await Model.countDocuments();

      if (count === 0) {
        await Model.insertMany(data);

        results.push({
          collection: name,
          inserted: true,
          count: data.length,
        });
      } else {
        results.push({
          collection: name,
          inserted: false,
          count,
        });
      }
    }

    return results;
  }

  const collection = collections[collectionName];

  if (!collection) {
    throw new Error(`Unknown collection: ${collectionName}`);
  }

  const { model: Model, data } = collection;

  const count = await Model.countDocuments();

  if (count === 0) {
    await Model.insertMany(data);

    return {
      collection: collectionName,
      inserted: true,
      count: data.length,
    };
  }

  return {
    collection: collectionName,
    inserted: false,
    count,
  };
};
module.exports = migration;