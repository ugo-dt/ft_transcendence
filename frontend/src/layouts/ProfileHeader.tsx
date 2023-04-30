import { ChangeEvent, useContext, useEffect, useState } from "react";
import { IUser } from "../types";
import { QueueContext, UserContext } from "../context";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import ChatIcon from '@mui/icons-material/Chat';
import BlockIcon from '@mui/icons-material/Block';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Request from "../components/Request";
import EditUsernameForm from "./EditUsernameForm";
import EditAvatarForm from "./EditAvatarForm";
import { useNavigate } from "react-router";
import GameInvite from "./GameInvite";
import "./style/ProfileHeader.css"
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { E164Number } from "libphonenumber-js/types";
import Grid from "@mui/material/Unstable_Grid2";
import SendIcon from "@mui/icons-material/Send";

function PaddleColorBox({ profileColor, color }: { profileColor: string, color: string }) {
  const setUser = useContext(UserContext).setUser;

  function setPaddleColor(color: string) {
    if (profileColor === color) {
      return;
    }
    Request.editPaddleColor(color).then(res => {
      if (res) {
        setUser(res);
      }
    });
  }

  return (
    <div
      style={{ backgroundColor: `${color}` }}
      className={`box ${profileColor === `${color}` ? 'selected' : ''}`}
      onClick={() => setPaddleColor(`${color}`)}
    />
  );
}

// todo: add spectate button if in game
function ProfileHeader({ profile }: { profile: IUser }) {
  const inQueue = useContext(QueueContext).inQueue;
  const context = useContext(UserContext);
  //const user = useContext(UserContext).user;
  const {user, setUser} = useContext(UserContext);
  const navigate = useNavigate();
  const [isFriend, setIsFriend] = useState(false);
  const [isAvatarFormOpen, setIsAvatarFormOpen] = useState(false);
  const [isUsernameFormOpen, setIsUsernameFormOpen] = useState(false);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [open2fa, setOpen2fa] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>(undefined);
  const [otp, setOtp] = useState('');
  const [isSendSMSButtonDisabled, setIsSendSMSButtonDisabled] = useState(false);
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);
  const [otpMessageState, setOtpMessageState] = useState(0);

  function handle2faOpen() {
    setOtpMessageState(0);
    setOpen2fa(true);
  }

  function handle2faClose() {
    setOpen2fa(false);
    setIsSendSMSButtonDisabled(false);
    setIsConfirmButtonDisabled(true);
    setPhoneNumber(undefined);
    setOtp('');
  }

  function onClickEditUsername() { setIsUsernameFormOpen(!isUsernameFormOpen); }
  function onClickEditAvatar() { setIsAvatarFormOpen(!isAvatarFormOpen); }

  function onClickAddFriend() {
    if (!user) {
      return; // todo: redirect to sign in
    }
    Request.addFriend(profile.username);
    navigate("/profile/" + profile.username.toLowerCase(), { state: { info: 'Friend added successfully.' } });
    window.location.reload();
  }

  function onClickRemoveFriend() {
    if (!user) {
      return;
    }
    Request.removeFriend(profile.username);
    navigate("/profile/" + profile.username.toLowerCase(), { state: { info: 'Friend removed successfully.' } });
    window.location.reload();
  }

  function onClickChallenge() { setIsChallengeOpen(!isChallengeOpen); }
  function onClickMessage() { console.log("message"); }
  function onClickBlock() { console.log("block"); }

  function onClickSendSMS() {
    if (phoneNumber) { // avoid undefined syntax error on the line below
      const str = phoneNumber.toString();
      if (isValidPhoneNumber(str)) {
        Request.generateOtp(str);
        setIsSendSMSButtonDisabled(true);
        setIsConfirmButtonDisabled(false);
      }
    }
  }

  async function onClickConfirmSMS() {
    if (phoneNumber) { // avoid undefined syntax error on the line below
      const res = await Request.validateOtp(phoneNumber.toString(), otp);
      console.log(res);
      if (res !== null) {
        // set user 2fa to true with call to backend
        // display success message
        if (user) setUser({...user, has2fa: true});
        setOtpMessageState(1);
      } else {
        setOtpMessageState(2);
      }
    }
    handle2faClose();
  }

  async function onClickDisable2fa() {
    const res = await Request.disable2fa();
    if (res && user) setUser({...user, has2fa: false});
  }

  function onChangeSMSCode(event: ChangeEvent<HTMLInputElement>) {
    setOtp(event.target.value);
  }

  useEffect(() => {
    if (user && profile && user.friends && user.friends.length > 0) {
      if (user.friends.includes(profile.username)) {
        setIsFriend(true);
      }
    }
  }, [context,]);

  // delete after
  console.log(user);

  return (
    <div className="profile-header-container">
      <div className="profile-header-info">
        <section>
          <div className="profile-header-avatar">
            <img id="profile-avatar-component"
              src={profile.avatar}
              width={120}
              height={120}
              alt={profile.username}
            />
            {
              user && profile.username === user.username &&
              <div role="button" onClick={onClickEditAvatar} className="upload-icon-wrapper">
                <AddPhotoAlternateIcon className="upload-icon" fontSize="large" />
              </div>
            }
          </div>
        </section>
        <section className="profile-header-content">
          <div className="profile-header-details-container">
            <h1 id="profile-header-details-username">{profile.username}</h1>
          </div>
          <div className="profile-header-details">
            <h3 id="profile-header-details-rating">Rating: {profile.rating}</h3>
            <h3 id="profile-header-details-status">Status: {profile.status.charAt(0).toLocaleUpperCase() + profile.status.slice(1)}</h3>
          </div>
          {
            user && profile.username === user.username ? (
              <div className="profile-header-actions">
                <section className="profile-colors-container">
                  <PaddleColorBox profileColor={profile.paddleColor} color="white" />
                  <PaddleColorBox profileColor={profile.paddleColor} color="yellow" />
                  <PaddleColorBox profileColor={profile.paddleColor} color="#fd761b" />
                  <PaddleColorBox profileColor={profile.paddleColor} color="#ff0000" />
                  <PaddleColorBox profileColor={profile.paddleColor} color="#ff14b8" />
                  <PaddleColorBox profileColor={profile.paddleColor} color="#9114ff" />
                  <PaddleColorBox profileColor={profile.paddleColor} color="blue" />
                  <PaddleColorBox profileColor={profile.paddleColor} color="#14ebff" />
                  <PaddleColorBox profileColor={profile.paddleColor} color="green" />
                  <PaddleColorBox profileColor={profile.paddleColor} color="#92ff0c" />
                </section>
                <section className="profile-buttons-container">
                  <div role="button" className="profile-header-actions-btn edit-profile-btn"
                    onClick={onClickEditUsername}
                  >
                    <EditIcon className="profile-header-actions-icon" /> Edit username
                  </div>
                  {user.has2fa ?
                    <Button variant="contained" size="small" color="error" onClick={onClickDisable2fa}>Disable 2FA</Button>
                  :
                    <div role="button" className="profile-header-actions-btn edit-profile-btn"
                      onClick={handle2faOpen}
                    >
                      <VpnKeyIcon className="profile-header-actions-icon" /> Enable 2FA
                    </div>
                  }
                  <Dialog open={open2fa} onClose={handle2faClose}>
                    <DialogTitle>Activate 2FA</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        To activate 2FA enter a valid phone number. You will then receive
                        a SMS with a code you will have to confirm.
                      </DialogContentText>
                      <Grid container columnSpacing={2} rowSpacing={4}>
                        <Grid xs={8}>
                          <PhoneInput international countryCallingCodeEditable={false} defaultCountry="FR" value={phoneNumber} onChange={setPhoneNumber} />
                        </Grid>
                        <Grid xs={4}>
                          <Button variant="contained" endIcon={<SendIcon />} onClick={onClickSendSMS} disabled={isSendSMSButtonDisabled}>Send SMS</Button>
                        </Grid>
                        <Grid xs={8} display="flex" justifyContent="center">
                          <TextField id="outlined-size-small" label="SMS Code" variant="outlined" size="small" onChange={onChangeSMSCode} value={otp}/>
                        </Grid>
                        <Grid xs={4}>
                        <Button variant="contained" disabled={isConfirmButtonDisabled} onClick={onClickConfirmSMS}>Confirm code</Button>
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handle2faClose}>Close</Button>
                    </DialogActions>
                  </Dialog>
                </section>
                {otpMessageState === 1 && <Alert severity="success">You have succesfully activated 2FA!</Alert>}
                {otpMessageState === 2 && <Alert severity="error">You have entered a wrong code, retry.</Alert>}
              </div>
            ) : (
              <div className="profile-buttons-container">
                {
                  !isFriend &&
                  <div role="button" className="profile-header-actions-btn add-friend-btn"
                    onClick={onClickAddFriend}
                  > <PersonAddAlt1Icon className="profile-header-actions-icon" /> Add friend
                  </div>
                }
                {
                  isFriend &&
                  <div role="button" className="profile-header-actions-btn add-friend-btn"
                    onClick={onClickRemoveFriend}
                  > <PersonRemoveIcon className="profile-header-actions-icon" /> Remove friend
                  </div>
                }
                {
                  (profile.status === 'online' && !inQueue &&
                    <div role="button" className="profile-header-actions-btn challenge-btn"
                      onClick={onClickChallenge}
                    >
                      <SportsTennisIcon className="profile-header-actions-icon" /> Challenge
                    </div>)
                  // || profile.status === 'in game' &&
                  // (
                  //   <div role="button" className="profile-header-actions-btn challenge-btn"
                  //     onClick={onClickChallenge}
                  //   >
                  //     <SportsTennisIcon className="profile-header-actions-icon" /> Watch
                  //   </div>)
                }
                  <div role="button" className="profile-header-actions-btn message-btn"
                    onClick={onClickMessage}
                  >
                    <ChatIcon className="profile-header-actions-icon" /> Message
                  </div>
                  <div role="button" className="profile-header-actions-btn block-btn"
                    onClick={onClickBlock}
                  >
                    <BlockIcon className="profile-header-actions-icon" /> Block
                  </div>
              </div>
            )
          }
        </section> {/* className="profile-header-content" */}
      </div>
      {isAvatarFormOpen && <EditAvatarForm onClose={onClickEditAvatar} />}
      {isUsernameFormOpen && <EditUsernameForm onClose={onClickEditUsername} />}
      {isChallengeOpen && <GameInvite title="Challenge" opponentId={profile.id} isRematch={false} onClose={onClickChallenge} />}
    </div>
  )
}

export default ProfileHeader;