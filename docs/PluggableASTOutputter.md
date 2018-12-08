# Pluggable AST outputter

We would like to be able to generate the final output to support a range of languages, frameworks etc. For this to work, we need a plugin system.

The target environment can then select a number of plugins via installation of npm modules.
A plugin is a service.

Each service module must have a main file, which when executed starts listening to a given port (default `6226`) for specific AST messages.

The project needs to have a config file which lists the services to be used and executed:

`aml-services.json`

```json
{
  "services": {
    "typeorm": {
      "location": "@aml/reason-typeorm-service",
      "templates": "default"
    },
    "reason-react": {
      "location": "./aml/services/my-reason-react"
      // implicit "templates": "default"
    },
    "reason-graphql": {
      "location": "@aml/reason-graphql-service",
      "templates": "./aml/templates/reason-graphql-service",
      "structure": "./aml/structure/graphql"
    }
  },
  "settings": {
    "transport": "websockets",
    "port": "6226"
  }
}
```

Note that each service can take configurations such as:

- templates to be used
- file structure definition to guide outputter where to output files
- service specific metadata

When a plugin (service) receives an AST of interest, it can process and output one or more files to reflect it. Multiple services can even collaborate by passing messages between each other if needed!

Multiple services can subscribe to the same type of AST node to output multiple files.
Typical example, a domain form:

- form display/layout
- form validation
- form state management

The settings are sent to each [Pluggable MicroServices](./docs/MicroServices.md)
