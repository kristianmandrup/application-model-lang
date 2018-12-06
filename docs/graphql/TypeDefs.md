# TypeDefs

```
backend Stripe {
    type User {

    },
    type Product {
        name {
            type: string,
            required,
            directives {
                constraints {
                    minLength: 4,
                    alphaNumeric
                }
            }
        }
    }
}
```
