# Todos

## Top
- Notifications
  - Settings per user
    - Batched at some time?
      - plus conversations youre active in
    - See Everything
- Web UI can do club and user mgmt
- Real responsive header on mobile
- Web JS and CSS DRY and separated
- Check ins maek mobile vs web
- Chat polls for updates in addition to
  the channel
  - as part of this polling it checks you in

## Check ins
- Make presence on chat create a new check in
  every N minutes
- Make the check in creation async

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
