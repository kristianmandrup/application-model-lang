# Mutation component

```
component {
    mutations {
        newPokemon: AddPokemon(name: "Bob")
    },
    render {
        <div> {
            <button> {
                @click => mutation(variables: newPokemon, refetch: getAllPokemons),
                "Add Pokemon"
            }
        }
    }
}
```

```reason

module AddPokemonMutation = ReasonApollo.CreateMutation(AddPokemon);

let make = _children => {
  /* ... */,
  render: _ =>
    <AddPokemonMutation>
      ...{
           (mutation /* Mutation to call */, _) => {
             /* Result of your mutation */

             let newPokemon = AddPokemon.make(~name="Bob", ());
             <div>
               <button
                 onClick={
                   _mouseEvent =>
                     mutation(
                       ~variables=newPokemon##variables,
                       ~refetchQueries=[|"getAllPokemons"|],
                       (),
                     )
                     |> ignore
                 }>
                 {ReasonReact.string("Add Pokemon")}
               </button>
             </div>;
           }
         }
    </AddPokemonMutation>,
};
```
