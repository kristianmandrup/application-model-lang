# Model queries

```
models User {
    query {
        single: Single,
        list: List,
    }
}
```

## Single

Get a single Model entity

- own
- by id
- first by search criteria

```
model User {
    query {
        single
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

Get a list of Models:

- all
- owned
- owned by particular user
- all matching filter criteria

```
model query list Product {
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
```
