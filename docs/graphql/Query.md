# Query

`GetPokemon.hre`

```
query getPokemon($name: String!) {
    pokemon(name: $name) {
        name
    }
}
```

Output:

```reason
/* Create a GraphQL Query by using the graphql_ppx */
module GetPokemon = [%graphql
  {|
  query getPokemon($name: String!){
      pokemon(name: $name) {
          name
      }
  }
|}
];
```
