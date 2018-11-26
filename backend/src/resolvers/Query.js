// Allows us to use exact same API on server as on client
const { forwardTo } = require("prisma-binding");

const Query = {
  // Allows us to do a very simple push/pull, without any custom logic
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db")

  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //   return items;
  // }
};

module.exports = Query;
