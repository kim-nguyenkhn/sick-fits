const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * setJwtToken(ctx, token) - utility function to set the Jwt to the cookies
 */
const setJwtToken = (ctx, token) => {
  ctx.response.cookie("token", token, {
    // Disable JS from accessing cookies
    httpOnly: true,
    // 1 year cookie
    maxAge: 1000 * 60 * 60 * 24 * 365
  });
};

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
    setJwtToken(ctx, token);

    // FINALLY, return the user to the browser
    return user;
  },

  /**
   * login() - Handles login
   */
  async login(parent, { email, password }, ctx, info) {
    // 1. Check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if the password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(`Invalid password!`);
    }
    // 3. Generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    setJwtToken(ctx, token);
    // 5. Return the user
    return user;
  },

  /**
   * logout() - Handles signing out.
   */
  async logout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  }
};

module.exports = Mutations;
