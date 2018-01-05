import flatten from 'lodash/flatten'
import omit from 'lodash/fp/omit'
import omitBy from 'lodash/fp/omitBy'

import makeHashReducer, {mergeHashActions} from './hashReducer'
import withResetState from './withResetState'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

function __postsWithoutClub (state, clubId) {
  const belongsToClub = (post) => {
    return post.club_id === clubId
  }

  return omitBy(state, belongsToClub)
}

const defaultState = {}
function postReducer (state = defaultState, action) {
  switch (action.type) {
  case 'REMOVE_CLUB':
    return __postsWithoutClub(state, action.payload)
  default:
    return makeHashReducer('Post')(state, action)
  }
}

export default withResetState(defaultState, 'SIGN_OUT')(postReducer)

// ==================
// ==================
//      ACTIONS
// ==================
// ==================

const customPostActions = {
  onPostReturn: (res) => {
    return flatten(
      [
        {
          type: 'REMOVE_POSTSTAGS_FOR_TAGS',
          payload: res.data.tags
        },
        customPostActions.onPostsReturn({data: [res.data]})
      ]
    )
  },
  onPostsReturn: (res) => {
    const postsSansTagsAndPostsTags = res.data.map(p => omit(['tags', 'posts_tags'], p))
    // these tags aren't complete (to avoid extra data calls,
    // so make sure this merge is only additive)
    const tags = flatten(res.data.map((p) => p.tags))
    const postsTags = flatten(res.data.map((p) => p.posts_tags))
    // TODO: set up normalizr

    return [
      {
        type: 'MERGE_POSTS',
        payload: postsSansTagsAndPostsTags
      },
      {
        type: 'MERGE_TAGS',
        payload: tags
      },
      {
        type: 'MERGE_POSTSTAGS',
        payload: postsTags
      }
    ]
  }
}

export const postActions = mergeHashActions(customPostActions, 'Post')

// =================
// =================
//   ASYNC ACTIONS
// =================
// =================

export const getFrontPagePosts = (onSuccess, pageNumber = 1) => {
  return {
    type: 'GET_FRONT_PAGE_CALL',
    call: {
      action: 'GET',
      endpoint: `/front?page=${pageNumber}`,
      callKey: 'frontPagePosts',
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(postActions.onPostsReturn(res))
          onSuccess && onSuccess(res)
        }
      },
    }
  }
}

// TODO: REMOVE ME ONCE YOU GET RID OF CHANNELS
export const getPostsForChannel = (channelId, onSuccess, pageNumber = 1) => {
  return {
    type: 'GET_POSTS_FOR_CHANNEL',
    call: {
      action: 'GET',
      endpoint: `/tags/${channelId}/posts?page=${pageNumber}`,
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(postActions.onPostsReturn(res))
          onSuccess && onSuccess(res)
        }
      }
    }
  }
}

export const getPostsForTag = (tagId, onSuccess, pageNumber = 1) => {
  return {
    type: 'GET_POSTS_FOR_CHANNEL',
    call: {
      action: 'GET',
      endpoint: `/tags/${tagId}/posts?page=${pageNumber}`,
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(postActions.onPostsReturn(res))
          onSuccess && onSuccess(res)
        }
      }
    }
  }
}

export const getPostsForClub = (clubId, onSuccess, pageNumber = 1) => {
  return {
    type: 'GET_POSTS_FOR_CLUB',
    call: {
      action: 'GET',
      endpoint: `/clubs/${clubId}/posts?page=${pageNumber}`,
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(postActions.onPostsReturn(res))
          onSuccess && onSuccess(res)
        }
      }
    }
  }
}

export const createPost = (postInfo, onSuccess) => {
  return {
    type: 'CREATE_POST_CALL',
    call: {
      action: 'POST',
      endpoint: `/clubs/${postInfo.club}/posts`,
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(postActions.onPostReturn(res))
          onSuccess && onSuccess(res)
        }
      },
      errorActionCreator: () => {
        alert('Could not submit. Please try again.')
      },
      params: {
        post: {
          title: postInfo.title,
          url: postInfo.url,
          tags: postInfo.tagNames
        },
        message: {
          body: postInfo.message
        }
      }
    }
  }
}

export const updatePost = (postInfo, onSuccess) => {
  return {
    type: 'UPDATE_POST_CALL',
    call: {
      action: 'PATCH',
      endpoint: `/posts/${postInfo.id}`,
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(postActions.onPostReturn(res))
          onSuccess && onSuccess(res)
        }
      },
      errorActionCreator: () => {
        alert('Could not update. Please try again.')
      },
      params: {
        title: postInfo.title,
        description: postInfo.description,
        url: postInfo.url,
        tags: postInfo.tagNames
      }
    }
  }
}

export const deletePost = (postId, onSuccess) => {
  return {
    type: 'DELETE_POST_CALL',
    call: {
      action: 'DELETE',
      endpoint: `/posts/${postId}`,
      successActionCreator: () => {
        return (dispatch) => {
          dispatch(postActions.removePost(postId))
          onSuccess && onSuccess()
        }
      },
      errorActionCreator: () => {
        alert('Could not delete post. Please try again.')
      }
    }
  }
}
