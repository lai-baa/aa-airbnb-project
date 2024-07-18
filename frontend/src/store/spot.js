import { csrfFetch } from "./csrf";

// Actions
const GET_ALL_SPOTS =  "spot/GET_ALL_SPOTS";
const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS';
const CREATE_SPOT = "spot/CREATE_SPOT";
const DELETE_SPOT = "spot/DELETE_SPOT";

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

// Add spot
const addSpot = (spot) => {
    return {
      type: CREATE_SPOT,
      spot,
    };
};
  
// Delete spot
const removeSpot = (spotId) => {
    return {
      type: DELETE_SPOT,
      spotId,
    };
};

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

// Create a spot
export const createSpot = (spot) => async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot),
    });
    if (response.ok) {
        const newSpot = await response.json();
        dispatch(addSpot(newSpot));
        return newSpot;
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

// Update a spot
export const editSpot = (spot) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${spot.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(spot),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const updatedSpot = await response.json();
        dispatch(getOneSpot(updatedSpot));
        return updatedSpot;
    } catch (error) {
        console.error("Caught error in editSpot thunk:", error);
        return { error: 'Something went wrong.' };
    }
};

// Delete a spot
export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`api/spots/${spotId}`, {
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
            return {...state, ...spots}
        }
        case GET_SPOT_DETAILS: {
			return { ...state, [action.spot.id]: action.spot };
		}
        case CREATE_SPOT: {
            const newState = {
                ...state,
                allSpots: {
                    ...state.allSpots,
                    [action.payload.id]: action.payload,
                },
                spotDetails: {
                    ...state.spotDetails,
                    [action.payload.id]: action.payload,
                },
            };
            return newState;
        }
        case DELETE_SPOT: {
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        }
        default: 
            return state;
        
    }
};

export default spotsReducer;
