# Todos

## Today
- Auth start
  - admin
  - web show pages

## Web UI
- make "flash" notifications look nicer
  and be clearable (maybe this has been
  done in elixir before)
- header on mobile
- stream items on mobile

## Quick Wins
- fix front page clearing itself
- navigation headers reload properly
- add debounce to navigation
  - new post
  - new channel
  - to comments
  - main links
  - new member
  - new club

## Push Notifications
- https://docs.expo.io/versions/latest/guides/push-notifications.html
- Make presence on chat create a new check in
  every N minutes
- Make the check in creation async
- Change to a real push notification

## Backend
  - add proper authorization
    - api - all create, update, delete calls
    - web - posts, channels, clubs, users - all actions & admin

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
