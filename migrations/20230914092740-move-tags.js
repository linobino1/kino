const { ObjectId } = require("mongodb");

module.exports = {
  async up(db, client) {
    // filmprint.tags -> related movie movie.tags
    const filmprints = await db.collection('filmprints').find({
      tags: { $exists: true }
    }).toArray();
    
    // iterate over all filmprints
    for (const filmprint of filmprints) {

      // update the related movie with the tags
      await db.collection('movies').updateOne({
        _id: ObjectId(filmprint.movie)
      }, {
        $set: {
          tags: filmprint.tags
        }
      });
    }
    
    // remove tags from filmprints
    await db.collection('filmprints').updateMany({}, {
      $unset: {
        tags: ''
      }
    });
  },

  async down(db, client) {
    // movie.tags -> related filmprints filmprint.tags
    const filmprints = await db.collection('filmprints').find().toArray();
    
    // iterate over all filmprints
    for (const filmprint of filmprints) {
      // find the related movie
      const movie = await db.collection('movies').findOne({
        _id: ObjectId(filmprint.movie)
      });
      
      // update the filmprint with the tags
      await db.collection('filmprints').updateOne({
        _id: ObjectId(filmprint._id)
      }, {
        $set: {
          tags: movie.tags
        }
      });
    }
    
    // remove tags from movies
    await db.collection('movies').updateMany({}, {
      $unset: {
        tags: ''
      }
    });
  },
};
