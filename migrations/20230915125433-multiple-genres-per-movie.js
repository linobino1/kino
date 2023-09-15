module.exports = {
  async up(db, client) {
    // movie.genre (single item) -> movie.genres (array)
    await db.collection('movies').updateMany({}, [
      {
        $addFields: {
          genres: {
            $concatArrays: [
              ['$genre'],
              [],
            ],
          },
        },
      },
    ]);
    
    // remove movie.genre
    await db.collection('movies').updateMany({}, {
      $unset: {
        genre: '',
      },
    });
  },

  async down(db, client) {
    // movie.genres (array) -> movie.genre (single item)
    // we keep only the first genre
    await db.collection('movies').updateMany({}, [
      {
        $addFields: {
          genre: {
            $arrayElemAt: [
              '$genres',
              0,
            ],
          },
        },
      },
    ]);
    
    // remove movie.genres
    await db.collection('movies').updateMany({}, {
      $unset: {
        genres: '',
      },
    });
  }
};
