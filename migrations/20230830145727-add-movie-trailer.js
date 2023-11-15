module.exports = {
  async up(db, client) {
    // add field movies.trailer
    await db.collection("movies").updateMany({}, { $set: { trailer: "" } });
  },

  async down(db, client) {
    // remove field movies.trailer
    await db.collection("movies").updateMany({}, { $unset: { trailer: "" } });
  },
};
