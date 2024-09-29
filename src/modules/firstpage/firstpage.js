import React, {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../../context/auth/AuthContext';
import './firstpage.css'; // For your CSS styling

const FirstPage = props => {
  const {
    state: {isAuthenticated},
  } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="firstpage-container">
      <div className="firstpage-navbar">
        <h1 className="firstpage-logo-text">EXPLORE LIKE THE WORLD IS YOUR OYSTER</h1>
        <button
          className="firstpage-plan-button"
          onClick={() => {
            if (isAuthenticated) {
              navigate('/itineraries');
            } else {
              navigate('/login');
            }
          }}>
          My Itineraries 🗒
        </button>
      </div>
      <div className="firstpage-features">
        <div className="firstpage-feature-box">
          <h3>Plan & save with ease</h3>
          <p>
            Bookmark destinations and create your personalized itinerary
            effortlessly.
          </p>
        </div>
        <div className="firstpage-feature-box">
          <h3>Hassle-free booking</h3>
          <p>
            Book flights, stays, and activities in one place while AI finds the
            best deals.
          </p>
        </div>
        <div className="firstpage-feature-box">
          <h3>Discover on the go</h3>
          <p>
            Get personalized local recommendations from our AI chatbot, tailored
            to your location and interests.
          </p>
        </div>
        <div className="firstpage-feature-box">
          <h3>Stay updated</h3>
          <p>
            Receive real-time itinerary alerts and travel notifications for a
            smooth trip.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;
