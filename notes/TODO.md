# Todos

## Today
- update friends

- mobile paper cuts
  - quick loading and/or nav debounce?
  - blur on inputs

## Push Notifications
- Push Notification Service Cleanup

## Check ins
- Make presence on chat create a new check in
  every N minutes
- Make the check in creation async

## Web UI
- make "flash" notifications look nicer
  and be clearable (maybe this has been
  done in elixir before)
- real responsive header on mobile

## Mobile Frontend
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
    - unauthorized logic handling works nicely
  - clean up socket logic

## Web Frontend
  - css cleanup & DRYness
  - js and css separation

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
