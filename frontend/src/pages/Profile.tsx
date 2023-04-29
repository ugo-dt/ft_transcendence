import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import ProfileHistory from "../layouts/ProfileHistory";
import ProfileHeader from "../layouts/ProfileHeader";
import { IUser, IGameRoom } from "../types";
import Request from "../components/Request";
import "./style/Profile.css"
import "../layouts/style/RoomList.css"
import { Context } from "../context";

function Profile() {
  const state = useLocation().state;
  const context = useContext(Context);
  const [info, setInfo] = useState("");
  const [profile, setProfile] = useState<IUser | null>(null);
  const [historyList, setHistoryList] = useState<IGameRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const url = window.location.pathname;
  const profileName = url.split("/").pop()!;
  document.title = "ft_transcendence - " + profileName;
  
  useEffect(() => {
    if (url === '/profile' || url === '/profile/') {
      return navigate("/home");
    }
    if (state) {
      setInfo(state.info);
    }
    async function getProfile() {
      setLoading(true);
      Request.getProfile(profileName).then((profileData) => {
        if (!profileData) {
          return navigate("/home");
        };
		console.log("profileData: ", profileData);
        setProfile(profileData);
        Request.getUserMatchHistory(profileData.id).then((historyData) => {;        
          setHistoryList(historyData);
        });
      }).catch(err => {
        console.error(err);
        navigate("/home");
      });
      setLoading(false);
    }
    getProfile();
  }, [context, url]);

  return (
    <div className="Profile">
      {
        loading ? (<h2>Loading...</h2>) : (
          profile != null && (
            <>
              <ProfileHeader profile={profile} />
              <h3 id="profile-state-info">{info}&nbsp;</h3>
              <ProfileHistory history={historyList} profileId={profile.id} />
            </>
          )
        )
      }
    </div>
  );
}

export default Profile;