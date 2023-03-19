import React from "react";
import { createBrowserRouter } from "react-router-dom";

import { App } from "./pages/App";
import { Home } from "./layouts/Home";
import { Chat } from "./layouts/Chat";

export const router = createBrowserRouter([
	{
		element: <App />,
		children: [
			{
				path: "/",
				element: <Home />
			},
			{
				path: "chat",
				element: <Chat />
			}
		]
	}
]);