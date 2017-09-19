# Todos

## Ecto Work
- Go thru controllers and look for things that
  can be queries
- Move things from getters to queries
- Make queries take "query" arg
- Remove any unused methods from models

## Sort By Activity
- Add query
- Use query on frontpage
  and on streams

## Push Notifications
- Change this to a push notification
- Make presence on chat create a new check in
  every N minutes
- Make the check in creation async
- Clean up module positions

## Quick Wins
- posts without a url just become a discussion post
- labels are added to the edit page

## Geneal Backend
  - add proper authorization to create, update, delete calls

## Frontend
  - clean up socket logic
  - make an optimistic update on post edit
    - make sure failure works well
    - make sure success works well
  - call tracking
    - add to withFetching middleware
    - add calls reducer
    - able to handle multiple calls of the same type
      out of the gate
  - auth logic
    - If jwt will expire soon, reauth it before the next call

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

## Paper Cuts
- make sure navigation headers can
  reload properly

## Features
- push notifications
  https://docs.expo.io/versions/latest/guides/push-notifications.html