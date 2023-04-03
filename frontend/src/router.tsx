import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Account from "./pages/Account";
import Friends from "./pages/Friends";
import Chat from "./pages/Chat/Chat";
import Game from "./pages/Game";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Rankings from "./pages/Rankings";
import Settings from "./pages/Settings";
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
        element: <Game />
      },
      {
        path: "Messages",
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
        path: 'settings',
		element: <Settings />
      },
    ]
  }
])

export default router;