import {useDispatch, useSelector} from 'react-redux';
import { getAllSpots } from '../../store/spots';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';

function Spots () {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const spots = Object.values(
        useSelector((state) => (state.reports ? state.spots : [])) // populate from Redux store
    );

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    const handleSpotClick = (spotId) => {
		navigate(`/spots/${spotId}`);
	};

    // return (
    //     <div>

    //     </div>
    // )

    return (
        <div className='spots-wrapper'>
			{spots &&
				spots.map((spot) => (
					<div
						className='spot-div-structure'
						key={spot.id}
						onClick={() => handleSpotClick(spot.id)}
					>
						<img
							className='spot-image'
							src={spot.previewImage}
							alt={spot.name}
						/>
						<p>{spot.name}</p>
						<p>{`$${spot.price}`}</p>
					</div>
				))}
		</div>
    )
}

export default Spots;