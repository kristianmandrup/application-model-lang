# Resolvers

## Base resolvers

```
resolvers Base {
    query {
        base {
            execute {
                args {
                    validate {
                        onError {
                            trigger: invalid
                        }
                    }
                },
                model {
                    fetch {
                        onError {
                            trigger: error
                        }
                    }
                }
            }
        },
        own {
            fields {
            },
            execute {
                model {
                    ownerId: session(userId)
                }
            }
        },
        findByOwner {
            fields {
                userID
            },
            execute {
                model {
                    ownerId: userId
                }
            }
        }
    },
    mutation {
        base {
            execute {
                model {
                    create,
                    validate {
                        onError {
                            trigger: invalid
                        }
                    },
                    save {
                        onSuccess {
                            trigger: success
                        },
                        onError {
                            trigger: error
                        }
                    }
                },
            }
        },
        owned {
            extends base,
            before {
                lookup {
                    own
                },
                assign {
                    own
                }
            }
        }
    }
}
```

## User mutations

```
mutations User {
    extends Base,
    create {
        model User, // implicit
        fields {
            name,
            email
        },
    },
    update {
        // by default update should always extend create by adding id field
        extends create,
        fields {
            id
        }
    },
    delete {
        // using implicit User model
        fields {
            id // by default any non-create resolver should assume id field
        }
    },
    toggleStatus {
        fields {
            status
        },
        action {
            toggle // inverse boolean on/off
        }
    },
    assignRole {
        fields {
            // id is implicit
            role
        }
    }
}
```

## User queries

```
queries User {
    findByOwner {
        fields {
            id
        }
    },
}

```

## Product resolvers

```
resolvers Product {
    extends Base,
    create {
        model User, // implicit
        fields {
            name,
            userId
        },
        execute {
            query {
                user: userId
            },
            result {
                onSuccess {
                    trigger: success
                },
                onError {
                    trigger: error
                }
            }
        }
    },
}
```
