module.exports = {
  async up(db, client) {
    // create collection colors
    await db.createCollection("colors");

    // add colors to collection colors
    await db.collection("colors").insertMany([
      {
        name: {
          en: "color",
          de: "farbe",
        },
      },
      {
        name: {
          en: "b/w",
          de: "s/w",
        },
      },
      {
        name: {
          en: "technicolor",
          de: "technicolor",
        },
      },
    ]);

    // create collection categories
    await db.createCollection("categories");

    // add default category to collection categories
    await db.collection("categories").insertMany([
      {
        name: {
          en: "none",
          de: "keine",
        },
      },
    ]);

    // add color to all filmprints
    const category = await db
      .collection("categories")
      .findOne({ "name.en": "none" });
    await db.collection("filmprints").updateMany(
      {},
      {
        $set: {
          category: category._id,
        },
      }
    );
  },

  async down(db, client) {
    // remove color field from all filmprints
    await db.collection("filmprints").updateMany(
      {},
      {
        $unset: {
          color: "",
        },
      }
    );
    // drop collection colors
    await db.collection("colors").drop();

    // remove category field from all filmprints
    await db.collection("filmprints").updateMany(
      {},
      {
        $unset: {
          category: "",
        },
      }
    );
    // drop collection categories
    await db.collection("categories").drop();
  },
};
