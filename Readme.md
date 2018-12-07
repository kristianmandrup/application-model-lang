# Higher Reason

A set of high level language that declares the outline of an application.
This definition can be used across languages, frameworks etc.
It is designed to be highly pluggable.
It will include editor IDE support, initially for VS Code.

## Application model

```
application WebShop {
    infra: Infra,
    fields: Fields,
    domains: Domains,
    components: Components
}
```

- [Domain models](./docs/DomainModel.md)
- [Fields](./docs/Fields.md)
- [Infrastructure](./docs/Infrastructure.md)
- [Components](./docs/components/Component.md)
- [GraphQL](./docs/graphql/GraphQL.md)

## Environments

The model should make it easy to create multiple application definitions, such as for:

- dev
- test
- staging
- production
- feature spike
- experimental
- variants
- ...

### Test setup inheriting from Base setup

```
application TestWebShop {
    extends: Webshop,
    // overrides
    fields: TestFields,
    domains: TestDomains,
}
```
