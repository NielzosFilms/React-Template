import { Layout } from "../layout";
import React from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import { AuthenticationProvider, useAuth } from "../providers";

import { Login } from "../components/authentication/Login";
import { ChangePassword } from "../components/authentication/ChangePassword";

import { CrudTable } from "../components/model";

export function App() {
	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					// primary: {
					// 	light: "#F59C9C",
					// 	main: "#A45D5D",
					// 	dark: "#613A3A",
					// 	contrastText: "#FFD9A4",
					// },
					// secondary: {
					// 	light: "#FFD9A4",
					// 	main: "#FFC069",
					// 	dark: "#946C34",
					// },
					type: prefersDarkMode ? "dark" : "light",
				},
				typography: {
					fontFamily: ["Montserrat", "sans-serif"],
				},
			}),
		[prefersDarkMode]
	);

	const ThemeWrapper = ({ children }) => (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);

	const AuthenticatedPage = () => {
		return (
			<>
				<Switch>
					<Route exact path="/change-password">
						<ChangePassword />
					</Route>
					<Route exact path="/users">
						<CrudTable
							data={[
								{ id: 1, name: "Niels", age: 18 },
								{ id: 2, name: "Esmee", age: 25 },
								{ id: 3, name: "Roelof", age: 51 },
								{ id: 4, name: "Metta", age: 51 },
							]}
							columns={["name", "age"]}
						/>
					</Route>
				</Switch>
			</>
		);
	};

	const GuestPage = () => {
		return (
			<>
				<Login />
			</>
		);
	};

	const Main = () => {
		const authCtx = useAuth();

		if (authCtx.user) {
			return <AuthenticatedPage />;
		} else {
			return <GuestPage />;
		}
	};

	return (
		<ThemeWrapper>
			<SnackbarProvider>
				<AuthenticationProvider>
					<Layout>
						<Main />
					</Layout>
				</AuthenticationProvider>
			</SnackbarProvider>
		</ThemeWrapper>
	);
}
