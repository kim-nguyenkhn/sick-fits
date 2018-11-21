// Mutations must match the Schema
const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in

    // Access the database from context
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args

          /*  Above is same as:
        title: args.title,
        description: args.description
        */
        }
      },
      info
    ); // pass info as a 2nd arg

    return item;
  },

  updateItem(parent, args, ctx, info) {
    // first take a copy of the udpates
    const updates = { ...args };
    // remove the ID from the updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  }
};

module.exports = Mutations;
