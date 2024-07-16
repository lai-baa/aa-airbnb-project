import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import { getSpotDetails } from '../../store/spot';


export const SpotDetails = () => {
    const dispatch = useDispatch();
    const {spotId} = useParams();

    const spot = useSelector((state) => state.spots[spotId]);

    useEffect(() => {
        dispatch(getSpotDetails(spotId))
    }, [dispatch, spotId]);

    const handleClick = (e) => {
        e.preventDefault();
        alert('Feature Coming Soon')
    };

    if (!spot || !spot.SpotImages) return null;
    
    return (
      <>
        <div className="spot-details-container">
          <h1>{spot.name}</h1>
          <p>Location: {spot.city}, {spot.state}, {spot.country}</p>
          <div className="spot-images">
            <img src={spot.previewImage} alt={spot.name} className="large-image" />
            {/* more images, render them here */}
          </div>
          <p>{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</p>
          <p>{spot.description}</p>
          <div className="callout-box">
            <p>${spot.price} / night</p>
            <button onClick={handleClick}>Reserve</button>
          </div>
        </div>
      </>
    );
}

export default SpotDetails;