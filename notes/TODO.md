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
      - breadcrumbs - DONE
      - channel names replaced with club names on stream - DONE
        - web - DONE
        - mobile - DONE
          - requests club names earlier - DONE
      - channels not needed when you create a club - DONE
      - channels not needed on the clubs page (prompts)
        - web - DONE
        - mobile - DONE
    - PUSH B.2
      - replace channel_id index with club_id index in migration - DONE
      - any post.channel_id reference can fallback to nothing - DONE

      - club replaces channel in new
        - web - DONE
          - get rid of any channel_post routes - DONE
        - mobile - DONE

    - PUSH C (public renaming)
      - web
        - homepage - DONE
        - header - DONE
        - new, edit, index
        - club page - DONE
        - post show - DONE
        - prompts - DONE
        - notifications - DONE
        - breadcrumbs - DONE
        - routes (api keeps old ones too, but adds new as well) - DONE
        - error messages - DONE
      - mobile
        - nav (and shuffle positions) - DONE
        - new, edit, index - DONE
        - posts, clubs - DONE
        - prompts - DONE
        - walkthru - DONE
        - errors - DONE
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
      - Tag page can redirect to a new post that has a tag already on it
        - something similar for mobile
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