const { ObjectId } = require("mongodb");
const { default: slugify } = require("slugify");

module.exports = {
  async up(db, client) {
    // create jobs collection if not exists
    try {
      await db.createCollection('jobs');
    } catch (error) {
      // collection already exists
    }
    
    // add field movies.crewNew with jobs as relationships to jobs collection
    //   create jobs along the way if not exist
    const movies = await db.collection('movies').find().toArray();
    await Promise.all(movies.map(async (movie) => {
      await db.collection('movies').updateOne({_id: movie._id}, {
        $set: {
          crewNew: [],
        }
      });
      if (movie.crew) {
        await Promise.all(movie.crew.map(async (crewItem) => {
          if (crewItem.role) {
            // create job if not exists
            let jobID;
            try {
              jobID = (await db.collection('jobs').insertOne({
                name: {
                  en: crewItem.role,
                  de: crewItem.role,
                },
                slug: slugify(crewItem.role, {lower: true}),
              })).insertedId;
            } catch (error) {
              // job already exists, find it
              try {
                jobID = (await db.collection('jobs').findOne({
                  'name.en': crewItem.role,
                }))._id;
              } catch (err) {
                throw new Error(`Job ${crewItem.role} could neither be found nor created`);
              }
            }
            
            // add new data to movies.crewNew
            crewItem.job = {
              id: jobID.toString(),
              name: crewItem.role,
              slug: slugify(crewItem.role, {lower: true}),
            };
              
            delete crewItem.role;
            
            await db.collection('movies').updateOne({_id: movie._id}, {
              $push: {
                crewNew: crewItem,
              },
            });
          }
        }));
      }
    }));
    
    // replace movies.crew with movies.crewNew
    await db.collection('movies').updateMany({}, {
      $rename: {
        crewNew: 'crew',
      },
    });
    
  },

  async down(db, client) {
    // add movies.crew.role as movies.crew.job.name.en
    const movies = await db.collection('movies').find().toArray();
    await Promise.all(movies.map(async (movie) => {
      if (movie.crew) {
        await Promise.all(movie.crew.map(async (crewItem) => {
          const jobID = crewItem?.job?.id || crewItem?.job;
          const role = (await db.collection('jobs').findOne(ObjectId(jobID)))?.name?.en;
          await db.collection('movies').updateOne({_id: movie._id}, [
            {
              $addFields: {
                'crew.role': role || '',
              },
            },
          ]);
        }));
      }
    }));

    // remove movies.crew.job
    await db.collection('movies').updateMany({}, {
      $unset: {
        "crew.$[].job": '',
      },
    });
    
    // remove jobs collection
    await db.collection('jobs').drop();
  }
};
