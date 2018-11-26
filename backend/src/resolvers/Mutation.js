const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item - note the "raw" graphQL syntax here
    const item = await ctx.db.query.item({ where }, `{ id title }`);

    // 2. check if they own that item, or have permissions
    // TODO

    // 3. delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  /**
   * signup() - Handles signup
   */
  async signup(parent, args, ctx, info) {
    // lowercase everything
    args.email = args.email.toLowerCase();

    // use bcrypt to hash passwords
    const password = await bcrypt.hash(args.password, 10);

    // create the user in the database
    const user = await ctx.db.mutation.createUser(
      // createUser: the Prisma generated API
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );

    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // Set the JWT as a cookie on the response
    ctx.response.cookie("token", token, {
      // Disable JS from accessing cookies
      httpOnly: true,
      // 1 year cookie
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    // FINALLY, return the user to the browser
    return user;
  }
};

module.exports = Mutations;
