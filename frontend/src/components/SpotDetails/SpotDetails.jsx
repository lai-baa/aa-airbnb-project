import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import { getSpotDetails } from '../../store/spot';
import { FaStar } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import './SpotDetails.css';

const SpotDetails = () => {
  const dispatch = useDispatch();
  const {spotId} = useParams();


  const spot = useSelector((state) => state.spots[spotId]);

  useEffect(() => {
    dispatch(getSpotDetails(spotId));
  }, [dispatch, spotId]);


  if (!spot) return <h2>Loading...</h2>;

  const handleClick = (e) => {
      e.preventDefault();
      alert('Feature Coming Soon')
  };

  const images = [];
    spot.SpotImages.forEach(image => {
        if (image.preview === true) {
            images.unshift(image)
        } else {
            images.push(image)
        }
  });
  
  return (
    <div className="spot-details-div">
      <h2>{spot.name}</h2>
      <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>

      <div>
        {images.map((image, index) => (
          <div key={image.id} className={`image-div image-${index + 1}`}>
              {console.log(index)}
              <img src={image.url} alt={`Image ${index + 1}`}/>
          </div>
         ))}
      </div>

      <div>
        <div>
            <h2>{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h2>
            <p>{spot.description}</p>
         </div>
         <div id="reserve">
            <ul>
               <li id="price"><span>{`$${spot.price}`}</span>night</li>
               <div id="right">
                <li><FaStar />{spot.avgStarRating}</li>
                <LuDot />
                <li>{spot.numReviews} reviews</li>
               </div>
            </ul>
            <button onClick={handleClick} id="reservation-button">Reserve</button>
         </div>
      </div>
    </div>
  )
}

export default SpotDetails;