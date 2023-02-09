<p align="center">
  <a href="https://turbosrc.org">
    <img src="images/turbosrc-light-big.png" width="500px" alt="TurboSrc logo"/>
  </a>
  <a href="https://turbosrc.org">
    <img src="images/turbosrc-dark-big.png" width="500px" alt="TurboSrc logo"/>
  </a>
</p>

Further documentation is forthcoming.

## Install

### Clone
```
git clone https://github.com/turbo-src/service
```

## Install NVM to run Node v12.22.0:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
```
## Close and reopen terminal
```
nvm install v12.22.0
```
```
nvm use v12.22.0
```
## Then install dependencies
```
npm install
```
## Start server
```
node server
```
### config

You'll need a `.config.json` file. Fill in as appropriate.

- replace YOUR_USERNAME with your Github username
- replace YOUR_TOKEN with: jwt.sign({ githubToken: <your github acess token> }, JWT) <br />
- replace JWT with a secret value

```
{
    "github": {
        "organization": "turbo-src",
        "user": "YOUR_USERNAME",
        "apiToken": "YOUR_TOKEN"
    },
    "turbosrc": {
        "endpoint": {
          "mode": "online",
           "url": "http://localhost:4000/graphql"
        },
        "jwt": "JWT",
        "store": {
            "repo": {
                "addr": "REPO_ADDR",
                "key": "REPO_KEY"
            },
            "contributor": {
                "addr": "YOUR_ADDR",
                "key": "YOUR_KEY"
            }
        }
    },
    "offchain": {
        "endpoint": {
          "mode": "online",
          "url": "http://localhost:4002/graphql"
        }
    },
    "namespace": {
        "endpoint": {
          "mode": "online",
          "url": "http://localhost:4003/graphql"
        }
    },
    "gh": {
        "endpoint": {
          "mode": "online",
          "url": "http://localhost:4004/graphql"
        }
    },
    "testers": {
        "a": {
          "user": "tsrctester1",
          "key": "TEST_KEY_1",
	      "apiToken": "ENCRYPTED_TOKEN_1"
        },
        "b": {
          "user": "tsrctester2",
          "key": "TEST_KEY_2",
	      "apiToken": "ENCRYPTED_TOKEN_2"
        },
        "c": {
          "user": "tsrctester3",
          "key": "TEST_KEY_3",
	      "apiToken": "ENCRYPTED_TOKEN_3"
        },
        "d": {
          "user": "tsrctester4",
          "key": "TEST_KEY_4",
	      "apiToken": "ENCRYPTED_TOKEN_4"
        },
        "e": {
          "user": "tsrctester5",
          "key": "TEST_KEY_5",
	      "apiToken": "ENCRYPTED_TOKEN_5"
        },
        "f": {
          "user": "tsrctester6",
          "key": "TEST_KEY_6",
	      "apiToken": "ENCRYPTED_TOKEN_6"
        },
        "g": {
          "user": "tsrctester7",
          "key": "TEST_KEY_7",
	      "apiToken": "ENCRYPTED_TOKEN_7"
        },
        "h": {
          "user": "tsrctester8",
          "key": "TEST_KEY_8",
	      "apiToken": "ENCRYPTED_TOKEN_8"
        },
        "i": {
          "user": "tsrctester9",
          "key": "TEST_KEY_9",
	      "apiToken": "ENCRYPTED_TOKEN_9"
        },
        "j": {
          "user": "tsrctester10",
          "key": "TEST_KEY_10",
	      "apiToken": "ENCRYPTED_TOKEN_10"
        },
        "k": {
          "user": "tsrctester11",
          "key": "TEST_KEY_11",
	      "apiToken": "ENCRYPTED_TOKEN_11"
        },
        "l": {
          "user": "tsrctester12",
          "key": "TEST_KEY_12",
	      "apiToken": "ENCRYPTED_TOKEN_12"
        }
    }
}
``
