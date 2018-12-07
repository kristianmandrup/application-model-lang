# Domain model

## Base

`domains/Base.hre`

```
domain Base {
    models // implicit : models
}
```

### Base models

`base-model.aml`

```
model Base {
    extends: base,
    createdAt: {
        type: date,
        generate: onCreate
    },
    updatedAt: {
        type: date,
        generate: onUpdate
    }
}
```

`mongo-model.aml`

```
model mongo {
        extends: db,
        fields {
            id: {
                type: string,
                generated,
                primary
            }
        }
    },
```

`postgres-model.aml`

```
record postgres {
    extends: db,
    fields {
        id: {
            type: int,
            generated,
            primary
        }
    }
}
```

`base-models.aml`

```
models Base {
    base {
        fields {
            id: string,
        }
    },
    db, // implicit : db
    mongo,
    postgres
}
```

## User

`domains/user.hre`

```
domain User {
    extends: Base,
    // for DB
    models: User
    forms, // implicit User
    display
}
```

### Forms

#### Base

```
form User:base {
    fields {
        extends: models.base
    },
    render {
        name: <text-input>,
        email: <text-input>
    },
    validate: onSubmit
},
```

#### Update

```
form User:update {
    extends: Base,
    validate: {
        field: onChange
    }
},
```

#### Create

`confirm-password-field.aml`

```
field confirmPassword {
    transient,
    type: string,
    render: <password-input>,
    validate: sameAs('password')
}
```

`accept-legal.aml`

```
field acceptLegal {
    transient,
    type: string,
    render: <checkbox>,
    validate: {
        validators {
            isChecked
        }
    }
}
```

```
form User:create {
    extends: Base,
    fields {
        confirmPassword,
        acceptLegal
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
```

### All User Forms

```
forms User {
    base,
    update,
    create
}
```

### User display

- one
- many

#### Single user display

```
display User:single {
    fields: {
        extends: models.base
    },
    // ...
}
```

#### List of users display

```
display User:many {
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
```

#### All User displays

```
displays User {
    one,
    many
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
