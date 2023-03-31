import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Account from "./pages/Account";
import Chat from "./pages/Chat";
import Friends from "./pages/Friends";
import Game from "./pages/Game";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Rankings from "./pages/Rankings";
import SignIn from "./pages/SignIn";
import BotGame from "./pages/BotGame";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "*",
        element: <NotFound />
      },
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: "home",
            element: <Home />,
          },
        ]
      },
      {
        path: "signin",
        element: <SignIn />
      },
      {
        path: "messages",
        element: <Chat />
      },
      {
        path: "friends",
        element: <Friends />
      },
      {
        path: "rankings",
        element: <Rankings />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "settings",
        element: <Account />
      },
      {
        path: "game",
        element: <Game />,
        children: [
          {
            path: ':id',
            element: <Game />,
          },
        ]
      },
      {
        path: 'computer',
        element: <BotGame />
      }
    ]
  }
])

export default router;