# Todos

## Beautification and Clean up pre-Apple
  - Web
    - Edit and show page links & design
    - Change base text input design
    - Change alert desgin
    - Customer support page just for Apple
    - Timezones
    - More chat design work
    - Error message audit
    - Empty Club prompt
    - Error handling on Channel and Post creation
      (associations with parent)
  - Mobile
    - Club mgmt styling issues
    - Prompts flashing
    - New X Buttons when primpt showing
    - App Walkthru w/ parralax thing
    - First post not author bug
    - Edit user page looking nicer
    - Better error messages
    - Link to site in Settings
    - Nobody chatted message/prompt
    - Chat shows name not email letter
    - You are the only member message
      & prompt in the invite page
    - Apple Guidelines
      - All font at least 11
      - Check out hit targets
      - Max lengths on post/chan/club
        names (so the alignment isnt bad)
      - Add link to user support

## New Features
  - unseen chat count
  - notification options
    - all, smart, mute @ user settings level
    - all, smart, mute @ the channel level
    - default channel notifications settings by user
    - notification when person joins a group

  - refine concept of channels in general
    - one post => many channels?
      - ask erik & victoria
    - just make the channel when you make the club automatically?
    - when you make the club have them provide at least 1 channel name (**)

  - dedicated X-Post feature?


## Notifications plan
  - When a certain action happens (chat msg)
  - Check each users preferences (start w/ just user settings)
  - Add an object to a Notifications table
  - On save kick off a job that either immediately sends the notification
    to the person, or that waits N time (or til a time of day) and then
    comes back and reads all their pending notifications & clears them out
    then sends the messages (future jobs will come back too, but since
    the messages are cleared out they wont do anything)
    - if 6 jobs come back at 6 oclock... how do you make sure they dont
      all fire off the same messages?
      - dont make 6 of them


<!-- table: notifications -->
<!-- type: 'chat' | 'post' | 'invite' | 'new_user' -->
<!-- info: serialized hash w/ structure that depends on type -->
<!--  -->