module.exports = {
  async up(db, client) {
    // rename screeningSeasons to seasons
    await db.collection('screeningSeasons').rename('seasons');
  },

  async down(db, client) {
    // rename seasons to screeningSeasons
    await db.collection('seasons').rename('screeningSeasons');
  }
};
