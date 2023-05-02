import { useContext, useEffect, useState } from "react";
import {  useNavigate } from "react-router";
import ProfileHistory from "../layouts/ProfileHistory";
import ProfileHeader from "../layouts/ProfileHeader";
import { IUser, IGameRoom } from "../types";
import Request from "../components/Request";
import { UserContext } from "../context";
import "./style/Profile.css"
import "../layouts/style/RoomList.css"

function Profile() {
  const user = useContext(UserContext).user;
  const setUser = useContext(UserContext).setUser;
  const [profile, setProfile] = useState<IUser | null>(null);
  const [historyList, setHistoryList] = useState<IGameRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const profileName = pathname.split("/").pop()!;
  document.title = "ft_transcendence - " + profileName;

  useEffect(() => {
    if (pathname === '/profile' || pathname === '/profile/') {
      return navigate("/home");
    }
    async function getProfile() {
      setLoading(true);
      await Request.getProfile(profileName).then((profileData) => {
        if (!profileData) {
          return navigate("/home");
        };
        setProfile(profileData);
        Request.getUserMatchHistory(profileData.id).then((historyData) => {
          setHistoryList(historyData);
        });
      }).catch(err => {
        console.error(err);
        navigate("/home");
      });
      await Request.me().then(res => {
        if (res) {
          setUser(res);
        }
      });
      setLoading(false);
    }
    getProfile();
  }, [pathname]);

  return (
    <div className="Profile">
      {
        loading ? (<h2>Loading...</h2>) : (
          profile != null && (
            <>
              <ProfileHeader user={user} profile={profile} />
              <ProfileHistory history={historyList} profileId={profile.id} />
            </>
          )
        )
      }
    </div>
  );
}

export default Profile;