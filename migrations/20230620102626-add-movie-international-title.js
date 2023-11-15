module.exports = {
  async up(db, client) {
    // set internationalTitle to the english translation of title for all movies
    await db.collection("movies").updateMany({}, [
      {
        $set: {
          internationalTitle: "$title.en",
        },
      },
    ]);
  },

  async down(db, client) {
    // remove internationalTitle from all movies
    await db.collection("movies").updateMany(
      {},
      {
        $set: {
          internationalTitle: "",
        },
      }
    );
  },
};
