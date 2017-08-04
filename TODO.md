# Todos

## Overall

- Move mobile dir to same level as server
  - have heroku deal with this well

## Backend

- Add auth system
  - validate password and username on JWT issue
  - return real user info on login
  - Scope all necessary api calls by JWT
  - Update seeds to reflect new auth setup

- handle empty front page well

- Post deletion works (remove all child elements)

- Move more logic into dedicated modules

- add way to get user info (to display in the chats)

## Frontend

- Add user login and auth
  - check for the jwt before asking
    to login or trying to get the jwt
  - login makes real post
    - store user info
    - store jwt
  - chat shows and uses user info
  - edit and removing posts scoped by user

## Roadmap

### Needed before release

- general app navigation
- uber basic chat
- posts (links only)
- only mobile app
- user sign in (not sign up) and auth on app

### Next Steps

- channel creation and editing
- user sign up on app
- club creation and editing
- web equivalence

### Next Next Steps

- notifications
- discussion posts
- invitations

### Next Next Next Steps

- notification config
- ? user defined features ?
