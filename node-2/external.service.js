module.exports = {
  name: "external",
  settings: {
    rest: ""
  },

  actions: {
    call: {
      handler() {
        return "I'm external action";
      }
    },
  }
};
