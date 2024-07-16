
// Actions
export const GET_ALL_SPOTS =  "spot/GET_ALL_SPOTS";
export const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS';

// Action Creators
// Get all spots
export const getSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
};

// Get one spot
export const getSpot = (spot) => ({
	type: GET_SPOT_DETAILS,
	spot,
});

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
export const getSpotDetails = (spotId) => async (dispatch) => {
    const response = await fetch(`api/spots/${spotId}`);
    if (response.ok) {
      const spot = await response.json();
    //   console.log('SPOT >>>>>>>>>>>>', spot)
      dispatch(getSpot(spot));
      return spot;
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
            const spots = {};
            // console.log("ACTION.SPOTS >>>>>>>>", action.spots)
            // const spotsArr = Object.values(action.spots);
            // console.log('Spots Array >>>>>>>>>>>', spotsArr)
            action.spots.forEach((spot) => {
                spots[spot.id] = spot;
            });
            return {...state, ...spots};
        }
        // case GET_SPOT_DETAILS: {
		// 	return { ...state, [action.spot.id]: action.spot };
		// }
        default: 
            return state;
        
    }
};

export default spotsReducer;
