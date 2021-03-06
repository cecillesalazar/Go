import { loadAuthToken, normalizeResponseErrors } from '../utils';
import { BACKEND_URL } from '../config';
// import { browserHistory } from "react-router";

export const MAKE_LOCATION_REQUEST = 'MAKE_LOCATION_REQUEST';
export const makeLocationRequest = () => ({
  type: MAKE_LOCATION_REQUEST
});

export const TOGGLE_REDIRECT = 'TOGGLE_REDIRECT';
export const toggleRedirect = bool => ({
  type: TOGGLE_REDIRECT,
  payload: bool
});

export const CREATE_LOCATION_SUCCESS = 'CREATE_LOCATION_SUCCESS';
export const createLocationSuccess = locationObject => ({
  type: CREATE_LOCATION_SUCCESS,
  payload: locationObject
});

export const LOCATION_REQUEST_ERROR = 'LOCATION_REQUEST_ERROR';
export const locationRequestError = err => ({
  type: LOCATION_REQUEST_ERROR,
  payload: err
});

export const GET_ONE_LOCATION_SUCCESS = 'GET_ONE_LOCATION_SUCCESS';
export const getOneLocationSuccess = locationObject => ({
  type: GET_ONE_LOCATION_SUCCESS,
  payload: locationObject
});

export const GET_ALL_LOCATIONS_SUCCESS = 'GET_ALL_LOCATIONS_SUCCESS';
export const getAllLocationsSuccess = locationList => ({
  type: GET_ALL_LOCATIONS_SUCCESS,
  payload: locationList
});

export const UPDATE_IMAGE_REQUEST = 'UPDATE_IMAGE_REQUEST';
export const updateImageRequest = () => ({
  type: UPDATE_IMAGE_REQUEST
});

export const UPDATE_IMAGE_SUCCESS = 'UPDATE_IMAGE_SUCCESS';
export const updateImageSuccess = updatedLocationObject => ({
  type: UPDATE_IMAGE_SUCCESS,
  payload: updatedLocationObject
});

export const UPDATE_IMAGE_ERROR = 'UPDATE_IMAGE_ERROR';
export const updateImageError = err => ({
  type: UPDATE_IMAGE_ERROR,
  payload: err
});

export const createLocation = locationObject => dispatch => {
  //grab the token from localstorage
  const token = loadAuthToken();
  //start loading screen
  dispatch(makeLocationRequest());
  //dispatch a fetch request
  fetch(`${BACKEND_URL}/locations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: locationObject
  })
    .then(res => {
      normalizeResponseErrors(res);
      return res.json();
    })
    .then(parsedResponse => {
      // browserHistory.push(`${parsedResponse.location}`);
      dispatch(createLocationSuccess(parsedResponse));
      dispatch(toggleRedirect(true));
    })
    .catch(err => {
      dispatch(locationRequestError(err.message));
    });
};

export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const updateLocation = (id, locationObject) => dispatch => {
  dispatch(makeLocationRequest());
  const token = loadAuthToken();
  fetch(`${BACKEND_URL}/locations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(locationObject)
  })
    .then(res => {
      normalizeResponseErrors(res);
      return res.json();
    })
    .then(parsedResponse => {
      dispatch(createLocationSuccess(parsedResponse));
      dispatch(toggleRedirect());
    })
    .catch(err => {
      console.log(err)
      dispatch(locationRequestError(err.message));
    });
};

export const updateImage = (id, formData) => dispatch => {
  dispatch(updateImageRequest());
  const token = loadAuthToken();
  fetch(`${BACKEND_URL}/locations/${id}/image`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
    .then(res => {
      normalizeResponseErrors(res);
      return res.json();
    })
    .then(parsedResponse => {
      dispatch(updateImageSuccess(parsedResponse));
      dispatch(toggleRedirect());
    })
    .catch(err => {
      dispatch(updateImageError(err.message));
    });
};

export const getOneLocation = id => dispatch => {
  const token = loadAuthToken();
  dispatch(makeLocationRequest());
  return fetch(`${BACKEND_URL}/locations/${id}`, {
    method: 'GET',

    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      normalizeResponseErrors(res);
      return res.json();
    })
    .then(parsedResponse => {
      dispatch(getOneLocationSuccess(parsedResponse));
    });
};

export const getAllLocations = (filters = {}) => dispatch => {
  const token = loadAuthToken();
  let ownerIdFilter = filters.ownerId ? `&ownerId=${filters.ownerId}` : '';
  dispatch(makeLocationRequest());
  fetch(
    `${BACKEND_URL}/locations?${ownerIdFilter}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    }
  )
    .then(res => {
      normalizeResponseErrors(res);
      return res.json();
    })
    .then(parsedResponse => {
      dispatch(getAllLocationsSuccess(parsedResponse));
    })
    .catch(err => {
      dispatch(locationRequestError(err.message));
    });
};

export const GEOCODE_SUCCESS = 'GEOCODE_SUCCESS';
export const geocodeSuccess = latlng => ({
  type: GEOCODE_SUCCESS,
  payload: latlng
});

export const geocode = locationObject => dispatch => {
  const token = loadAuthToken();
  let locationMapObject = {
    adminDistrict: locationObject.currentLocation.state,
    postalCode: locationObject.currentLocation.zipCode,
    locality: locationObject.currentLocation.city,
    addressLine: locationObject.currentLocation.address
  };

  fetch(`${BACKEND_URL}/locationmap/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(locationMapObject)
  })
    .then(res => {
      normalizeResponseErrors(res);
      return res.json();
    })
    .then(latlng => {
      dispatch(geocodeSuccess(latlng));
    })
    .catch(err => console.log(err));
};

export const DELETE_LOCATION = 'DELETE_LOCATION';

export const deleteLocation = id => dispatch => {
  // dispatch(makeLocationRequest())
  // fetch(`${BACKEND_URL}/${id}`, {

  // })
};
