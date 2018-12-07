## Query component

`GetPokemonQuery.aml`

```
component GetPokemonQuery {
    queries {
        pokemonQuery: GetPokemon(name="Pikachu")
    },
    switch {
        Loading {
            <div> { "Loading" }
        },
        Error(error) {
            "error##message"
        },
        Data(response) {
            "response##pokemon##name"
        }
    }
};
```

Output:

```reason
module GetPokemonQuery = ReasonApollo.CreateQuery(GetPokemon);

let make = _children => {
  /* ... */,
  render: _ => {
    let pokemonQuery = GetPokemon.make(~name="Pikachu", ());
    <GetPokemonQuery variables=pokemonQuery##variables>
      ...{
           ({result}) =>
             switch (result) {
             | Loading => <div> {ReasonReact.string("Loading")} </div>
             | Error(error) =>
               <div> {ReasonReact.string(error##message)} </div>
             | Data(response) =>
               <div> {ReasonReact.string(response##pokemon##name)} </div>
             }
         }
    </GetPokemonQuery>;
  },
};
```
