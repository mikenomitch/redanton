# Todos

## Overall

- Move mobile dir to same level as server
  - have heroku deal with this well

## Backend

- Move more logic into dedicated modules
- add proper authorization to create, update, delete calls

## Frontend

- Get keys from AsyncStorage (like localstorage works)
- If jwt is in localstorage onLoad dont show login
- Login dispatches thunk (create thunks directory)
  - adds auth on return
  - adds user info on return
- add reducers
  - clubs
  - channels
  - posts
  - messages

- add list => map actions (DRY)
- add merge/update actions (DRY)

- add call tracking
  - api based middleware? (this seems like a good plan)
  - does not modify fetcher
  - able to handle multiple calls of the same type
    out of the gate

- replace local state (when not editing)
  with redux state
- make an optimistic update on post edit
  - make sure failure works well
  - make sure success works well

- chat shows and uses user info

- scope edit & removing posts by user who
  created them

## Roadmap

### Needed before release

- general app navigation
- uber basic chat
- posts (links only)
- only mobile app
- user sign in (not sign up) and auth on app

### Next Steps

- user sign up on app
- sorting streams by activity
- channel creation and editing
- club creation and editing
- web equivalence

### Next Next Steps

- notifications
- discussion posts
- invitations

### Next Next Next Steps

- notification config
- ? user defined features ?
