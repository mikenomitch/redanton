# Todos

## Paper Cuts
- Sign in failure message
  - action-availible alerting
- URL can handle being http:// or not
- editing descriptions isnt so annoying
  - add optional label
  - return button must do something
- label over chan select on create
- Posted By should be accurate
- Editing should not be broken
- Previewing the content should be easier
- Removing a post actually removes it from
  the stream
- Redo the seeds
  - Single club (Brain Food)
  - Dan, Steven, Zach, Kevin
  - Clubs match actul brain food group
- make sure navigation headers can
  reload properly

## Overall

- Move mobile dir to same level as server
  - have heroku deal with this well

## Backend
  - Move more logic into dedicated modules
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
