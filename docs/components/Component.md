# ReasonComponent

## GraphQL components

- [Query component](./QueryComponent.md)
- [Mutation component](./MutationComponent.md)

## Reducer component

TODO

## Counter

`Counter.recomp`

```
component Counter {
  props {
    initial = 0
  },
  states {
    count: {
      initial,
      value: count#int,
      action: setCount,
      mutators: {
        counter: createCounter(count, setCount)
      },
      triggers {
        Increase {
          target: counter
          action: Add(1)
        }
      },
    }
  },
  render {
    <div> {
      count,
      <button> {
        @click => Increase,
        text: "click me"
      }
    }
  }
}
```

Output:

```reason
module Counter = {
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
};
```

## Implicit dividers

Imlicit `div` by using `<>`

```
  render {
    <> {
      <text-input> {
          name: "name",
          value: name,
          placeholder: "enter your name"
      },
      count,
      <button> {
        name: counter
        on-click => increase,
        text: "click me"
      },
    }
  }
```

Note that the various JSX nodes will be resolve to different target nodes depending on the target "platform". So that for native, a `div` or `<>` will result in a `view` element.
The `text-input` can likewise differ, even being mapped to particular component frameworks.

## Fragments

Fragments support using `<+>`:

```
  render {
    <+> {
      count,
      <button> {
        @click => increase,
        "click me"
      }
    }
  }
```

## Layout

The elements rendered can be laid out (layout) using a separate layour config that can be reused/extended across multiple components.

```
layouts {
    // generic base layouts
    inputs {
        <input> {
            align: center,
            flex: 1
        },
        <text-input> {
            extends: input
        },
        <password-input> {
            extends: input
        }
    },
    register {
        extends: inputs,
        // overrides
        <password-input> {
            // override some attributes
        }
    },
    // ...
}
```

You can plug-in one or more layouters that can layout to suit the target platform.
