# Reducer component

`Counter.recomp`

```
store:reducer StoreCounter(initialCount) {
    actions {
        Tick
    },
    state {
        type {
            count: int,
            timerId?: ref(intervalId:global)
        },
        initial {
            count: initialCount,
            timerId: ref()
        },
    },
    mutators: {
      counter: createCounter(state.count)
    },
    reducer {
        Tick {
            Update: increase(counter, 1)
        }
    },
  }
},
```

Render factory

```
render DisplayCounter(count) {
    <div> {
      count
    }
  }
```

Counter component

```js
component:reducer Counter {
  props {
    initialCount = 0
  },
  store {
    counter: StoreCounter(initialCount)
  },
  didMount {
    startTimer!(Tick)
  },
  willUnmount {
    resetTimer!
  },
  render: DisplayCounter(count)
}
```

Outputs:

```reason
type action =
  | Tick;

type state = {
  count: int,
  timerId: ref(option(Js.Global.intervalId))
};

let component = ReasonReact.reducerComponent("Counter");

let make = _children => {
  ...component,
  initialState: () => {count: 0, timerId: ref(None)},
  reducer: (action, state) =>
    switch (action) {
    | Tick => ReasonReact.Update({...state, count: state.count + 1})
    },
  didMount: self => {
    self.state.timerId :=
      Some(Js.Global.setInterval(() => self.send(Tick), 1000));
  },
  willUnmount: self => {
    switch (self.state.timerId^) {
    | Some(id) => Js.Global.clearInterval(id)
    | None => ()
    }
  },
  render: ({state}) =>
    <div>{ReasonReact.string(string_of_int(state.count))}</div>
};
```
