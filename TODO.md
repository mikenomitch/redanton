# Todos

## Club Mgmt
- invite user
  - inviter puts in email and hits send
  - finds_or_creates user (with 'pending' status if new)
  - standard membership created
  - email send to the person (with just an alert now)
  - when logged out have the options to sign in or sign up
  - if sign_up and user is created but pending, they
    are taken to page to fill out info
  - if sign up and user is created and not pending,
    it fails
  - if sign up and user is not created, give email &
    password (with confirmation) and then go
    to the info page
  - memberships just show up once youre signed in like
    they had always been there (for now)

- add user status to model/table
- start w 100% new user sign up
- add user invite that creates a pending user
- completion of sign up as that user

## Push Notifications
- Change this to a push notification
- Make presence on chat create a new check in
  every N minutes
- Make the check in creation async
- Clean up backend modules

## Quick Wins
- posts without a url just become a discussion post
- if sole admin leaves another is elevated

## Backend
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
