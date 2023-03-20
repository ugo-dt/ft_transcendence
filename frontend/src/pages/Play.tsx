// Game page
//
// Play
//  Ranked
//  Invite a friend
//  Against the computer

import "./style/Play.css"

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import BotGameLogo from '../resources/BotGameLogo.png';
import FriendGameLogo from '../resources/FriendGameLogo.png';
import RankedGameLogo from '../resources/RankedGameLogo.png';

function Game() {
	function LogTest() {
		console.log("test");

	}

	return (
		<div className="gamePage">
			<h1>Play:</h1>
			<div className="playModes">
				<div className="modules" onClick={LogTest} role="button">
					<img className="moduleImage" src={RankedGameLogo} alt="Ranked Game Logo" width="50" height="60" />
					<h2 className="gameModeTitle">Ranked Game</h2>
				</div>
				<div className="modules" onClick={LogTest}>
					<img className="moduleImage" src={BotGameLogo} alt="Ranked Game Logo" width="50" height="60" />
					<h2 className="gameModeTitle">Bot Game</h2>
				</div>
				<div className="modules" onClick={LogTest}>
					<img className="moduleImage" src={FriendGameLogo} alt="Ranked Game Logo" width="50" height="60" />
					<h2 className="gameModeTitle">Friend Game</h2>
				</div>
			</div>
		</div>
	);
}

export default Game;