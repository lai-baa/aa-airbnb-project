// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
	const dispatch = useDispatch();
	const [credential, setCredential] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { closeModal } = useModal();

	useEffect(() => {
		const disable = {};
		if (credential.length < 4) {
			disable.credential = 'Username must be longer than 4 characters';
		}
		if (password.length < 6) {
			disable.password = 'Password must be longer than 6 characters';
		}
		setErrors(disable);
	}, [credential, password]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrors({});
		return dispatch(sessionActions.login({ credential, password }))
			.then(closeModal)
			.catch(async (res) => {
				const data = await res.json();
				// console.log('DATA >>>>>>>>>>>', data)
				if (data && data.errors) {
					setErrors(data.errors);
					console.log('ERRORS ARE HERE >>>>>>>>>>>>', errors)
				} else {
					setErrors({ credential: 'The provided credentials were invalid.' });
				}
			});
	};

	const handleSubmitDemo = (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrors({});
		return dispatch(
			sessionActions.login({ credential: 'Demo-lition', password: 'password' })
		).then(closeModal);
	};

	return (
		<div className='login-wrapper'>
			<h1>Log In</h1>
			<form
				className='login-form'
				onSubmit={handleSubmit}
			>
				<label>
					Username
					<input
						type='text'
						value={credential}
						onChange={(e) => setCredential(e.target.value)}
						required
					/>
				</label>
				{errors.credential && isSubmitting && (
					<p className='error-message'>{errors.credential}</p>
				)}
				<label>
					Password
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				{errors.password && isSubmitting && (
					<p className='error-message'>{errors.password}</p>
				)}
				<button
					className='login-button'
					type='submit'
					disabled={Object.values(errors).length > 0}
				>
					Log In
				</button>
				<button
					className='demo-login-button'
					onClick={handleSubmitDemo}
				>
					Login as Demo User
				</button>
			</form>
		</div>
	);
}

export default LoginFormModal;