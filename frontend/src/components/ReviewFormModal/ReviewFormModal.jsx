import React, { useState } from 'react';
import { useModal } from '../../context/Modal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../../store/review';
// import './ReviewFormModal.css';

const ReviewFormModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const sessionUser = useSelector(state => state.session.user);

  const openModal = () => setShow(true);
  const closeModal = () => {
    setShow(false);
    setRating(0);
    setComment('');
    setErrors({});
    setHasSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const newErrors = {};
    if (comment.length < 10) newErrors.comment = 'Comment must be at least 10 characters long';
    if (rating === 0) newErrors.rating = 'Rating is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const reviewData = {
      spotId,
      userId: sessionUser.id,
      rating,
      comment,
    };

    const createdReview = await dispatch(createReview(reviewData));
    if (createdReview && !createdReview.errors) {
      closeModal();
    } else {
      setErrors({ ...errors, server: createdReview.errors });
    }
  };

  return (
    <>
      <button onClick={openModal}>Post Your Review</button>
      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>How was your stay?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {hasSubmitted && errors.server && <p>{errors.server}</p>}
            <div>
              <label>Stars</label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
              {hasSubmitted && errors.rating && <p>{errors.rating}</p>}
            </div>
            <div>
              <label>Leave your review here...</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {hasSubmitted && errors.comment && <p>{errors.comment}</p>}
            </div>
            <button type="submit" disabled={comment.length < 10 || rating === 0}>Submit Your Review</button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReviewFormModal;
