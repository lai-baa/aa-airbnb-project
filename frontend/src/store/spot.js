
// Actions
export const GET_ALL_SPOTS =  "spot/GET_ALL_SPOTS";

// Action Creators
export const getSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
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
        return error;
    }
};

// Get details of one spot
export const loadOneSpot = (spotId) => async (dispatch) => {
    const response = await fetch(`api/spots/${spotId}`);
    if (response.ok) {
      const spot = await response.json();
      dispatch(loadAllSpots(spot));
      return spot;
    } else {
      const error = await response.json();
      return error;
    }
};

// Initial State
const initialState = {};

// Reducers
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const newState = {...state};
            // console.log("ACTION.SPOTS >>>>>>>>", action.spots)
            // const spotsArr = Object.values(action.spots);
            // console.log('Spots Array >>>>>>>>>>>', spotsArr)
            action.spots.forEach((spot) => {
                newState[spot.id] = spot;
            });
            return newState;
        }
        default: 
            return state;
        
    }
};

export default spotsReducer;
