# Todos

## Backend

- Remove unneeded MCV

- Create MIgratsions and Models for

  - club membership
  - channels
  - channel/club relationships
  - channel/user relationships (access via clubs w/ options above that? - keep empty for now)
  - posts
  - channel/post join
  - comments
  - comments/parent join (post or other comment)

- Display lists of these things properly via html.eex

- Properly scope what somebody can see based on membership

- Add api/v1/routes and JSON views for all types

- Add realtime chat channels to all groups

## Frontend

- Style the html enough where you can use w/ dan

  - make simple layout using html.eex (10 min set timer)

  - style the following pages (5 min per page)

	- groups list
  	- group show/chan list
  	- chan show/post list
  	- post show/comment list
  	- user login/auth stuff

- React Native iOS tutorial

- Unscope the user stuff and hook up APIs to React Native

- Build out the main views of the app

- Re-scope user auth'd stuff and build out auth on iOS
	- use webviews & normal auth system first? (possible?)
  - use Canary?
