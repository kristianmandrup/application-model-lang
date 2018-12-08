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

### Example using extends and tags

We can use _anchor id_ identifiers, such as `WebShop#test` to tag the application for the test context. We can add meta information using the `meta` object, which is available on any of the main types of application entities...

```
application WebShop#test {
    meta: {
      env: 'test',
      type: 'web'
    },
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

## Developer bliss!!

Each developer can develop the application models in his/her own preferred way, as the model development is completely decoupled from the writing of the application files.

In fact, we are no longer tied down to the file system using this approach!

Each developer can even have their own configuration for how and where the different application entities are written, while still collaborating seamlessly, again suiting individual developer preferences.

When deployed to a server, the organisation can decide on a particular file output strategy.

Using a higher level language also means way less merge conflicts and lets developers work semlessly in a decoupled fashion. Each entity is completely decoupled and well structured by design. The AML contains the skeleton, the sidecar contains the application logic. Much like an interface and implementation. AML thus removes boilerplate from the equation!

### Side car

The AML artifacts do not contain application logic, only function calls that are delegated/performed by the sidecar.

```
user-model.aml
user-model.js
```

```js
const React = require("react");
export const getState = ({ initial, ctx }) => React.useState(initial);
```

There are converters from js to most popular "compile to js" languages, so it is a good lingua franca.

- [jeason: js to reason](https://github.com/chenglou/jeason)
- ...

The exported functions in `user-model.js` are called by the compiled

```js
/domains
  /user
    UserModel.reason
    UserModel_Sidecar.reason
    user-model.js

```

`UserModel_Sidecar.reason`

With external binding to `user-model.js` file

```reason
let getState = (~initial, ~ctx) => /* ... /*
```

`UserModel.reason`

```reason
open UserModelSideCar;

module Counter = {
  let component = ReasonReact.component("Counter");

  let make = (~initial=0, _children) => {
    ...component,
    render: _self => {
      let (count, setCount) = getState(~initial, ~ctx=_self);
      <div>
        {ReasonReact.string(string_of_int(count))}
        <button onClick={_ => setCount(. count + 1)}>
          {ReasonReact.string("Click me")}
        </button>
      </div>;
    },
  };
};
```
