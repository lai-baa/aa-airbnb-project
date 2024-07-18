import {useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsCurrentUser, deleteSpot } from '../../store/spot';
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useModal } from '../../context/Modal';
import DeleteModal from '../DeleteModal/DeleteModal';
import './ManageSpots.css'

const ManageSpots = () => {
    const { setModalContent, closeModal } = useModal();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.session.user); // object
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>',currentUser)
    const allSpots = Object.values(
        useSelector((state) => state.spots)
    );

    // console.log('ALL SPOTSSSS >>>>>>>>>>>>>>>', allSpots);

    useEffect(() => {
        dispatch(getAllSpotsCurrentUser());
    }, [dispatch]);

    // Ensure that the spots are filtered correctly for the current user
    const spotsCurrUser = allSpots.filter((spot) => spot.ownerId === currentUser.id);

    if (!spotsCurrUser) return null;

    const handleRating = (avgRating) => {
        avgRating = (+avgRating).toFixed(1);
        if (isNaN(avgRating) || avgRating === '0.0') avgRating = 'New';
        return avgRating;
    };

    const handleClick = (spotId) => {
        setModalContent(
          <DeleteModal
            onDelete={() => handleDelete(spotId)}
            onClose={closeModal}
          />
        );
    };

    const handleDelete = async (spotId) => {
        dispatch(deleteSpot(spotId));
        closeModal();
    };

    return (
        <>
            <div className="header-container">
                {/* Added header container to align the heading and create spot link */}
                <h1>Manage Spots</h1>
                {spotsCurrUser.length === 0 && (
                    <Link to="/spots/new" className="create-spot-link">Create a New Spot</Link>
                    // Added conditional rendering for the "Create a New Spot" link
                )}
            </div>
            <div className="manage-spots-div">

                <div className="manage-spots-image-div">
                {spotsCurrUser.map((spot) => (
                <div key={spot.id} className="manage-spot-div">
                <Link key={spot.id} to={`/spots/${spot.id}`} className="manage-spot-link">
                <img src={spot.previewImage} alt={spot.name} />
                    <h4>{spot.name}</h4>

                    <div className='manage-spot-text'>
                    <span>{spot.city}, {spot.state}</span>
                    <span><FaStar />{handleRating(spot.avgRating)}</span>
                    </div>
                    <span className='manage-spot-price'>${spot.price}</span><span> night</span>
                </Link>

                <div className="curr-user-spot-buttons">
                    <button><Link to={`/spots/${spot.id}/edit`}>Update</Link></button>
                    <button onClick={() => handleClick(spot.id)}>Delete</button>
                </div>
                
            </div>
            ))}
            </div>
        </div>
        </>
    )
};

export default ManageSpots;