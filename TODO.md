# Todos

## Web UI
- make general responsive new page
  - implement on post
  - implement on channel
  - implement on club
- make general responsive show page
  - implement on channel
  - implement on club
- add link to chat from post stream
- add chat JS channel/socket logic

- add sign out link to the layout´

- style the login page for mobile first
- style the sign up page for mobile first

- hide editing and deleting if you are
  not the ownder of a post/chan/club
- add a link helper so url's can take
  multiple formats
- make "flash" notifications look nicer
  and be clearable (maybe this has been
  done in elixir before)


## Quick Wins
- front page does not clear itself
  from time to time
- navigation headers reload properly
- add debounce to navigation
  - new post
  - new channel
  - to comments
  - main links
  - new member
  - new club
- alerts on post failure look nicer

## Push Notifications
- https://docs.expo.io/versions/latest/guides/push-notifications.html
- Make presence on chat create a new check in
  every N minutes
- Make the check in creation async
- Change to a real push notification

## Backend
  - add proper authorization to all create, update, delete calls

## Frontend
  - call tracking
    - add to withFetching middleware
    - add calls reducer
    - able to handle multiple calls of the same type
      out of the gate
    - auto-reload if have not refreshed in a while
      (app closed an reopened much later)
    - dont show pages until needs are loaded
  - make an optimistic update on post edit
    - make sure failure works well
    - make sure success works well
  - async redux actions as promises (establish and
    follow a solid pattern here)
  - auth logic
    - If jwt will expire soon, reauth it before the next call
  - clean up socket logic

## Ops
- set secrets via kubernetes (show a test secret in the ui)
- set environment to prod on the prod machines
- point deployed boxes to cloud sql using secrets
- figure out how to shell prod
- script for:
  - build and deploy local code => prod
  - run migration on prod
  - get into prod shell
  - get prod app logs
- set up prod branch on github with CD via
  kubernetes/google container builder?
- remove project on heroku
- document all
