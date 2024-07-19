
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

// Create review
const addReview = (review) => {
  return {
    type: CREATE_REVIEW,
    payload: review,
  };
};

const removeReview = (reviewId, spotId) => {
  return {
    type: DELETE_REVIEW,
    reviewId,
    spotId,
  };
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
export const createReview = (review, spotId) => async (dispatch) => {
  console.log('IN THINK ---------------->>>>>>>>>')
	const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(review),
	});
	if (response.ok) {
		const review = await response.json();
		dispatch(addReview(review));
		return review;
	}
};

// Delete a review
export const deleteReview = (reviewId, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(removeReview(reviewId, spotId));
    return { message: "Successfully deleted" };
  } else {
    const error = await response.json();
    return error;
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
          const newState = { ...state };
          newState[action.payload.id] = action.payload;
          return newState;
        }
        case DELETE_REVIEW: {
          const { reviewId } = action;
          const reviews = {...state.reviews};
          delete reviews[reviewId]
          return reviews;
        }
        default:
            return state;
    }
}

export default reviewsReducer;