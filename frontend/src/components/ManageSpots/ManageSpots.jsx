import {useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsCurrentUser } from '../../store/spot';
// import { useModal } from '../../context/Modal';
import { Link } from "react-router-dom";
// import DeleteModal from '../DeleteModal/DeleteModal';
import '../Spots/Spots.css'

const ManageSpots = () => {
    // const { setModalContent, closeModal } = useModal();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.session.user);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>',currentUser)
    const allSpots = Object.values(
        useSelector((state) => state.spots ? state.spots : [])
    );

    // console.log('ALL SPOTS >>>>>>>>>>>>>>>',allSpots);

    const spotsCurrUser = allSpots.filter((spot) => {
        // console.log('SPOT >>>>>>>>>>>>>>>>',spot);
        spot.ownerId === currentUser.id});

    useEffect(() => {
        dispatch(getAllSpotsCurrentUser());
    }, [dispatch]);

    // const handleClick = (spotId) => {
    //     setModalContent(
    //       <DeleteModal
    //         onDelete={() => handleDeleteConfirm(spotId)}
    //         onClose={closeModal}
    //       />
    //     );
    // };

    // const handleDeleteConfirm = async (spotId) => {
    //     await dispatch(deleteSpot(spotId));
    //     closeModal();
    // };

    return (
        <div className="current_spotlist_container">
            <h1>Manage Spots</h1>

            <div className="image-div">
            {spotsCurrUser.map((spot) => (
            <div key={spot.id} className="spot-div">
            <Link key={spot.id} to={`/spots/${spot.id}`} className="spot-link">
            <img src={spot.previewImage} alt={spot.name} />
                <h4>{spot.name}</h4>

                <div className='spot-text'>
                <span>{spot.city}, {spot.state}</span>
                <span>⭐️ {spot.avgRating && spot.avgRating !== "No rating yet." ? spot.avgRating : "New"}</span>
                </div>
                <span className='spot-price'>${spot.price}</span><span> night</span>
            </Link>

            <div className="curr-user-spot-buttons">
                {/* <button><Link to={`/spots/${spot.id}/edit`}>Update</Link></button> */}
                {/* <button onClick={() => handleClick(spot.id)}>Delete</button> */}
            </div>

            
            </div>

            ))}
            </div>
        </div>
    )
};

export default ManageSpots;