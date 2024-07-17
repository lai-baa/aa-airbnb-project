import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { FaStar } from "react-icons/fa";
import { getAllSpots } from "../../store/spot";
import './Spots.css'

const Spots = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const spots = Object.values(
        useSelector((state) => state.spots ? state.spots : [])
    );

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    const handleClick = (spot) => {
        navigate(`/spots/${spot.id}`)
    };

    const handleRating = (avgRating) => {
        avgRating = (+avgRating).toFixed(1)
        if (isNaN(avgRating)) avgRating = 'New'
        return avgRating;
    };

    return (
        <div className='spots-div'>
            {spots.map(spot => (
                <div key={spot.id} className='spot-div'
                onClick={() => handleClick(spot)}
                >
                <div className='spot-image'>
                    <p className='name'>{spot.name}</p>
                    <img src={spot.previewImage}/>
                </div>
                <div className='spot-text'>
                    <div>
                        <p>{`${spot.city}, ${spot.state}`}</p>
                        <p><span style={{fontWeight: 'bold'}}>${spot.price}</span> night</p>
                    </div>
                    <p style={{fontWeight: 'bold'}}><FaStar />{handleRating(spot.avgRating)}</p>
                </div>
                </div>
            ))}
        </div>
    )
}

export default Spots;