import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { createSpot, addSpotImage } from '../../store/spot';
import './CreateSpot.css';

export const CreateSpot = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

	const currUser = useSelector((state) => state.session.user);

	const [country, setCountry] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [lat, setLatitude] = useState('0');
	const [lng, setLongitude] = useState('0');
	const [description, setDescription] = useState('');
	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [image1, setImage1] = useState('');
	const [image2, setImage2] = useState('');
	const [image3, setImage3] = useState('');
	const [image4, setImage4] = useState('');
	const [image5, setImage5] = useState('');
	
    const [errors, setErrors] = useState({});
	const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
		let error = {};
		if (!country) error.country = "* Country is required";
		if (!address) error.address = "* Address is required";
		if (!city) error.city = "* City is required";
		if (!state) error.state = "* State is required";
		if (!description || description.length < 30) error.description = "* Description needs a minimum of 30 characters";
		if (!price) error.price = "* Price is required";
		if (!name) error.name = "* Title is required";
		if (!image1) error.image1 = "* Preview image is required.";
		// if (!image1) error.image1 = "* Image URL must end in .png, .jpg, or .jpeg";
		setErrors(error);
	}, [country, address, description, name, state, city, price, image1]);

	// const handleChange = (e) => {
	// 	const { id, value } = e.target;
		
	// 	if (id === 'country') setCountry(value);
	// 	else if (id === 'address') setAddress(value);
	// 	else if (id === 'city') setCity(value);
	// 	else if (id === 'state') setState(value);
	// 	else if (id === 'lat') setLatitude(value);
	// 	else if (id === 'lng') setLongitude(value);
	// 	else if (id === 'description') setDescription(value);
	// 	else if (id === 'title') setTitle(value);
	// 	else if (id === 'price') setPrice(value);
	// 	else if (id === 'image1') setImage1(value);
	// 	else if (id === 'image2') setImage2(value);
	// 	else if (id === 'image3') setImage3(value);
	// 	else if (id === 'image4') setImage4(value);
	// 	else if (id === 'image5') setImage5(value);
	// };

	const handleSubmit = async (e) => {
		e.preventDefault();
		setHasSubmitted(true);

		const newSpotObj = {
			ownerId: currUser.id,
			country,
			address: address,
			lat: lat,
			lng: lng,
			description,
			name,
			state,
			city,
			price,
		};
		const createdSpot = await dispatch(createSpot(newSpotObj));
		const imagePayloads = [
			{ spotId: Number(createdSpot.id), url: image1, preview: true }, // Primary image
			...(image2
			? [{ spotId: Number(createdSpot.id), url: image2, preview: false }]
			: []),
			...(image3
			? [{ spotId: Number(createdSpot.id), url: image3, preview: false }]
			: []),
			...(image4
			? [{ spotId: Number(createdSpot.id), url: image4, preview: false }]
			: []),
			...(image5
			? [{ spotId: Number(createdSpot.id), url: image5, preview: false }]
			: []),
		];
	
		await Promise.all(
			imagePayloads.map((imagePayload) => dispatch(addSpotImage(imagePayload)))
		);
	
		//   console.log("Created spot:", createdSpot);
		navigate(`/spots/${createdSpot.id}`);
	};
	
return (
    <div className="create-spot-div">
      <form onSubmit={handleSubmit} className="create-spot-form">
        <div className="create-spot-title">
          <h2>Create a New Spot</h2>
          <h3>Where&apos;s your place located?</h3>
          <p>
            Guests will only get your exact address once they book a
            reservation.
          </p>
        </div>

        <div className="fill-out-form">
          <label htmlFor="country">Country</label>
          <input
            placeholder="Country"
            type="text"
            id="country"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {errors.country && hasSubmitted && (
            <span className="error">{errors.country}</span>
          )}
        </div>

        <div className="fill-out-form">
          <label htmlFor="address">Street Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && hasSubmitted && (
            <span className="error">{errors.address}</span>
          )}
        </div>

        <div className="city-state">
          <div className="fill-out-form">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && hasSubmitted && (
              <span className="error">{errors.city}</span>
            )}
          </div>

          <div className="fill-out-form">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            {errors.state && hasSubmitted && (
              <span className="error">{errors.state}</span>
            )}
          </div>
        </div>

        <div className="fill-out-form">
          <label htmlFor="lat">Latitude</label>
          <input
            type="number"
            id="lat"
            name="lat"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLatitude(e.target.value)}
          />
          {errors.lat && hasSubmitted && (
            <span className="error">{errors.lat}</span>
          )}
        </div>

        {/* Longitude */}
        <div className="fill-out-form">
          <label htmlFor="lng">Longitude</label>
          <input
            type="number"
            id="lng"
            name="lng"
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLongitude(e.target.value)}
          />
          {errors.lng && hasSubmitted && (
            <span className="error">{errors.lng}</span>
          )}
        </div>

        <div className="line-break"></div>

        <div className="fill-out-form">
          <label htmlFor="description" className="title">Describe your place to guests</label>
          <p>
			Mention the best features of your space, any special amenities
			like fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            id="description"
            name="description"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && hasSubmitted && (
            <span className="error">{errors.description}</span>
          )}
        </div>
        <div className="line-break"></div>
        {/* Spot Title */}
        <div className="fill-out-form">
          <label htmlFor="name" className="title">Create a title for your spot</label>
          <p>
            Catch guests&apos; attention with a spot title that highlights what
            makes your place special.
          </p>

          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && hasSubmitted && (
            <span className="error">{errors.name}</span>
          )}
        </div>

        <div className="line-break"></div>

        <div className="fill-out-form">
          <label htmlFor="price" className="title">Set a base price for your spot</label>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <div className="create-spot-price">
            $
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          {errors.price && hasSubmitted && (
            <span className="error">{errors.price}</span>
          )}
        </div>

        <div className="line-break"></div>

        <div className="fill-out-form">
          <label htmlFor="image1" className="title">Liven up your spot with photos</label>
          <p>
            Submit a link to at least one photo to publish your spot.
          </p>
          <input
            type="text"
            id="image1"
            name="image1"
            placeholder="Preview Image URL"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
          />
          {errors.image1 && hasSubmitted && (
            <span className="error">{errors.image1}</span>
          )}
          {/* Images 2, 3, 4, 5 */}
          <input
            type="text"
            id="image2"
            name="image2"
            placeholder="Image URL (optional)"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
          />
          {errors.image2 && hasSubmitted && (
            <span className="error">{errors.image2}</span>
          )}

          <input
            type="text"
            id="image3"
            name="image3"
            placeholder="Image URL (optional)"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
          />
          <input
            type="text"
            id="image4"
            name="image4"
            placeholder="Image URL (optional)"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
          />
          <input
            type="text"
            id="image5"
            name="image5"
            placeholder="Image URL (optional)"
            value={image5}
            onChange={(e) => setImage5(e.target.value)}
          />
        </div>

        <button>Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpot;

// import SpotForm from "../SpotForm/SpotForm";

// const CreateSpot = () => {
//   const spot = {
//     country: '',
// 		address: '',
// 		city: '',
// 		state: '',
// 		lat: '',
// 		lng: '',
// 		description: '',
// 		name: '',
// 		price: '',
// 		image1: '',
// 		image2: '',
// 		image3: '',
// 		image4: '',
// 		image5: '',
//   };

//   return (
//     <SpotForm
//       spot={spot}
//       formType="Create a New Spot"
//     />
//   );
// };

// export default CreateSpot;