import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../layouts/NavBar";

export function App() {
	return (
		<>
			<NavBar isSignedIn={false} />
			<Outlet />
			<p>THIS IS A TEMPORARY FOOTER!</p>
		</>
	);
}