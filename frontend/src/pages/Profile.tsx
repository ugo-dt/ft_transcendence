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
import { useNavigate } from "react-router";
import "./style/Profile.css"
import "../layouts/style/RoomList.css"
import ProfileHistory from "../layouts/ProfileHistory";
import ProfileHeader from "../layouts/ProfileHeader";
import { IClient, IRoom } from "../types";
import { Context } from "../context";
import Requests from "../components/Requests";

function Profile() {
  const client = useContext(Context).client;
  const [profile, setProfile] = useState<IClient | null>(null);
  const [history, setHistory] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      if (window.location.pathname === '/profile' || window.location.pathname === '/profile/') {
        navigate("/profile/" + client.name.toLowerCase());
      }
      setLoading(true);
      const profileName = window.location.pathname.split("/").pop()!;

      Requests.getProfile(profileName).then((profileData) => {
        if (!profileData) {
          navigate("/home")
        };
        setProfile(profileData);
      });

      Requests.getUserMatchHistory(profileName).then((historyData) => {;
        setHistory(historyData);
      });
      setLoading(false);
    }
    getProfile();
  }, []);

  return (
    <div className="Profile">
      {
        loading ? (<h2>Loading...</h2>) : (
          profile != null ? (
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