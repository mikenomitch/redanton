# Todos

## Overall

- Move mobile dir to same level as server
  - have heroku deal with this well

## Backend

- Move more logic into dedicated modules
- add proper authorization to create, update, delete calls

## Frontend

- change onSuccess structure
- reload posts main page after a post update

- chat hooked into redux flow
- chat passes and receives user info
- chat times returned on backend and
  frontend

- scope edit & removing posts by user who
  created them

- add settings tab
  - info
  - sign out

- make an optimistic update on post edit
  - make sure failure works well
  - make sure success works well

- auth logic
  - If jwt will expire soon, reauth it before the next call

- add call tracking
  - add to withFetching middleware
  - add calls reducer
  - able to handle multiple calls of the same type
    out of the gate

## Roadmap

### Needed before release

- general app navigation
- uber basic chat
- posts (links only)
- only mobile app
- user sign in (not sign up) and auth on app

### Next Steps

- sorting streams by activity
- channel creation and editing
- club creation and editing
- user sign up on app
- web equivalence

### Next Next Steps

- notifications
- discussion posts
- invitations

### Next Next Next Steps

- notification config
- ? user defined features ?
