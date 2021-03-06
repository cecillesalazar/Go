import { BACKEND_URL } from '../config';
import { fetchLogin } from './login';
import { normalizeResponseErrors, toastFn } from '../utils';


export const MAKE_REGISTRATION_REQUEST = 'MAKE_REGISTRATION_REQUEST';
export const makeRegistrationRequest = () => ({
  type: MAKE_REGISTRATION_REQUEST
});
export const REGISTRATION_REQUEST_SUCCESS = 'REGISTRATION_REQUEST_SUCCESS';
export const registrationRequestSuccess = username => ({
  type: REGISTRATION_REQUEST_SUCCESS,
  payload: username
});
export const REGISTRATION_REQUEST_ERROR = 'REGISTRATION_REQUEST_ERROR';
export const registrationRequestError = err => ({
  type: REGISTRATION_REQUEST_ERROR,
  payload: err
});

export const TOGGLE_REDIRECTING = 'TOGGLE_REDIRECTING';
export const toggleRedirecting = bool => ({
  type: TOGGLE_REDIRECTING,
  payload: bool
});

export const fetchRegistration = credentials => dispatch => {
  if (credentials.password !== credentials.confirmPassword) {
    toastFn('Passwords do not match.');
    dispatch(registrationRequestError('Passwords do not match.'));
    return;
  } else {
    dispatch(makeRegistrationRequest());
    return fetch(`${BACKEND_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
      .then(res => {
        if (res.status !== 201) {
          normalizeResponseErrors(res);
          return Promise.reject(res);
        }
        return res.json();
      })
      .then(parsedResponse => {
        dispatch(registrationRequestSuccess(parsedResponse.username));
        return parsedResponse;
      })
      .then(resObj => {
        const user = {
          username: resObj.username,
          password: credentials.password
        };
        dispatch(fetchLogin(user));
      })
      .then(() => {
        dispatch(toggleRedirecting(true));
      })
      .catch(err => {
        if (err) {
          dispatch(registrationRequestError(err.message));
        }
      });
  }
};
