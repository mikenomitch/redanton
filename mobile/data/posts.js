import omitBy from 'lodash/fp/omitBy'

import makeHashReducer, {mergeHashActions} from './hashReducer'
import withResetState from './withResetState'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

function __postsWithoutChannel (state, channelId) {
  const belongsToChannel = (post) => {
    return post.channel_id === channelId
  }

  return omitBy(state, belongsToChannel)
}

const defaultState = {}
function postReducer (state = defaultState, action) {
  switch (action.type) {
  case 'REMOVE_CHANNEL':
    return __postsWithoutChannel(state, action.payload)
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
  onPostsReturn: (res) => ({
    type: 'MERGE_POSTS',
    payload: res.data
  })
}

export const postActions = mergeHashActions(customPostActions, 'Post')

// =================
// =================
//   ASYNC ACTIONS
// =================
// =================

export const getFrontPage = (onSuccess) => {
  return {
    type: 'GET_FRONT_PAGE_CALL',
    call: {
      action: 'GET',
      endpoint: '/front',
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(postActions.onPostsReturn(res))
          onSuccess && onSuccess(res)
        }
      },
    }
  }
}

export const getPostsForChannel = (channelId, onSuccess) => {
  return {
    type: 'GET_POSTS_FOR_CHANNEL',
    call: {
      action: 'GET',
      endpoint: `/channels/${channelId}/posts`,
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
      endpoint: `/channels/${postInfo.channel}/posts`,
      successActionCreator: (res) => {
        return (dispatch) => {
          dispatch(postActions.mergePosts([res.data]))
          onSuccess && onSuccess(res)
        }
      },
      errorActionCreator: () => {
        alert('Could not submit. Please try again.')
      },
      params: {
        post: {
          title: postInfo.title,
          url: postInfo.url
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
          dispatch(postActions.mergePosts([res.data]))
          onSuccess && onSuccess(res)
        }
      },
      errorActionCreator: () => {
        alert('Could not update. Please try again.')
      },
      params: {
        title: postInfo.title,
        description: postInfo.description,
        url: postInfo.url
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
