// frontend/src/components/Navigation/Navigation.jsx

import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import './Navigation.css';
import { FaUmbrellaBeach } from "react-icons/fa6";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    console.log(e)
    navigate('/spots/new')
  }

  return (
    <nav>
      <ul>
          <li id="home-nav">
              <NavLink to="/">
                  <div id="site-icon"><FaUmbrellaBeach /></div>
                  laiBNB
              </NavLink>
          </li>
          {isLoaded && (
              <div id="user-nav">
              <li className={sessionUser? '': 'hide'} onClick={handleClick}>Create a New Spot</li>
              <li>
                  <ProfileButton user={sessionUser} />
              </li>
              </div>
          )}
      </ul>
    </nav>
  )
}

export default Navigation;