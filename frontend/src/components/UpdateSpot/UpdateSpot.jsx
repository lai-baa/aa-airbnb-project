// import { useParams, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getSpotDetails, editSpot } from '../../store/spot';

// const UpdateSpot = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { spotId } = useParams();
//   const spot = useSelector((state) => state.spots[spotId]);
//   console.log("SPOT >>>>>>>>>>>>>>>>>>>>>", spot);

//   useEffect(() => {
//     dispatch(getSpotDetails(spotId));
//   }, [dispatch, spotId]);
  
//   const [formData, setFormData] = useState({
//     country: "",
//     address: "",
//     city: "",
//     state: "",
//     description: "",
//     name: "",
//     price: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [hasSubmitted, setHasSubmitted] = useState(false);
//   useEffect(() => {
//     if (spot) {
//       setFormData({
//         country: spot.country || "",
//         address: spot.address || "",
//         city: spot.city || "",
//         state: spot.state || "",
//         description: spot.description || "",
//         name: spot.name || "",
//         price: spot.price || "",
//         lat: spot.lat || "",
//         lng: spot.lng || "",
//       });
//     }
//   }, [spot]);

//   useEffect(() => {
//     const newErrors = {};
//     if (!formData.country) newErrors.country = "Country is required";
//     if (!formData.address)
//       newErrors.address = "Street Address is required";
//     if (!formData.city) newErrors.city = "City is required";
//     if (!formData.state) newErrors.state = "State is required";
//     if (formData.description.length < 30)
//       newErrors.description = "Description needs 30 or more characters";
//     if (!formData.name) newErrors.name = "Title is required";
//     if (!formData.price) newErrors.price = "Price per night is required";
//     if (!formData.latitude)
//       newErrors.latitude = "Latitude is required and between 90 to -90";
//     if (!formData.longitude)
//       newErrors.longitude = "Longitude is required and between 180 to -180";
//     setErrors(newErrors);
//   }, [formData]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setHasSubmitted(true);
//     if (Object.keys(errors).length > 0) {
//       return;
//     }
//     try {
//       const updatedSpot = {
//         address: formData.address,
//         city: formData.city,
//         state: formData.state,
//         country: formData.country,
//         lat: formData.lat,
//         lng: formData.lng,
//         name: formData.name,
//         description: formData.description,
//         price: parseFloat(formData.price),
//       };

//       const response = await dispatch(editSpot(spotId, updatedSpot));
      
//       if (response) {
//         navigate(`/spots/${spotId}`);
//       }
//     } catch (res) {
//       const data = await res.json();
//       if (data && data.errors) {
//         setErrors(data.errors);
//       }
//     }
//   };

//   return (
//     <div className="update-spot-form">
//       <form onSubmit={handleSubmit}>
//         <div>
//           <h2>Update Your Spot</h2>
//           <h3 className="title">Where&apos;s your place located?</h3>
//           <p>
//             Guests will only get your exact address once they book a
//             reservation.
//           </p>
//         </div>

//         <div className="fill-out-form">
//           <label htmlFor="country">Country</label>
//           <input
//             placeholder="Country"
//             type="text"
//             id="country"
//             name="country"
//             value={formData.country}
//             onChange={handleChange}
//           />
//           {errors.country && hasSubmitted && (
//             <span className="error">{errors.country}</span>
//           )}
//         </div>

//         <div className="fill-out-form">
//           <label htmlFor="streetaddress">
//             Street Address
//           </label>
//           <input
//             type="text"
//             id="address"
//             name="address"
//             placeholder="Street Address"
//             value={formData.streetaddress}
//             onChange={handleChange}
//           />
//           {errors.address && hasSubmitted && (
//             <span className="error">{errors.address}</span>
//           )}
//         </div>

//         <div>
//           <div className="fill-out-form">
//             <label htmlFor="city">City</label>
//             <input
//               type="text"
//               id="city"
//               name="city"
//               placeholder="City"
//               value={formData.city}
//               onChange={handleChange}
//             />
//             {errors.city && hasSubmitted && (
//               <span className="error">{errors.city}</span>
//             )}
//           </div>

//           <div className="fill-out-form">
//             <label htmlFor="state">State</label>
//             <input
//               type="text"
//               id="state"
//               name="state"
//               placeholder="Enter state"
//               value={formData.state}
//               onChange={handleChange}
//             />
//             {errors.state && hasSubmitted && (
//               <span className="error">{errors.state}</span>
//             )}
//           </div>
//         </div>

//         <div className="fill-out-form">
//           <label htmlFor="latitude">Latitude</label>
//           <input
//             type="number"
//             id="lat"
//             name="lat"
//             placeholder="Latitude"
//             value={formData.lat}
//             onChange={handleChange}
//           />
//           {errors.lat && hasSubmitted && (
//             <span className="error">{errors.lat}</span>
//           )}
//         </div>

//         <div className="fill-out-form">
//           <label htmlFor="longitude">Longitude</label>
//           <input
//             type="number"
//             id="lng"
//             name="lng"
//             placeholder="Longitude"
//             value={formData.lng}
//             onChange={handleChange}
//           />
//           {errors.lng && hasSubmitted && (
//             <span className="error">{errors.lng}</span>
//           )}
//         </div>

//         <div className="line-break"></div>

//         <div className="fill-out-form">
//           <label htmlFor="description" className="title">
//             Describe your place to guests
//           </label>
//           <p>
//             Mention the best features of your space, any special amenities
//             like fast wifi or parking, and what you love about the neighborhood.
//           </p>
//           <textarea
//             id="description"
//             name="description"
//             placeholder="Please write at least 30 characters"
//             value={formData.description}
//             onChange={handleChange}
//           />
//           {errors.description && hasSubmitted && (
//             <span className="error">{errors.description}</span>
//           )}
//         </div>
//         <div className="line-break"></div>
//         {/* Spot Title */}
//         <div className="fill-out-form">
//           <label htmlFor="name" className="title">
//             Create a title for your spot
//           </label>
//           <p>
//             Catch guests&apos; attention with a spot title that highlights what
//             makes your place special.
//           </p>

//           <input
//             type="text"
//             id="name"
//             name="name"
//             placeholder="Name of your spot"
//             value={formData.name}
//             onChange={handleChange}
//           />
//           {errors.name && hasSubmitted && (
//             <span className="error">{errors.name}</span>
//           )}
//         </div>

//         <div className="line-break"></div>

//         <div className="fill-out-form">
//           <label htmlFor="price" className="title">
//             Set a base price for your spot
//           </label>
//           <p>
//             Competitive pricing can help your listing stand out and rank higher
//             in search results.
//           </p>
//           <div className="create-spot-price">
//             $
//             <input
//               type="number"
//               id="price"
//               name="price"
//               placeholder="Price per night (USD)"
//               value={formData.price}
//               onChange={handleChange}
//             />
//           </div>
//           {errors.price && hasSubmitted && (
//             <span className="error">{errors.price}</span>
//           )}
//         </div>
//         <div className="line-break"></div>

//         <button>
//           Update your Spot
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UpdateSpot;

import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpotDetails } from '../../store/spot';
import SpotForm from '../SpotForm/SpotForm';


const UpdateSpot = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots[spotId]);

  useEffect(() => {
    dispatch(getSpotDetails(spotId))
  }, [dispatch, spotId])

  if (!spot) return null;

  return (
    Object.keys(spot).length > 1 && (
      <>
        <SpotForm
          spot={spot}
          formType="Update Your Spot"
        />
      </>
    )
  );
};

export default UpdateSpot;