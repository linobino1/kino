module.exports = {
  async up(db, client) {
    // rename collection screeninggroups to screeningseasons
    await db.collection("screeninggroups").rename("screeningseasons");

    // remove field 'default'
    await db
      .collection("screeningseasons")
      .updateMany({}, { $unset: { default: "" } });
  },

  async down(db, client) {
    // rename collection screeningseasons to screeninggroups
    await db.collection("screeningseasons").rename("screeninggroups");

    // add field 'default'
    await db
      .collection("screeninggroups")
      .updateMany({}, { $set: { default: false } });

    // set default to true for the first screeninggroup
    const firstScreeningGroup = await db
      .collection("screeninggroups")
      .findOne({});
    if (firstScreeningGroup) {
      await db
        .collection("screeninggroups")
        .updateOne(
          { _id: firstScreeningGroup._id },
          { $set: { default: true } }
        );
    }
  },
};
