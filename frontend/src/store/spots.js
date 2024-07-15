// Action Types
const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';

// Action Creators
const getSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    };
};

// Thunk Actions
export const getAllSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');

    if(response.ok){
        const spots = await response.json();
        dispatch(getSpots(spots));
        return spots;
    }
};

// Initial State
const initialState = {spots: null}

// Reducers
const spotsReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_ALL_SPOTS: {
            return { ...state, spots: action.payload.Spots }
        }
        default: {
            return state;
        }
    }
};

export default spotsReducer;