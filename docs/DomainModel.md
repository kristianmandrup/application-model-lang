# Domain model

```
domains {
    Base {
        models {
            fields {
                id: string,
            }
        }
    },
    User
}
```

## Base

`domains/Base.hre`

```
domain Base {
    models
}
```

### Base models

```
models Base {
    base {
        fields {
            id: string,
        }
    },
    db {
        extends: base,
        createdAt: {
            type: date,
            generate: onCreate
        },
        updatedAt: {
            type: date,
            generate: onUpdate
        }
    },
    mongo {
        extends: db,
        fields {
            id: {
                type: string,
                generated,
                primary
            }
        }
    },
    postgres {
        extends: db,
        fields {
            id: {
                type: int,
                generated,
                primary
            }
        }
    }
}
```

## User

`domains/User.hre`

```
domain User {
    extends: Base,
    // for DB
    models: User
    forms: User
    display User
}
```

### User forms

```
forms User {
    Base {
        fields {
            extends: models.base
        },
        render {
            name: <text-input>,
            email: <text-input>
        },
        validate: onSubmit
    },
    Update {
        extends: Base,
        validate: {
            field: onChange
        }
    },
    Create {
        extends: Base,
        fields {
            confirmPassword: {
                transient,
                type: string,
                render: <password-input>,
                validate: sameAs('password')
            },
            acceptLegal: {
                transient,
                type: string,
                render: <checkbox>,
                validate: {
                    validators {
                        isChecked
                    }
                }
            }
        },
        actions {
            submit {
                enable {
                    validated
                }
            }
        },
        triggers {
            onCreate: setToken(self)
        }
    }
}
```

### User display

```
display User {
    single {
        extends: models.base
    },
    list {
        item {
            fields {
                avatar {
                    thumbnail: small
                },
                name: <caption>,
                email: <mailto-link>
            },
            actions {
                update {
                    display {
                        form: update
                    }
                },
                delete {
                    confirm
                }
            }
        },
        items {
            paginate {
                pageSize: 20
            },
            actions {
                create {
                    display {
                        form: register
                    }
                }
            }
        }
    }
}
```

### User Models

```
models User {
    base {
        fields {
            id,
            name: string,
            email: string
        }
    }
},
```
