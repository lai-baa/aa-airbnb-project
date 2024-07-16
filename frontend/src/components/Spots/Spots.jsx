import {useDispatch, useSelector} from 'react-redux';
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllSpots } from "../../store/spot";
import './Spots.css'

const Spots = () => {
    const dispatch = useDispatch();
    const spots = Object.values(
        useSelector((state) => state.spots ? state.spots : [])
    );

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    return (spots.map((spot) => (
        <div key={spot.id} className="spot-div">
            <Link key={spot.id} to={`/api/spots/${spot.id}`} className="spot-link">
            <img src={spot.previewImage} alt={spot.name} />
                <h4>{spot.name}</h4>
                <div className='spot-preview'>
                    <p>{spot.city}, {spot.state}</p>
                    <p>⭐️ {spot.avgRating ? spot.avgRating : 'New'}</p>
                </div>
                <span className='spot-price'>${spot.price}</span><span> night</span>
            </Link>
        </div>
    )))
}

export default Spots;