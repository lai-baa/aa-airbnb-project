import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createReview } from '../../store/review';
import StarRating from '../StarRating/StarRating';
// import './ReviewFormModal.css'

const ReviewFormModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const newReview = { review, stars };
  //   await dispatch(createReview(newReview, spotId));
  //   if (onSubmitSuccess) {
  //     onSubmitSuccess();
  //   }
  //   closeModal();
  // };

  const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = {};
		if (review.length < 10)
			newErrors.review = 'Review must be at least 10 characters long';
		if (stars < 1 || stars > 5)
			newErrors.stars = 'Stars must be between 1 and 5';

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		await dispatch(createReview({ review, stars }, spotId));
		closeModal();
	};


  return (
    <form onSubmit={handleSubmit} className="review_form">
      <h1>How was your stay?</h1>
      <textarea
        placeholder="Leave your review here..."
        className='review-text'
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      {errors.review && <p className='error-message'>{errors.review}</p>}

      <div className='star-div'><span>Stars: </span><span><StarRating rating={stars} setRating={setStars}/></span></div>
      {errors.stars && <p className='error-message'>{errors.stars}</p>}
      <button type="submit" disabled={review.length < 10 || stars < 1}>
        Submit Your Review
      </button>
    </form>
  );
};

export default ReviewFormModal;