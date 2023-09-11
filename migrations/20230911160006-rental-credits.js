module.exports = {
  async up(db, client) {
    // add field rentals.credits as object with en and de keys that contain the
    // credits text including the rental name
    await db.collection('rentals').updateMany({}, [
      {
      $addFields: {
        'credits.en': {
            $concat: [
              "Loan of the film print with kind support of ",
              "$name",
              ".",
            ],
        },
        'credits.de': {
            $concat: [
              "Leihgabe des Filmkopie mit freundlicher Unterstützung von ",
              "$name",
              ".",
            ],
        },
      }
    }
  ]);
  },

  async down(db, client) {
    // remove field rentals.credits
    await db.collection('rentals').updateMany({}, {
      $unset: {
        credits: {
          en: '',
          de: '',
        },
      }
    });
  }
};
