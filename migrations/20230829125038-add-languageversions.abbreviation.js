module.exports = {
  async up(db, client) {
    // add languageversions.abbreviation
    await db.collection("languageversions").updateMany(
      {},
      {
        $set: {
          abbreviation: "",
        },
      }
    );
  },

  async down(db, client) {
    // remove languageversions.abbreviation
    await db.collection("languageversions").updateMany(
      {},
      {
        $unset: {
          abbreviation: "",
        },
      }
    );
  },
};
