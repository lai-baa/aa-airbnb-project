// frontend/src/components/Navigation/Navigation.jsx

import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import './Navigation.css';
import { FaUmbrellaBeach } from "react-icons/fa6";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  // const navigate = useNavigate();

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   console.log(e)
  //   navigate('/spots/new')
  // }

  return (
    <nav>
      <ul>
          <li id="nav-link-home">
              <NavLink to="/">
                  <div id="site-icon"><FaUmbrellaBeach /></div>
                  laiBNB
              </NavLink>
          </li>
          
          {isLoaded && (
              <div id="user-nav">

              {sessionUser && (
                        <li id='create-new-spot-link'>
                            <NavLink to="/spots/new">Create a New Spot</NavLink>
                        </li>
                    )}

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