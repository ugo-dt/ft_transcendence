// Profile page
//
// Users should be able to:
// 	Add and remove friends
//
// 	See the friends current status: online, offline, in a game, etc)
//
//  See the match history of the current profile
//
//  Watch other people games (if they are playing)
//
// Account settings
// Users should be able to:
// 	Set an avatar
// 	Set a nickame
//	Enable 2FA

import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import "./style/Profile.css"
import "../layouts/style/RoomList.css"
import ProfileHistory from "../layouts/ProfileHistory";
import ProfileHeader from "../layouts/ProfileHeader";
import axios from "axios";
import { IClient, IRoom } from "../types";
import { Context } from "../context";

function Profile() {
  const serverUrl = useContext(Context).serverUrl;
  const [profile, setProfile] = useState({} as IClient);
  const [history, setHistory] = useState([] as IRoom[]);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const navigate = useNavigate();
  
  useEffect(() => {
    
    function getProfile() {
      if (window.location.pathname === '/profile' || window.location.pathname === '/profile/') {
        navigate("/home");
      }
      setProfile({} as IClient);
      setLoading(true); // Set loading state to true before making HTTP requests
      const profileName = window.location.pathname.split("/").pop();
      const userUrl = serverUrl + '/api/pong/users/' + profileName;
      axios.get(userUrl).then(res => {
        setProfile(res.data);
      }).catch(err => {
        navigate("/home");
      });
      const historyUrl = serverUrl + '/api/pong/history/' + profileName;
      axios.get(historyUrl).then(res => {
        setHistory(res.data);
      }).catch(err => {
        console.error(err);
      });
      setLoading(false);
    } 
    getProfile();
  }, []);

  return (
    <div className="Profile">
      {
        loading ? (<h2>Loading...</h2>) : (
          profile.name ? (
            <>
              <ProfileHeader profile={profile} />
              <ProfileHistory history={history} profileId={profile.id} />
            </>
          ) : (<h2>Profile not found</h2>)
        )
      }
    </div>
  );
}

export default Profile;