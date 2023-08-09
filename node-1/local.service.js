module.exports = {
  name: "localservice",
  settings: {
    rest: ""
  },

  actions: {
    localaction: {
      rest: "GET /localaction",
      handler(ctx) {
        ctx.meta.$responseType = "text/plain";
        return "I'm local action";
      }
    },

    externalcall: {
      rest: "GET /externalcall",
      handler(ctx) {

        return ctx.call('external.call');
      }
    },
  }
};
