# Todos

## Top
  - notification options
    - all, default, mute
      or just default and mute?
  - one post => many channels?
    - refine concept of channels in general?
      - ask erik & victoria
  - new posts count/activity info?
  - mobile new user walk thru & empty page prompts
  - general design/UI/UX work
  - timezones working
  - password change with old pw

## Mobile Frontend
  - auth
    - If jwt will expire soon, reauth it before the next call
    - unauthorized logic handling works nicely
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
