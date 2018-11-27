// Allows us to use exact same API on server as on client
const { forwardTo } = require("prisma-binding");

const Query = {
  // Allows us to do a very simple push/pull, without any custom logic
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // Check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  }
};

module.exports = Query;
