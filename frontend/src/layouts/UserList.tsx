import './style/UserList.css';
import { IChannel, IUser } from "../types";
import { useContext, useEffect, useState } from 'react';
import { Context, QueueContext, UserContext } from '../context';
import Request from '../components/Request';
import { IMessage } from '../types/IMessage';
import GameInvite from '../components/GameInvite';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useNavigate } from 'react-router';
import { IChat } from '../pages/Chat';

interface UserOptionsProps {
  selectedUser: IUser,
  onClose: () => void,
  currentChannel: IChannel | undefined,
}

function UserOptions({
  selectedUser,
  onClose,
  currentChannel,
}: UserOptionsProps) {
  const navigate = useNavigate();
  const user = useContext(UserContext).user;
  const setUser = useContext(UserContext).setUser;
  const socket = useContext(Context).pongSocket.current;
  const inQueue = useContext(QueueContext).inQueue;
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);

  function onClickChallenge() {
    setIsChallengeOpen(!isChallengeOpen);
  }

  function onBlock() {
    if (!user || !socket || !currentChannel) {
      return;
    }
    Request.blockUser(selectedUser.id).then(res => {
      if (res) {
        setUser(res);
      }
    });
    onClose();
  }

  function onUnblock() {
    if (!user || !socket || !currentChannel) {
      return;
    }
    Request.unblockUser(selectedUser.id).then(res => {
      if (res) {
        setUser(res);
      }
    });
    onClose();
  }

  function onKick() {
    if (!user || !socket || !currentChannel || !currentChannel.admins.includes(user.id)) {
      return;
    }
    socket.emit('kick-user', { channelId: currentChannel.id, kickedId: selectedUser.id });
    onClose();
  }

  function onMute() {
    if (!user || !socket || !currentChannel
      || !currentChannel.admins.includes(user.id) || currentChannel.muted.includes(selectedUser.id)) {
      return;
    }
    socket.emit('mute-user', { channelId: currentChannel.id, mutedId: selectedUser.id });
    onClose();
  }

  function onUnmute() {
    if (!user || !socket || !currentChannel
      || !currentChannel.admins.includes(user.id) || !currentChannel.muted.includes(selectedUser.id)) {
      return;
    }
    socket.emit('unmute-user', { channelId: currentChannel.id, mutedId: selectedUser.id });
    onClose();
  }

  function onBan() {
    if (!user || !socket || !currentChannel || !currentChannel.admins.includes(user.id)) {
      return;
    }
    socket.emit('ban-user', { channelId: currentChannel.id, bannedId: selectedUser.id });
    onClose();
  }

  function onSetAdmin() {
    if (!user || !socket || !currentChannel || !currentChannel.admins.includes(user.id)) {
      return;
    }
    socket.emit('set-admin', { channelId: currentChannel.id, newAdminId: selectedUser.id });
    onClose();
  }

  function onUnsetAdmin() {
    if (!user || !socket || !currentChannel || !currentChannel.admins.includes(user.id)) {
      return;
    }
    if (currentChannel.admins.indexOf(user.id) === 0) {
      socket.emit('unset-admin', { channelId: currentChannel.id, unsetAdminId: selectedUser.id });
    }
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="Form modal">
        <div className="modal-content">
          <div className="modal-close" role="button" onClick={onClose}>&times;</div>
          <div className="modal-title">{selectedUser.username}</div>
          <div style={{ fontWeight: 'lighter' }} className="modal-title">{selectedUser.status.charAt(0).toLocaleUpperCase() + selectedUser.status.slice(1)}</div>
          <section className='member-modal-buttons'>
          <section>
            <button
              className="form-button"
              onClick={() => navigate('/profile/' + selectedUser.username.toLowerCase())}
            > See profile
            </button>
            <button
              className="form-button"
              disabled={inQueue || !(selectedUser.status === 'online')}
              onClick={onClickChallenge}
            > Challenge
            </button>
            <button
              className="form-button"
              onClick={() => (user && user.blocked.includes(selectedUser.id)) ? onUnblock() : onBlock()}
            > {(user && user.blocked.includes(selectedUser.id)) ? 'Unblock' : 'Block'}
            </button>
          </section>
          {
            (currentChannel && user && currentChannel.admins.includes(user.id))
              && (currentChannel.admins.indexOf(user.id) === 0 || !currentChannel.admins.includes(selectedUser.id)) ?
              <section className='admin-buttons'>
                <button
                  className="form-button"
                  onClick={onKick}
                > Kick
                </button>
                <button
                  className="form-button"
                  onClick={() => (currentChannel.muted.includes(selectedUser.id)) ? onUnmute() : onMute()}
                > {(currentChannel.muted.includes(selectedUser.id)) ? 'Unmute' : 'Mute'}
                </button>
                <button
                  className="form-button"
                  onClick={onBan}
                > Ban
                </button>
                {
                  (!currentChannel.admins.includes(selectedUser.id) || (user && currentChannel.admins.indexOf(user.id) === 0))
                  && currentChannel.admins.indexOf(selectedUser.id) != 0
                  &&
                  <button
                    className="form-button"
                    onClick={() => (currentChannel.admins.includes(selectedUser.id)) ? onUnsetAdmin() : onSetAdmin()}
                  > {(currentChannel.admins.includes(selectedUser.id)) ? 'Unset admin' : 'Set admin'}
                  </button>
                }
              </section>
              : <></>
          }
          </section>
        </div>
      </div>
      {isChallengeOpen && <GameInvite title="Challenge" opponentId={selectedUser.id} isRematch={false} onClose={onClickChallenge} />}
    </div>
  )
}

interface UserListProps {
  chat: IChat,
}

function UserList({ chat }: UserListProps) {
  const user = useContext(UserContext).user;
  const { currentChannel, channelUsers } = chat;
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  function handleUserClick(clickedUser: IUser) {
    if (!user || user.id === clickedUser.id) {
      return;
    }
    setSelectedUser(clickedUser);
  }

  function closeSettings() {
    setSelectedUser(null);
  }

  return (
    <div className="UserList">
      <h2 className='chat-section-title'>Members</h2>
      <section className="user-list-container">
        {
          channelUsers.map(user => (
            <div
              key={user.id}
              className='user-list-member'
              onClick={() => handleUserClick(user)}
            >
              <img id="chat-user-info-avatar"
                src={user.avatar}
                width={40}
                height={40}
                alt={user.username}
                title='See profile'
              />
              <h4 style={{display: 'flex'}}>
                {user.username}
                {currentChannel && currentChannel.admins.includes(user.id) &&
                <WorkspacePremiumIcon color={currentChannel.admins.indexOf(user.id) === 0 ? 'primary' : 'secondary'} />}
              </h4>
            </div>
          ))
        }
      </section>
      {selectedUser && (
        <UserOptions
          selectedUser={selectedUser}
          onClose={closeSettings}
          currentChannel={currentChannel}
        />
      )}
    </div>
  )
}

export default UserList;