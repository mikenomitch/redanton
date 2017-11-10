# Todos

## Today
- paper cuts
  - mobile
    - debouncing nav
      - new post
      - new channel
      - to comments
      - main links
      - new member
      - new club
    - header reloading
    - blur on inputs
    - reloading chat properly
    - is no first message, the message
      does not work
    - show all club posts
    - sorting within channel
    - clubs list in bottom bar
  - desktop
    - show club name w channels
    - sorting
    - removable flash messages
    - responsive header
    - show all club posts
  - backend
    - async check in creation

- features
  - pagination
    - mobile
    - desktop
  - notification options
    - all, default, mute
      or just default and mute?
  - chat check in every N minutes
    - mobile
    - desktop
  - homepage
    - something like this https://template56.carrd.co/
      but spun up by me and w out paralax
  - sign up and new user walk thru
  - empty pages work
  - design work!
    - get erik's help (eihaai)
  - one post => many channels

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
