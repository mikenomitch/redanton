# Todos

## Backend

- Set up create & update json endpoints properly (and make non jsons work for memberships)

- Make root level channels index scoped to user

- Add auth system (return error if Post not in one of their clubs)

- Add good seed files (1/4 of the way)

## Frontend

- display front page in a list on react natvie

- Build out the main views of the app
  - Navigation
    - Stream
    - Chans
    - Add?
    - Prof
  - Stream View (can consume any stream, title)
    - Title (Stream or Channel)
    - Post List (Name, Activity with who what when, Go)
    - Add New Post
  - Channels List
    - Title (All Channels, or Club Name)
    - Channel List (Name, Club, Notifications/In Stream?, Go)
  - Post Show
    - Title
    - Who Posted and When
    - Content (with link)
    - Chat
  - Chat Room
    - Standard Chat
    - Return to the Post
  - Post Create
    - Type
    - URL
    - Title (autofills)
    - Chan (or chans?)
    - Post Button
  - Profile
    - Clubs
    - Notifications?
    - Image, Name, Email

- Re-scope user auth'd stuff and build out auth on iOS
  - use webviews & normal auth system first? (possible?)
  - use Canary?
