
// import { csrfFetch } from "./csrf";

// Actions
const GET_ALL_REVIEWS = '/store/review/GET_ALL_REVIEWS';
// const CREATE_REVIEW = "review/CREATE_REVIEW";
// const DELETE_REVIEW = "review/DELETE_REVIEW";

// Action Creators
const getReviews = (reviews) => {
    return {
        type: GET_ALL_REVIEWS,
        reviews
    }
};

// Thunk Action Creators
export const getAllReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);
    if(response.ok) {
        const reviews = await response.json();
        dispatch(getReviews(reviews.Reviews));
        return reviews;
    }
};

// Reducers
const reviewsReducer = (state = {}, action) => {
    switch(action.type){
        case GET_ALL_REVIEWS: {
            const reviews = {};
            action.reviews.forEach((review) => {
                reviews[review.id] = review;
            });
            return {...state, ...reviews};
        }
        default: 
            return state;
    }
};


export default reviewsReducer;