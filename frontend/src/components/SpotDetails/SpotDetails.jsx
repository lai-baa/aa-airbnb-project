import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import { getSpotDetails } from '../../store/spot';
// import { getAllReviews } from "../../store/review";
import SpotImage from "../SpotImage/SpotImages";
import Reviews from '../Reviews/Reviews';
import { FaStar } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import './SpotDetails.css';

const SpotDetails = () => {
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>')
  const dispatch = useDispatch();
  const {spotId} = useParams();
  const spot = useSelector((state) => state.spots.spotDetails);
  const reviews = useSelector(state => Object.values(state.reviews));

  // console.log('SPOT --------->>>>>>>>>>>', spot)

  const spotHasReviews = reviews && reviews.length > 0;
  const totalStars = spotHasReviews ? reviews.reduce((sum, review) => sum + review.stars, 0) : 0;
  const avgRating = spotHasReviews ? (totalStars / reviews.length).toFixed(1) : null;

  // console.log('----------->>>>>>>>>>>',spot)

  useEffect(() => {
    if(!spot){
      dispatch(getSpotDetails(spotId));
    }
    // dispatch(getAllReviews(spotId))
  }, [dispatch, spotId, spot]);

  // Fetch again after reviews are updated
  // useEffect(() => {
	// 	dispatch(getSpotDetails(spotId));
	// }, [dispatch, spotId, reviews]);

  if (!spot || !spot.Owner ) return null;

  const handleClick = (e) => {
      e.preventDefault();
      alert('Feature Coming Soon')
  };

  // console.log('SPOT >>>>>>>>>>>>>>>>>>>>>>',spot)

  // const handleRating = (avgStarRating) => {
  //   avgStarRating = (+avgStarRating).toFixed(1);
  //   if (isNaN(avgStarRating) || avgStarRating === '0.0') avgStarRating = 'New';
  //   return avgStarRating;
  // };

  const numReviewsText = (numReviews) => {
    if (numReviews === 0) return '';
    if (numReviews === 1) return '1 review'
    return `${numReviews} reviews`
  };
  
  return (
    <div className="spot-details-div">
      <h2>{spot.name}</h2>
      <h3>Location: {`${spot.city}, ${spot.state}, ${spot.country}`}</h3>

      <SpotImage spotId={spotId}/>

      <div className="spot-description-reservation">
        <div id='spot-descriptions'>
            <h2>{`Hosted by ${spot.Owner?.firstName} ${spot.Owner?.lastName}`}</h2>
            <p>{spot.description}</p>
         </div>
         <div id="reservation">
            <ul>
               <li id="price"><span style={{fontSize: '18px', fontWeight:'500'}}>{`$${spot.price}`}</span>night</li>
               <div id="right">
                <li><FaStar />{avgRating}</li>
                {/* {console.log('>>>>>>>>>>>>>>>>>>',spot)} */}
                <LuDot />
                <li>{numReviewsText(spot.numReviews)}</li>
               </div>
            </ul>
            <button onClick={handleClick} id="reservation-button">Reserve</button>
         </div>
      </div>

      <Reviews spotId={spotId}/>

    </div>
  )
}

export default SpotDetails;