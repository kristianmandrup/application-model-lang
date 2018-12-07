# Mutation

`AddPokemon.aml`

```
mutation addPokemon($name: String!) {
    addPokemon(name:$name) {
        name
    }
}
```

Output:

```reason
module AddPokemon = [%graphql
  {|
    mutation addPokemon($name: String!) {
      addPokemon(name: $name) {
          name
      }
    }
  |}
];
```
