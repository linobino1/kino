module.exports = {
  async up(db, client) {
    await db.collection("globals").updateOne(
      {
        globalType: "site",
      },
      {
        $set: {
          logoMobile: "",
        },
      }
    );
  },

  async down(db, client) {
    await db.collection("globals").updateOne(
      {
        globalType: "site",
      },
      {
        $unset: {
          logoMobile: "",
        },
      }
    );
  },
};
