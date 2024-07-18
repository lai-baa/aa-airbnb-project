import { useState } from 'react';
import { useSelector } from 'react-redux';
import ReviewFormModal from './ReviewFormModal';
import { Modal } from '../../context/Modal';
import './Reviews.css';

const Reviews = ({ spotId }) => {
  const currentUser = useSelector(state => state.session.user);
  const reviews = useSelector(state => state.reviews[spotId]);
  const [showModal, setShowModal] = useState(false);

  const userHasReviewed = reviews.some(review => review.userId === currentUser.id);

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {currentUser && !userHasReviewed && (
        <button onClick={() => setShowModal(true)}>Post Your Review</button>
      )}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <ReviewFormModal spotId={spotId} onClose={() => setShowModal(false)} />
        </Modal>
      )}
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            <p>{review.comment}</p>
            <p>{review.stars} stars</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;