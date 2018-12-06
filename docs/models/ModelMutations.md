# Model mutations

```
models User {
    mutation {
        single: Single,
        list: List,
    }
}
```

## Single

Mutate a single Model entity

- own
- by id
- first by search criteria

```
model User {
    mutate {
        single {
            own {
                ownerId: session(userId)
            },
            byId {
                ownerId: userId
            },
            first {
                // query list by crieria
                // return first
            },
            latestMatch {
                // query list by crieria
                // return latest (by creation date)
            }
        }
    }
}
```

## List

Mutate a list of matching Models:

- all
- owned
- owned by particular user
- all matching filter criteria

```
model Product
    mutate {
        list {
            all {
                // use default
            },
            own {
                ownerId: session(userId)
            },
            ownedBy {
                ownerId: userId
            }
        }
    }
}
```
