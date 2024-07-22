import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { createSpot, editSpot } from '../../store/spot';

import './SpotForm.css';

const SpotForm = ({ spot, formType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState(1);
  const [lng, setLng] = useState(1);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  // const [image1, setImage1] = useState('');
  // const [image2, setImage2] = useState('');
  // const [image3, setImage3] = useState('');
  // const [image4, setImage4] = useState('');
  // const [image5, setImage5] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (spot) {
      setCountry(spot.country || '');
      setAddress(spot.address || '');
      setCity(spot.city || '');
      setState(spot.state || '');
      setLat(spot.lat || 1);
      setLng(spot.lng || 1);
      setDescription(spot.description || '');
      setName(spot.name || '');
      setPrice(spot.price || '');
      // setImage1(spot.image1 || '');
      // setImage2(spot.image2 || '');
      // setImage3(spot.image3 || '');
      // setImage4(spot.image4 || '');
      // setImage5(spot.image5 || '');
    }
  }, [spot]);

    const validateForm = () => {
      const newErrors = {};
      if (!country) newErrors.country = 'Country is required';
      if (!address) newErrors.address = 'Street Address is required';
      if (!city) newErrors.city = 'City is required';
      if (!state) newErrors.state = 'State is required';
      if (description.length < 30) newErrors.description = 'Description needs 30 or more characters';
      if (!name) newErrors.name = 'Title is required';
      if (!price) newErrors.price = 'Price per night is required';
      // if(image1 && (!image1.endsWith('.png') || !image1.endsWith('.jpg') || !image1.endsWith('.jpeg'))){
      //   newErrors.image1 = 'Image URL must end with .png, .jpg, or .jpeg' 
      // }
      // if(image2 && (!image2.endsWith('.png') || !image2.endsWith('.jpg') || !image2.endsWith('.jpeg'))){
      //   newErrors.image2 = 'Image URL must end with .png, .jpg, or .jpeg' 
      // }
      // if(image3 && (!image3.endsWith('.png') || !image3.endsWith('.jpg') || !image3.endsWith('.jpeg'))){
      //   newErrors.image3 = 'Image URL must end with .png, .jpg, or .jpeg' 
      // }
      // if(image4 && (!image4.endsWith('.png') || !image4.endsWith('.jpg') || !image4.endsWith('.jpeg'))){
      //   newErrors.image4 = 'Image URL must end with .png, .jpg, or .jpeg' 
      // }
      // if(image5 && (!image5.endsWith('.png') || !image5.endsWith('.jpg') || !image5.endsWith('.jpeg'))){
      //   newErrors.image5 = 'Image URL must end with .png, .jpg, or .jpeg' 
      // }

      return newErrors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if(Object.values(formErrors).length > 0){
          setErrors(formErrors);
          return;
        }

        setErrors({});
        spot = {
        ...spot,
        country,
        address,
        city,
        state,
        lat,
        lng,
        description,
        name,
        price,
      };

        // console.log('ERRORS >>>>>>>>>>>>>>>>',errors);
    
        // if (Object.keys(newErrors).length > 0) {
        //   return;
        // }
    

        if (formType === 'Create a New Spot') {
            spot = await dispatch(createSpot(spot));
        } else if (formType === 'Update Your Spot') {
            spot = await dispatch(editSpot(spot));
        }

        if (spot.errors) {
        setErrors(spot.errors);
        } else {
        navigate(`/spots/${spot.id}`);
        }
    };

  return (
    <div className='spot-form-div'>
    <form  onSubmit={handleSubmit}>
      <h1>{formType}</h1>
      {/* <div className="errors">{errors.address}</div> */}
      <div className='spot-location'>
      <h2>Where&apos;s your place located?</h2>
      <p>Guests will only get your exact address once they booked a reservation.</p>
      <label>
        Country
        <input
          value={country}
          type="text"
          placeholder='Country'
          onChange={(e) => setCountry(e.target.value)}
        />

      </label>
      {errors.country && <p className='error-message'>{errors.country}</p>}
      <label>
        Street Address
        <input
          value={address}
          type="text"
          placeholder='Address'
          onChange={(e) => setAddress(e.target.value)}
        />

      </label>
      {errors.address && <p className='error-message'>{errors.address}</p>}

      <div className='spot-city-state'>
      <label>
        City
        <input
          value={city}
          type="text"
          placeholder='City'
          onChange={(e) => setCity(e.target.value)}
        />

      </label>
      {errors.city && <p className='error-message'>{errors.city}</p>}

      <label>
        State
        <input
          value={state}
          type="text"
          placeholder='State'
          onChange={(e) => setState(e.target.value)}
        />

      </label>
      {errors.state && <p className='error-message'>{errors.state}</p>}

      </div>
      
      <div className='spot-lat-lng'>
      <label>
        Latitude
        <input
          value={lat}
          type='number'
          placeholder='Latitude'
          onChange={(e) => setLat(e.target.value)}
        />
      </label>
      {errors.lat && <p className='error-message'>{errors.lat}</p>}

      <label>
        Longitude
        <input
          value={lng}
          type='number'
          placeholder='Longitude'
          onChange={(e) => setLng(e.target.value)}
        />
      </label>
      {errors.lng && <p className='error-message'>{errors.lng}</p>}
      </div>
      
      </div>

      <div className='spot-desc'>
      <h2>Describe your place to guests</h2>
      <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
      <label>
        <textarea
          value={description}
          placeholder='Please write at least 30 characters'
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      {errors.description && <p className='error-message'>{errors.description}</p>}

      </div>

      <div className='spot-name'>
      <h2>Create a title for your spot</h2>
      <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
      <label>
        <input
          value={name}
          type="text"
          placeholder='Name of your spot'
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      {errors.name && <p className='error-message'>{errors.name}</p>}
      </div>

      <div className='spot-price'>
      <h2>Set a base price for your spot</h2>
      <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
      <label>
        <input
          value={price}
          type='number'
          placeholder='Price per night (USD)'
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>
      {errors.price && <p className='error-message'>{errors.price}</p>}
      </div>

      {/* <div className='spot-images'>
      <h2>Liven up your spot with photos</h2>
      <p>Submit a link to at least one photo to publish your spot.</p>
      <label>
        <input
          value={image1}
          type='url'
          placeholder='Preview Image URL'
          onChange={(e) => setImage1(e.target.value)}
        />
        {errors.image1 && <p className='error-message'>{errors.image1}</p>}
         <input
          value={image2}
          type='url'
          placeholder='Image URL'
          onChange={(e) => setImage2(e.target.value)}
        />
        {errors.image2 && <p className='error-message'>{errors.image2}</p>}
         <input
          value={image3}
          type='url'
          placeholder='Image URL'
          onChange={(e) => setImage3(e.target.value)}
        />
        {errors.image3 && <p className='error-message'>{errors.image3}</p>}
         <input
          value={image4}
          type='url'
          placeholder='Image URL'
          onChange={(e) => setImage4(e.target.value)}
        />
        {errors.image4 && <p className='error-message'>{errors.image4}</p>}
         <input
          value={image5}
          type='url'
          placeholder='Image URL'
          onChange={(e) => setImage5(e.target.value)}
        />
        {errors.image5 && <p className='error-message'>{errors.image5}</p>}
      </label>
      </div> */}
      
      <button className='spot-button'
      type="submit">
        {formType === "Create a New Spot"? "Create Spot": "Update Spot"}
      </button>
    </form>
    </div>
    
  );
};

export default SpotForm;