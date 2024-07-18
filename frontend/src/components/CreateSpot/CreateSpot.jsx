import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spot';
// import './CreateSpot.css';

export const CreateSpot = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

	const [country, setCountry] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [lat, setLatitude] = useState(1);
	const [lng, setLongitude] = useState(1);
	const [description, setDescription] = useState('');
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState('');
	const [image1, setImage1] = useState('');
	const [image2, setImage2] = useState('');
	const [image3, setImage3] = useState('');
	const [image4, setImage4] = useState('');
	const [image5, setImage5] = useState('');
	
    const [errors, setErrors] = useState({});
	const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
		const newErrors = {};
		if (!country) newErrors.country = 'Country is required';
		if (!address) newErrors.address = 'Street Address is required';
		if (!city) newErrors.city = 'City is required';
		if (!state) newErrors.state = 'State is required';
		if (description.length < 30)
			newErrors.description = 'Description needs 30 or more characters';
		if (!title) newErrors.title = 'Title is required';
		if (!price) newErrors.price = 'Price per night is required';
		if (!image1) newErrors.image1 = 'Preview Image URL is required';

		setErrors(newErrors);

	}, [country, address, city, state, description, title, price, image1]);

	const handleChange = (e) => {
		const { id, value } = e.target;
		
		if (id === 'country') setCountry(value);
		else if (id === 'address') setAddress(value);
		else if (id === 'city') setCity(value);
		else if (id === 'state') setState(value);
		else if (id === 'lat') setLatitude(value);
		else if (id === 'lng') setLongitude(value);
		else if (id === 'description') setDescription(value);
		else if (id === 'title') setTitle(value);
		else if (id === 'price') setPrice(value);
		else if (id === 'image1') setImage1(value);
		else if (id === 'image2') setImage2(value);
		else if (id === 'image3') setImage3(value);
		else if (id === 'image4') setImage4(value);
		else if (id === 'image5') setImage5(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setHasSubmitted(true);

		const newErrors = {};
		if (!country) newErrors.country = 'Country is required';
		if (!address) newErrors.address = 'Street Address is required';
		if (!city) newErrors.city = 'City is required';
		if (!state) newErrors.state = 'State is required';
		if (description.length < 30) newErrors.description = 'Description needs 30 or more characters';
		if (!title) newErrors.title = 'Title is required';
		if (!price) newErrors.price = 'Price per night is required';
		if (!image1) newErrors.image1 = 'Preview Image URL is required';

		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			return;
		}

		const spot = {
			country,
			address,
			city,
			state,
			description,
			name: title,
			price,
			lat,
			lng
		};

		const images = [image1,
			image2,
			image3,
			image4,
			image5,
			].filter((url) => url
		);

		try {
			const response = await dispatch(createSpot(spot));

			// console.log('>>>>>>>>>>>>>>>>>>>', response)

			if (response) {
			// const newSpot = await response.json();
			navigate(`/spots/${response.id}`);
			} else {
			const errorData = await response.json();
			console.error('Error creating spot:', errorData);
			// Display server-side validation errors
			setErrors((prevErrors) => ({
				...prevErrors,
				...errorData.errors,
			}));
			}
		} catch (error) {
			// await error.json();
			console.error('Error creating spot:', error);
		}
	};	

    return (
		<div className='create-spot-div'>
			<form
				className='create-spot-form'
				action='POST'
				onSubmit={handleSubmit}
			>
				<div className='create-spot-title'>
					<h2>Create a New Spot</h2>
					<h3>Where&apos;s your place located?</h3>
					<p>
						Guests will only get your address once they&apos;ve booked a
						reservation
					</p>
				</div>
				{hasSubmitted && Object.keys(errors).length > 0 && (
					<div className='error-messages'>
						{Object.values(errors).map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				)}
				<div className='form-info form-div-structure'>
					<label htmlFor='country'>Country</label>
					<input
						id='country'
						placeholder='Country'
						type='text'
						value={country}
						onChange={handleChange}
					/>
					{hasSubmitted && errors.country && (
						<p className='error'>{errors.country}</p>
					)}

					<label htmlFor='address'>Street Address</label>
					<input
						id='address'
						placeholder='Street Address'
						type='text'
						value={address}
						onChange={handleChange}
					/>
					{hasSubmitted && errors.address && (
						<p className='error'>{errors.address}</p>
					)}

					<div className='form-city-state'>
						<div className='city-div'>
							<label htmlFor='city'>City</label>
							<input
								id='city'
								placeholder='City'
								type='text'
								value={city}
								onChange={handleChange}
							/>
							{hasSubmitted && errors.city && (
								<p className='error'>{errors.city}</p>
							)}
						</div>
						<div className='state-div'>
							<label htmlFor='state'>State</label>
							<input
								id='state'
								placeholder='State'
								type='text'
								value={state}
								onChange={handleChange}
							/>
							{hasSubmitted && errors.state && (
								<p className='error'>{errors.state}</p>
							)}
						</div>

						<div className='lat-div'>
							<label htmlFor='lat'>Latitude</label>
							<input
								id='lat'
								placeholder='Latitude'
								type='text'
								value={lat}
								onChange={handleChange}
							/>
						</div>

						<div className='lng-div'>
							<label htmlFor='lng'>Longitude</label>
							<input
								id='lng'
								placeholder='Longitude'
								type='text'
								value={lng}
								onChange={handleChange}
							/>
						</div>
					</div>
				</div>

				<div className='line-break'></div>

				<div className='form-description form-div-structure'>
					<div className='form-headers'>
						<h3>Describe your place to guests</h3>
						<p>
							Mention the best features of your space, any special amenities
							like fast wifi or parking, and what you love about the
							neighborhood.
						</p>
					</div>
					<textarea
						className='form-textarea'
						placeholder='Please write at least 30 characters'
						id='description'
						value={description}
						onChange={handleChange}
					/>
					{hasSubmitted && errors.description && (
						<p className='error'>{errors.description}</p>
					)}
				</div>

				<div className='line-break'></div>

				<div className='form-title form-div-structure'>
					<div className='form-headers'>
						<h3>Create a title for your spot</h3>
						<p>
							Catch guests&apos; attention with a spot title that highlights
							what makes your place special
						</p>
					</div>
					<input
						className='input-title'
						placeholder='Name of your spot'
						type='text'
						id='title'
						value={title}
						onChange={handleChange}
					/>
					{hasSubmitted && errors.title && (
						<p className='error'>{errors.title}</p>
					)}
				</div>

				<div className='line-break'></div>

				<div className='form-price form-div-structure'>
					<div className='form-headers'>
						<h3>Set a base price for your spot</h3>
						<p>
							Competitive pricing can help your listing stand out and rank
							higher in search results
						</p>
					</div>
					<label>
						$
						<input
							className='input-price'
							placeholder='Price per night (USD)'
							type='number'
							id='price'
							value={price}
							onChange={handleChange}
						/>
					</label>
					{hasSubmitted && errors.price && (
						<p className='error'>{errors.price}</p>
					)}
				</div>

				<div className='line-break'></div>

				<div className='image-inputs form-div-structure'>
					<div className='form-headers'>
						<h3>Liven up your spot with photos</h3>
						<p>Submit a link to at least one photo to publish your spot</p>
					</div>

					<input
						placeholder='Image URL'
						type='url'
						id='image1'
						value={image1}
						onChange={handleChange}
					/>
					{hasSubmitted && errors.image1 && (
						<p className='error'>{errors.image1}</p>
					)}

					<input
						placeholder='Image URL'
						type='url'
						id='image2'
						value={image2}
						onChange={handleChange}
					/>

					<input
						placeholder='Image URL'
						type='url'
						id='image3'
						value={image3}
						onChange={handleChange}
					/>

					<input
						placeholder='Image URL'
						type='url'
						id='image4'
						value={image4}
						onChange={handleChange}
					/>

					<input
						placeholder='Image URL'
						type='url'
						id='image5'
						value={image5}
						onChange={handleChange}
					/>
				</div>

				<div className='line-break'></div>
				<button
					type='submit'
					onSubmit={handleSubmit}
				>
					Create a Spot
				</button>
			</form>
		</div>
	);
};

export default CreateSpot;

// import SpotForm from "./SpotForm";

// const CreateSpot = () => {
//   const spot = {
//     country: '',
// 		address: '',
// 		city: '',
// 		state: '',
//     lat: '',
//     lng: '',
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