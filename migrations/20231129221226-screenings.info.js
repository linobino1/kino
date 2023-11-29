module.exports = {
  async up(db, client) {
    await db.collection("screenings").updateMany({}, [
      {
        $addFields: {
          info: {
            en: [
              {
                children: [{ text: "$info.en" }],
              },
            ],
            de: [
              {
                children: [{ text: "$info.de" }],
              },
            ],
          },
        },
      },
    ]);
  },

  async down(db, client) {
    throw new Error("Not implemented");
  },
};
