# Fields

Fields definitions that can be reused and applied across the app.
This includes:

- model fields
- validations
- display
- form fields
- ...

```
fields {
    validations {
        name {
            alphaNumeric,
            minLength: 2
        },
        email {
            pattern: /\w+@\w+.\w+/,
            minLength: 4
        }
    },
    displays {
        name {
            base {
                render: <caption>
            },
            small {
                extends: base
            },
            large {
                render: <title>
            }
        },
    }
},
```
