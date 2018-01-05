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
      - migration that adds Tag table and PostTag table - DONE
      - migration that adds data for each channel - DONE
      - Add models and associations (in new models) - DONE
      - Add associations in old models - DONE
      - tag index uses the new models, and automatically find the right tags
        - web - DONE
        - mobile - DONE
      - tag show only shows the posts you CAN see, that also have that tag
        - web - DONE
        - mobile - DONE
      - remove old places to eplicitly create/edit channels/tags
        - web - DONE
        - mobile - DONE

    - PUSH E
      - Multiple tags can be added on web
        - new - DONE
        - edit - DONE
      - Multiple tags can be added on mobile (backwards compat)
        - tag input creates a string with comma separated tags - DONE
        - tag values come in from the api and populate the input - DONE
        - updates add and remove tag values from the store properly - DONE
        - edit gets the tag vals, new gets an empty value - DONE
          - posts are returned on the api with tags and posts_tags - DONE
          - these get normalized (stripped from tags and stuck in store) - DONE
            - note using normalizr later - DONE
          - tagsForPost used on edit page - DONE
      - Tags show up on the stream Mobile - DONE
          - tagsForPost used on the stream - DONE
          - links are clickable - DONE
      - Removing posts, tags, channels all works okay (with and without tags)
        - Check on mobile while in the headspace - DONE
      - Tags show up on the post show and stream - DONE
        - Web - DONE
      - post_count comes thru on all tags via api - DONE
      - Deploy and migrate and publish app

    - PUSH F
      - purge any Channel references anywhere on backend

    - PUSH G
      - Fix the awful N+1s


  - pw reset link on mobile
  - password reset and other emails show up
    correctly on iOS mail and other clients
  - sign in requires email activation
  - email column is case insensitive

  - turn email notificatiosn back on
    (but maybe batch more aggressively?)
  - check-ins clear notifications
  - new notification when person joins a group
  - user notification setting
  - channel mute & watch notification settings

  - unseen chat & post count
  - TLC around new user walkthru (web)
  - Posts show discussion vs Link
  - Preview of content on stream item
  - When you create a club the message tells you
    how many tags you made

  - TLC around new users/clubs/tags (mobile)
  - Deep linking w push notifications