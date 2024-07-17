// frontend/src/components/SignupFormPage/SignupFormPage.jsx

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal.jsx';
import { signup } from '../../store/session.js';
// import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const { closeModal } = useModal();

  useEffect(() => {
    setErrors({})

    if (username.length < 4 ||password.length < 6 || firstName.length < 2 || lastName.length < 2 || confirmPassword.length < 6 || !email.length
    )  return setIsDisabled(true)

    setIsDisabled(false)
  }, [username, password, email, firstName, lastName, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        setErrors({confirmPassword: 'Passwords do not match'});
    } else {
        const payload = {
            username,
            firstName,
            lastName,
            email,
            password
        }

       dispatch(signup(payload))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data?.errors) {
                    setErrors(data.errors);
                }
            })

    }
  }
  return (
    <div className='sign-up-div'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {errors.email && <p className='error-message'>{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        {errors.username && <p className='error-message'>{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        {errors.firstName && <p className='error-message'>{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        {errors.lastName && <p className='error-message'>{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {errors.password && <p className='error-message'>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        {errors.confirmPassword && (
          <p className='error-message'>{errors.confirmPassword}</p>
        )}
        <button disabled={isDisabled} className={isDisabled? 'disabled' : ''}  type='submit'>Signup</button>
      </form>
    </div>
  );
}

export default SignupFormModal;