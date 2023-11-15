module.exports = {
  async up(db, client) {
    // screenings.info -> screenings.info.en
    await db.collection("screenings").updateMany({}, [
      {
        $addFields: {
          info: {
            en: "$info",
          },
        },
      },
    ]);
  },

  async down(db, client) {
    // screenings.info.en -> screenings.info
    await db.collection("screenings").updateMany({}, [
      {
        $addFields: {
          info: "$info.en",
        },
      },
    ]);
  },
};
