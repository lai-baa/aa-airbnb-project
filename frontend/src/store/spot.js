// import SpotImage from "../components/SpotImage/SpotImages";
import { csrfFetch } from "./csrf";

// Actions
const GET_ALL_SPOTS =  "spot/GET_ALL_SPOTS";
const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS';
const CREATE_SPOT = "spot/CREATE_SPOT";
const DELETE_SPOT = "spot/DELETE_SPOT";
const GET_UPDATED_SPOT_DETAILS = 'spots/GET_UPDATED_SPOT_DETAILS'

// const ADD_SPOT_IMAGE = 'spots/ADD_SPOT_IMAGE';

// Action Creators
// Get all spots
export const getSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
};

// Get one spot
export const getOneSpot = (spot) => ({
	type: GET_SPOT_DETAILS,
	spot,
});

// Updating spot
export const updatingSpot = (spot) => ({
    type: GET_UPDATED_SPOT_DETAILS,
    spot
});

// Add spot
const addSpot = (spot) => {
    return {
      type: CREATE_SPOT,
      payload: spot,
    };
};
  
// Delete spot
const removeSpot = (spotId) => {
    return {
      type: DELETE_SPOT,
      spotId,
    };
};

// ADD SPOT IMAGE
// const addImage = (image) => ({
// 	type: ADD_SPOT_IMAGE,
// 	image,
// });

// Thunk Action Creators
// Get all spots
export const getAllSpots = () => async (dispatch) => {
    // console.log('IN THUNK')
    const response = await fetch('/api/spots');

    if(response.ok) {
        const spots = await response.json();
        // console.log('ALL SPOTS >>>>>>', spots)
        dispatch(getSpots(spots.Spots));
        return spots;
    } else {
        const error = await response.json();
        // console.error('Error fetching spots:', error);
        return error;
    }
};

// Get details of one spot
export const getSpotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (response.ok) {
        const spot = await response.json();
        dispatch(getOneSpot(spot));
        return spot;
    } else {
        const error = await response.json();
        return error;
    }
};

// Get all spots of a current user
export const getAllSpotsCurrentUser = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');
    if(response.ok) {
        const spots = await response.json();
        dispatch(getSpots(spots.Spots));
        return spots;
    } else {
        const error = await response.json();
        return error;
    }
};

// Create a spot
export const createSpot = (spot) => async (dispatch) => {
    // console.log('>>>>>>>>>>>>>>>> IN THUNK', spot)
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot),
    });
    if (response.ok) {
        const newSpot = await response.json();
        // console.log('>>>>>>>>>>>>>>>>> NEW SPOT', newSpot)
        dispatch(addSpot(newSpot));
        // console.log('>>>>>>>>>>>>>>>>> AFTER DISPATCH')
        return newSpot;
    } else {
        const error = await response.json();
        return error;
    }
};

// Update a spot
export const editSpot = (spot) => async (dispatch) => {
    // console.log('>>>>>>>>>>>>>>>> IN THUNK', spot)
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot),
    });

    if (response.ok) {
        const updatedSpot = await response.json();
        // console.log('>>>>>>>>>>>>>>>>> UPDATED SPOT', updatedSpot)
        dispatch(updatingSpot(updatedSpot));
        // console.log('>>>>>>>>>>>>>>>>> AFTER DISPATCH')
        return updatedSpot;
    } else {
        const error = await response.json();
        return error;
    }
};

// Delete a spot
export const deleteSpot = (spotId) => async (dispatch) => {
    // console.log('>>>>>>>>>>>>>>>>> IN THUNK')
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(removeSpot(spotId));
      return { message: "Successfully deleted" };
    } else {
      const error = await response.json();
      return error;
    }
};

// Ad spot image
export const addSpotImage = (spotId, image) => async () => {
	const response = await csrfFetch(`/api/spots/${spotId}/images`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(image),
	});

    return response;

	// if (response.ok) {
	// 	const newImage = await response.json();
	// 	dispatch(addImage(newImage));
	// 	return newImage;
	// }
};

// Initial State
// const initialState = { allSpots: {}, spotDetails: {} };

// Reducers
const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            // const newState = { ...state };
            // console.log("ACTION.SPOTS >>>>>>>>", action.spots)
            // const spotsArr = Object.values(action.spots);
            // console.log('Spots Array >>>>>>>>>>>', spotsArr)
            const spots = {}
            action.spots.forEach(spot => {
                spots[spot.id] = spot
            })
            return {...spots}
        }
        case GET_SPOT_DETAILS: {
			return { ...state, spotDetails: action.spot };
		}
        case CREATE_SPOT: {
            // console.log(">>>>>>>>>>>", action.payload.id)
            const newState = {
                ...state, [action.payload.id]: action.payload
            };
            return newState;
        }
        case GET_UPDATED_SPOT_DETAILS: {
            return {...state, spotDetails: {...state.spotDetails, ...action.spot}}

        }
        case DELETE_SPOT: {
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        }
        // case ADD_SPOT_IMAGE: {
		// 	const newState = { ...state, spotDetails: {...state.spotDetails} };
        //     console.log("NEW STATE Spot details >>>>>>>>>>", newState.spotDetails)
		// 	newState.spotDetails.spotImages.push(action.image);
		// 	return newState;
		// }
        default: 
            return state;
        
    }
};

export default spotsReducer;
