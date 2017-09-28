# Todos

## User Mgmt
- can update pw

- invite user
  - half signed up users can sign up
    - not full signed up users tho
    - switches to fully signed up

- UI update on
  - clubs list & mgmt
  - member list & mgmt
  - general settings page (10 min)

## Channel Mgmt
- channel creation works for multiple clubs
- front page works for multiple clubs

## Quick Wins
- adding a post/channel from a specific
  club locks in that parent
- posts without a url just become a discussion post
- navigation headers reload properly
- if sole admin leaves another is elevated

## Push Notifications
- https://docs.expo.io/versions/latest/guides/push-notifications.html
- Make presence on chat create a new check in
  every N minutes
- Make the check in creation async
- Change to a real push notification

## Backend
  - add proper authorization to all create, update, delete calls

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
