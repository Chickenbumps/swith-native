module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "swith-backend",
      url: "http://localhost:4000/graphql",
    },
  },
};
