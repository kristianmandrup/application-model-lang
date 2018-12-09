module.export = {
  services: {
    "reason-react": {
      location: "@aml/reason-react-service",
      templates: "default"
    },
    "reason-graphql": {
      location: "@aml/reason-graphql-service",
      templates: "default",
      structure: "./aml/structure/graphql"
    },
    "reason-domain": {
      location: "@aml/reason-domain-service",
      templates: "default",
      structure: "./aml/structure/domain"
    }
  },
  settings: {
    projectRoot: __dirname,
    services: {
      transport: "websockets",
      port: "6226"
    }
  }
};
