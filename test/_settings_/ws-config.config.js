module.export = {
  services: {
    "reason-react": {
      location: "./aml/services/my-reason-react"
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
    projectRoot: path.join("../../", __dirname),
    services: {
      transport: "websockets",
      port: "6226"
    }
  }
};
