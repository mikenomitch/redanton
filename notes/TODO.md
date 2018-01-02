## TODOS


  - CHANNELS => OPTIONAL TAGS
    - PUSH A (set up  club/post relationship)
      - migration to add new col - DONE
      - migration that caches the club ID on each post - DONE
      - new posts get the club ID saved onto them - DONE
        - api - DONE
        - web - DONE
    - PUSH A.2
      - associations on models are changed to be direct - DONE
      - getters for posts in clubs just use the club-id directly - DONE
    - PUSH B (remove some channel stuff)
      - club comes thru on api stuff - DONE
      - breadcrumbs
      - club replaces channel on new posts
      - channels not needed when you create a club
      - channels not needed on the clubs page
        - web
        - mobile
      - channel names replaced with club names on stream
        - web
        - mobile
          - requests club names earlier
    - PUSH C (public renaming)
      - web
        - homepage
        - routes (api keeps old ones too, but adds new as well)
        - header
        - new, edit, index
        - club page
        - post show
        - prompts
        - notifications?
      - mobile
        - nav (and shuffle positions)
        - new, edit, index
        - posts, clubs
        - prompts
        - walkthru
    - PUSH D (Channel now one to many, on backend)
      - migration that adds Tag table and PostTag table
      - migration that adds data for each channel
      - new tags create the new model and Not the old
        - web
        - mobile
      - indeces use the one to many
        - web
        - mobile
    - PUSH E
      - Multiple tags can be added on web
      - Multiple tags can be added on mobile (backwards compat)
      - Tags index shows the right stuff if it is empty (but doesn't roadblock you ever)
      - Tags show up on the stream
        - Web
        - Mobile
      - Tags show up on the post show
        - Web
        - Mobile
    - PUSH F
      - purge any Channel references anywhere on backend




  - password reset and other emails show up
    correctly on iOS mail and other clients
  - sign in requires email activation
  - email column is case insensitive
  - pw reset link on mobile

  - check-ins clear notifications
  - new notification when person joins a group
  - user notification setting
  - channel mute & watch notification settings

  - unseen chat & post count
  - TLC around new user walkthru (web)
  - Posts show discussion vs Link
  - Preview of content on stream item
  - When you create a club the message tells you
    how many channels you made

  - Mobile club creation promps for channels
    (with a nice input of some sort)
  - TLC around new users/clubs/chans (mobile)
  - Deep linking