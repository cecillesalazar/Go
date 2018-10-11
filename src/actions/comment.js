import { loadAuthToken, normalizeResponseErrors } from '../utils';
import { BACKEND_URL } from '../config';

export const MAKE_COMMENT_REQUEST = 'MAKE_COMMENT_REQUEST';
export const makeCommentRequest = () => ({
  type: MAKE_COMMENT_REQUEST
});
export const CREATE_COMMENT_SUCCESS = 'CREATE_COMMENT_SUCCESS';
export const createCommentSuccess = comment => ({
  type: CREATE_COMMENT_SUCCESS,
  payload: comment
});
export const UPDATE_COMMENT_SUCCESS = 'UPDATE_COMMENT_SUCCESS';
export const updateCommentSuccess = comment => ({
  type: UPDATE_COMMENT_SUCCESS,
  payload: comment
});
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';
export const deleteCommentSuccess = comment => ({
  type: DELETE_COMMENT_SUCCESS,
  payload: comment
});
export const GET_ONE_COMMENT_SUCCESS = 'GET_ONE_COMMENT_SUCCESS';
export const getOneCommentSuccess = comment => ({
  type: GET_ONE_COMMENT_SUCCESS,
  payload: comment
});
export const GET_ALL_COMMENTS_SUCCESS = 'GET_ALL_COMMENTS_SUCCESS';
export const getAllCommentsSuccess = () => ({
  type: GET_ALL_COMMENTS_SUCCESS
});
export const COMMENT_REQUEST_ERROR = 'COMMENT_REQUEST_ERROR';
export const commentRequestError = err => ({
  type: COMMENT_REQUEST_ERROR,
  payload: err
});

export const createComment = commentObject => dispatch => {
  //grab the token from localstorage
  const token = loadAuthToken();
  //start loading screen
  dispatch(makeCommentRequest());
  //dispatch a fetch request
  return fetch(`${BACKEND_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(commentObject)
  })
    .then(res => {
      normalizeResponseErrors(res);
      return res.json();
    })
    .then(parsedResponse => {
      dispatch(createCommentSuccess(parsedResponse));
    })
    .catch(err => {
      dispatch(commentRequestError(err.message));
    });
};

export const updateComment = (commentObject, id) => dispatch => {
  dispatch(makeCommentRequest());
  const token = loadAuthToken();
  return fetch(`${BACKEND_URL}/comments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(commentObject)
  })
    .then(res => {
      normalizeResponseErrors(res);
      return res.json();
    })
    .then(parsedResponse => {
      dispatch(createCommentSuccess(parsedResponse));
    })
    .catch(err => {
      dispatch(commentRequestError(err.message));
    });
};

export const deleteComment = id => dispatch => {
  dispatch(makeCommentRequest());
  const token = loadAuthToken();
  return fetch(`${BACKEND_URL}/comments/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      normalizeResponseErrors(res);
      dispatch(deleteCommentSuccess(id));
    })
    .catch(err => dispatch(commentRequestError(err)));
};
