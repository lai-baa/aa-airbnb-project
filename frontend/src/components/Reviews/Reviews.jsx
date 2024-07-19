import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, getAllReviews } from "../../store/review";
import { useModal } from '../../context/Modal';
import DeleteModal from "../DeleteModal/DeleteModal";
import ReviewFormModal from "../ReviewFormModal/ReviewFormModal";
import './Reviews.css';

const Reviews = ({ spotId }) => {
    const dispatch = useDispatch();
    const { setModalContent, setOnModalClose, closeModal } = useModal();

    const reviews = Object.values(useSelector((state) => state.reviews));
    // const reviewsArr = reviews ? Object.values(reviews) : [];

    // console.log("REVIEWS ARRAY >>>>>>>>>>>>>>>>", reviewsArr)
    // console.log('>>>>>>>>>>>>>>>', reviewsArr.length)
    const currentSpot = useSelector((state) => state.spots[spotId]);
    const currentUser = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(getAllReviews(spotId));
    }, [dispatch, spotId]);

    const hasReviews = reviews && reviews.length > 0;
    // console.log('>>>>>>>>>>>>>>>>>>> REVIEWS',hasReviews);
    // console.log('>>>>>>>>>>>>>', reviews.length)
    const totalStars = hasReviews ? reviews.reduce((sum, review) => sum + review.stars, 0) : 0;
    const averageRating = hasReviews ? (totalStars / reviews.length).toFixed(1) : null;

    
    const hasReviewed = hasReviews && currentUser && reviews.some(review => review.userId === currentUser.id);
    const isOwner = currentUser && currentSpot && currentUser.id === currentSpot.ownerId;
    
    const openReviewModal = () => {
      setOnModalClose(() => {});
      setModalContent(<ReviewFormModal spotId={spotId} onSubmitSuccess={() => dispatch(getAllReviews(spotId))}
/>);
    };

    const handleDeleteClick = (reviewId) => {
        setModalContent(
            <DeleteModal
                onDelete={() => handleDeleteConfirm(reviewId, spotId)}
                onClose={closeModal}
                message="Are you sure you want to delete this review?"
                type="Review"
            />
        );
    };

    const handleDeleteConfirm = async (reviewId, spotId) => {
        await dispatch(deleteReview(reviewId, spotId));
        closeModal();
    };

    return (
        <div className="reviews-div">
            {hasReviews ? (
                <>
                    <h3>
                        ⭐️ {averageRating} · {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
                    </h3>
                    {!hasReviewed && !isOwner && currentUser && (
                        <button className="post-review-button" onClick={openReviewModal}>
                            Post Your Review
                        </button>
                    )}
                    {reviews.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((review) => {
                        const date = new Date(review.updatedAt);
                        const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);

                        return (
                            <div key={review.id} className="review-div">
                                <h3>{review.User?.firstName || (currentUser && currentUser.firstName)}</h3>
                                <p>{formattedDate}</p>
                                <p>{review.review}</p>
                                {/* {console.log('>>>>>>>>>>>>>>>>>>',currentUser)} */}
                                {currentUser && currentUser.id === review.userId && !isOwner && (
                                    <button className="delete-review-button" onClick={() => handleDeleteClick(review.id)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </>
            ) : (
                currentUser && !isOwner? (
                    <>
                        <h2>⭐️ New</h2>
                        <p>Be the first to post a review!</p>
                        <button className="post-review-button" onClick={openReviewModal}>
                            Post Your Review
                        </button>
                    </>
                ) : <h2>⭐️ New</h2>
            )}
        </div>
    );
};

export default Reviews;