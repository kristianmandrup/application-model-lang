# Infra

`Infra.hre`

```
infra {
    Base {
        session: cookie,
    },
    Test {
        extends: Base,
        session: mock,
        backends {
            graphql {
                client: mock
            }
        }
    },
    Dev {
        extends: Base,
        backends {
            graphql {
                client: apollo
            }
        },
        environment: dev
    },
    Prod {
        extends: Base,
        environment: prod
    }
},
```
