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
import { useLocation, useNavigate } from "react-router";
import ProfileHistory from "../layouts/ProfileHistory";
import ProfileHeader from "../layouts/ProfileHeader";
import { IUser, IGameRoom } from "../types";
import Request from "../components/Request";
import "./style/Profile.css"
import "../layouts/style/RoomList.css"
import { UserContext } from "../context";

function Profile() {
  const state = useLocation().state;
  const [info, setInfo] = useState("");
  const [profile, setProfile] = useState<IUser | null>(null);
  const [history, setHistory] = useState<IGameRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.history.replaceState({}, document.title);
    async function getProfile() {
      if (window.location.pathname === '/profile' || window.location.pathname === '/profile/') {
        return navigate("/home");
      }
      setLoading(true);
      const profileName = window.location.pathname.split("/").pop()!;
      Request.getProfile(profileName).then((profileData) => {
        if (!profileData) {
          return navigate("/home");
        };
        setProfile(profileData);
        Request.getUserMatchHistory(profileData.id).then((historyData) => {;        
          setHistory(historyData);
        });
      }).catch(err => {
        console.error(err);
        navigate("/home");
      });
      setLoading(false);
    }
    getProfile();
    if (state) {
      setInfo(state.info);
    }
  }, []);

  return (
    <div className="Profile">
      {
        loading ? (<h2>Loading...</h2>) : (
          profile != null ? (
            <>
              <ProfileHeader profile={profile} />
              <h3 id="profile-state-info">{info}&nbsp;</h3>
              <ProfileHistory history={history} profileId={profile.id} />
            </>
          ) : (<h2>Profile not found</h2>)
        )
      }
    </div>
  );
}

export default Profile;