
import { csrfFetch } from "./csrf";

// Actions
const GET_ALL_REVIEWS = '/store/review/GET_ALL_REVIEWS';
const CREATE_REVIEW = "review/CREATE_REVIEW";
const DELETE_REVIEW = "review/DELETE_REVIEW";

// Action Creators
const getReviews = (reviews) => {
    return {
        type: GET_ALL_REVIEWS,
        reviews
    }
};

const addReview = (review) => ({
    type: CREATE_REVIEW,
    review,
});

const removeReview = (reviewId) => {
    return { type: DELETE_REVIEW, payload: reviewId };
};

// Thunk Action Creators
// Get all reviews
export const getAllReviews = (spotId) => async (dispatch) => {
    // console.log('SPOT ID >>>>>>>>>>>>>>>>', spotId)
    const response = await fetch(`/api/spots/${spotId}/reviews`);
    if(response.ok) {
        const reviews = await response.json();
        // console.log('REVIEWS >>>>>>>>>>>>>>>>>>',reviews);
        dispatch(getReviews(reviews.Reviews));
        return reviews;
    }
};

// Create reviews
export const createReview = (spotId, review) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
  
    if (response.ok) {
      const newReview = await response.json();
      dispatch(addReview(newReview));
      return newReview;
    } else {
      const error = await response.json();
      return { error };
    }
};

// Delete a review
export const deleteReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(removeReview(reviewId));
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
        case CREATE_REVIEW: {
			return { ...state, reviews: [...state.reviews, action.payload] };
		}
        case DELETE_REVIEW: {
            const updatedReviews = state.reviews.filter(
              (review) => review.id !== action.payload
            );
            return {
              ...state,
              reviews: updatedReviews,
            };
        }
        default:
            return state;
    }
}

export default reviewsReducer;