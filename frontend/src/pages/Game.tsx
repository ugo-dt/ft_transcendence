/**
 * Pong
 * 
 * When mounted:
 *  set default positions of paddles, ball
 *  draw the first frame
 * 
 * On start:
 *  render a new frame each time the state changes
 * 
 * On each re-render:
 *  clear canvas
 *  draw net, ball, paddles
 * 
 * State:
 *  game class
 *    Ball: (radius, pos(x, y), velocity(x, y), color)
 *    Paddles: (pos(x, y), width, height color)
 *    Player: (id, name, avatar)
 * 
 * fix paddle movements
 * check collisions with paddle
 * add score
 */

import { Navigate, useLocation } from "react-router";
import Pong from "../layouts/Pong";
import { useEffect } from "react";
import { io } from "socket.io-client";

const Test = () => {
  async function connect() {
    // const socket = io("http://localhost:3000/pong");
    // console.log("connected");

    const post = await fetch("http://localhost:3000/pong").then((res) => res.text());
    console.log(post);
  }

  useEffect(() => {
    connect();
  }, []);

  return (
    <h1>test socket</h1>
  );
}

function Game() {
  const location = useLocation();
  
  // Users should not be able to navigate to '/game' by themselves
  if (!location.state) {
    return (
      <Navigate replace to={"/play"} />
      );
    }  

  const { leftPlayerData, rightPlayerData } = location.state;

  return (
    <>
      <Test />
      {/* <div className="Game" style={{
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}>
        <Pong leftPlayerData={leftPlayerData} rightPlayerData={rightPlayerData} debug={true} />
      </div> */}
    </>
  );
}

export default Game;