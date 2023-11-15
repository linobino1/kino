module.exports = {
  async up(db, client) {
    // post.link -> post.link.url
    // we can only migrate external links
    const posts = await db.collection("posts").find();
    posts.forEach(async (post) => {
      if (post.link && typeof post.link === "string") {
        if (post.link.startsWith("http") || post.link.startsWith("www")) {
          await db.collection("posts").updateOne(
            { _id: post._id },
            {
              $set: {
                link: {
                  type: "external",
                  url: post.link,
                },
              },
            }
          );
        } else {
          await db.collection("posts").updateOne(
            { _id: post._id },
            {
              $set: {
                link: {
                  type: "internal",
                },
              },
            }
          );
        }
      }
    });
  },

  async down(db, client) {
    // post.link.url -> post.link
    // we can only migrate external links
    const posts = await db.collection("posts").find();
    posts.forEach(async (post) => {
      if (post.link) {
        if (post.link.type === "external") {
          await db
            .collection("posts")
            .updateOne({ _id: post._id }, { $set: { link: post.link.url } });
        } else {
          await db
            .collection("posts")
            .updateOne({ _id: post._id }, { $unset: { link: "" } });
        }
      }
    });
  },
};
