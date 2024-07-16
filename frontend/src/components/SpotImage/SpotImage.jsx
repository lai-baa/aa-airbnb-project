import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotDetails } from "../../store/spot";
import './SpotImage.css'

const SpotImage = ({spotId}) => {
    const dispatch = useDispatch();
    const spot = useSelector(() => state.spots[spotId]);

    if (!spot || !spot.SpotImages) return null;

    useEffect(() => {
        dispatch(getSpotDetails(spotId));
    }, [dispatch, spotId]);

    return (
        <div className="spot-details-image-div">
            <div className="large-image image">
                <img src={spot.SpotImages[0].url} alt={spot.name} />
            </div>
            {spot.SpotImages.slice(1, 5).map((image) => (
                <div className="small-image image" key={image.id}>
                    <img src={image.url} alt={image.id} />
                </div>
            ))}
        </div>
    )
}

export default SpotImage;