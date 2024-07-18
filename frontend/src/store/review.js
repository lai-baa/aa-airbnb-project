
import { csrfFetch } from "./csrf";

// Actions
const GET_ALL_REVIEWS = '/store/review/GET_ALL_REVIEWS';
const CREATE_REVIEW = "review/CREATE_REVIEW";
// const DELETE_REVIEW = "review/DELETE_REVIEW";

// Action Creators
const getReviews = (reviews) => {
    return {
        type: GET_ALL_REVIEWS,
        reviews
    }
};

const createReview = (review) => ({
    type: CREATE_REVIEW,
    review,
});

// Thunk Action Creators
// Get all reviews
export const getAllReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);
    if(response.ok) {
        const reviews = await response.json();
        dispatch(getReviews(reviews.Reviews));
        return reviews;
    }
};

// Create reviews
export const addReview = (spotId, review) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
  
    if (response.ok) {
      const newReview = await response.json();
      dispatch(createReview(newReview));
      return newReview;
    } else {
      const error = await response.json();
      return { error };
    }
};

// Reducers
const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ALL_REVIEWS: {
            const reviews = {}
            action.reviews.forEach(review => {
                reviews[review.id] = review
            })
            return {...reviews}
        }
        case CREATE_REVIEW:
            return {
                ...state,
                [action.review.spotId]: [action.review, ...state[action.review.spotId]],
            };
        default:
            return state;
    }
}

export default reviewsReducer;