# Application Meta Language

Also known as `ApplicationML` or Application Model Language.

Declare the outline of your application declaratively. Plugin a set of services for your language/framework preferences. Select specific service templates to be used (such as for customization)

The compiler will then parse the definition, send the AST nodes to subscribing services which "spit out" application artifacts according to your preferences.

    "One ring to rule them all"

- designed to be highly pluggable.
- will include editor IDE support, initially for VS Code.

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

### Example: Counter component

```
component Counter {
  props {
    initial = 0
  },
  states {
    count: Count(initial)
  },
  render: Display#Counter(Increase, count)
}
```

Reson output: `CounterComponent.re`

```reason
let component = ReasonReact.component("Counter");

let make = (~initial=0, _children) => {
  ...component,
  render: _self => {
    let (count, setCount) = ReactHooks.useState(initial);
    <div>
      {ReasonReact.string(string_of_int(count))}
      <button onClick={_ => setCount(. count + 1)}>
        {ReasonReact.string("Click me")}
      </button>
    </div>;
  },
};
```

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

By combining and compose he variants of each to form new models.

### Example using extensions

```
application WebShop#test {
    extends: Webshop,
    // overrides
    fields: Fields#test,
    domains: Domains#test,
}
```

## Language Infrastructure

Pluggable MicroServices to process and output AST as files

- [MicroServices](./docs/MicroServices.md)
- [AST Outputters](./docs/PluggableASTOutputter.md)

## Parser Generator

- [Chevrotain Parser Generator configuration](./docs/ParserGenerator.md)
