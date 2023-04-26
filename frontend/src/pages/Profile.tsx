import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import ProfileHistory from "../layouts/ProfileHistory";
import ProfileHeader from "../layouts/ProfileHeader";
import { IUser, IGameRoom } from "../types";
import Request from "../components/Request";
import { Context } from "../context";
import "./style/Profile.css"
import "../layouts/style/RoomList.css"

function Profile() {
  const state = useLocation().state;
  const context = useContext(Context);
  const [info, setInfo] = useState("");
  const [profile, setProfile] = useState<IUser | null>(null);
  const [history, setHistory] = useState<IGameRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const url = window.location.pathname;

  useEffect(() => {
    if (url === '/profile' || url === '/profile/') {
      return navigate("/home");
    }
    const profileName = window.location.pathname.split("/").pop()!;
    document.title = "ft_transcendence - " + profileName;
    window.history.replaceState({}, document.title);
    async function getProfile() {
      setLoading(true);
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
  }, [context, url]);

  return (
    <div className="Profile">
      {
        loading ? (<h2>Loading...</h2>) : (
          profile != null && (
            <>
              <ProfileHeader profile={profile} />
              <h3 id="profile-state-info">{info}&nbsp;</h3>
              <ProfileHistory history={history} profileId={profile.id} />
            </>
          )
        )
      }
    </div>
  );
}

export default Profile;