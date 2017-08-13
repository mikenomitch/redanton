import makeHashReducer, {mergeHashActions} from './hashReducer'

// ==================
// ==================
//      REDUCER
// ==================
// ==================

const defaultState = {}
export default function (state = defaultState, action) {
  switch (action.type) {
  case 'CUSTOM_POST_ACTION':
    return state
  default:
    return makeHashReducer('Post')(state, action)
  }
}

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

export const getFrontPage = () => {
  return {
    type: 'GET_FRONT_PAGE_CALL',
    call: {
      action: 'GET',
      endpoint: '/front',
      onSuccess: postActions.onPostsReturn
    }
  }
}

export const createPost = (postInfo, onSuccess) => {
  return {
    type: 'CREATE_POST_CALL',
    call: {
      action: 'POST',
      endpoint: `/channels/${postInfo.channel}/posts`,
      onSuccess: onSuccess,
      onError: () => { alert('there was an issue. check your params') },
      params: {
        post: {
          title: postInfo.title,
          description: postInfo.description,
          url: postInfo.url
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
      onSuccess: onSuccess,
      onError: () => { alert('there was an issue. check your params') },
      params: {
        post: {
          title: postInfo.title,
          description: postInfo.description,
          url: postInfo.url
        }
      }
    }
  }
}

export const deletePost = (postId) => {
  return {
    type: 'DELETE_POST_CALL',
    call: {
      action: 'DELETE',
      endpoint: `/posts/${postId}`,
      onSuccess: postActions.onPostsReturn
    }
  }
}