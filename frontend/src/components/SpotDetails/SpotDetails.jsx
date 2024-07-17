import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import { getSpotDetails } from '../../store/spot';
import { getAllReviews } from "../../store/review";
import { FaStar } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import './SpotDetails.css';

const SpotDetails = () => {
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>')
  const dispatch = useDispatch();
  const {spotId} = useParams();
  const spot = useSelector((state) => state.spots[spotId]);
  const reviews = useSelector(state => Object.values(state.reviews));

  // console.log('>>>>>>>>>>>>>>>>>>>',spot)

  useEffect(() => {
    dispatch(getSpotDetails(spotId));
    dispatch(getAllReviews(spotId));
  }, [dispatch, spotId]);

  if (!spot || !spot.SpotImages) return <h2>Loading...</h2>;

  const handleClick = (e) => {
      e.preventDefault();
      alert('Feature Coming Soon')
  };

  const handleRating = (avgRating) => {
    avgRating = (+avgRating).toFixed(1)
    if (isNaN(avgRating)) avgRating = 'New'
    return avgRating;
  };

  const images = [];
    spot.SpotImages.forEach(image => {
        if (image.preview === true) {
            images.unshift(image)
        } else {
            images.push(image)
        }
  });

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

  const formatReviewDate = (date) => {
    const dateSplit = date.split('-')
    const month = Number(dateSplit[1])
    const year = dateSplit[0]
    return `${months[month]} ${year}`
  };

  const numReviewsText = (numReviews) => {
    if (numReviews === 0) return '';
    if (numReviews === 1) return '1 review'
    return `${numReviews} reviews`
  };
  
  return (
    <div className="spot-details-div">
      <h2>{spot.name}</h2>
      <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>

      <div className="images-div">
         {images.map((image, index) => (
            <div key={image.id} className={`image-div image-${index + 1}`}>
                {/* {console.log(index)} */}
                <img src={image.url} alt={`Image ${index + 1}`}/>
            </div>
         ))}
      </div>

      <div>
        <div>
            <h2>{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h2>
            <p>{spot.description}</p>
         </div>
         <div id="reservation">
            <ul>
               <li id="price"><span style={{fontSize: '18px', fontWeight:'500'}}>{`$${spot.price}`}</span>night</li>
               <div id="right">
                <li><FaStar />{handleRating(spot.avgStarRating)}</li>
                <LuDot />
                <li>{numReviewsText(spot.numReviews)}</li>
               </div>
            </ul>
            <button onClick={handleClick} id="reservation-button">Reserve</button>
         </div>
      </div>

      <div>
            <ul id="reviews-stats">
               <li><FaStar />{spot.avgStarRating}</li>
               <LuDot className={spot.numReviews === 0? 'hide': ''} />
               <li>{numReviewsText(spot.numReviews)}</li>
            </ul>
            {reviews.map(review => (
                <div key={review.id} className="review">
                    <h3>{review.User.firstName}</h3>
                    {/* {console.log(review)} */}
                    <h4>{formatReviewDate(review.updatedAt)}</h4>
                    <p>{review.review}</p>
                </div>
            ))}
         </div>

    </div>
  )
}

export default SpotDetails;