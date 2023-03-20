import { createBrowserRouter, useNavigate } from "react-router-dom";
import App from "./App";

import Account from "./pages/Account";
import Chat from "./pages/Chat";
import Friends from "./pages/Friends";
import Game from "./pages/Game";
import Play from "./pages/Play";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Rankings from "./pages/Rankings";
import SignIn from "./pages/SignIn";

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
        path: "play",
        element: <Play />,
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
        path: "account",
        element: <Account />
      },
      {
        path: "game",
        element: <Game player1={{ id: 0, name: "Duke", avatar: undefined }}
                       player2={{id: 1, name: "King", avatar: undefined }}
                />,
        children: [
          {
            path: ':id',
            element: <Game player1={{ id: 0, name: "Duke", avatar: undefined }}
                       player2={{id: 1, name: "King", avatar: undefined }}
                      />,
          },
        ]
      }
    ]
  }
])

export default router;