import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

const AuthCtx = React.createContext();

const QUERY_USER = gql`
	query LoggedIn {
		getAuthenticatedUser {
			id
			name
			admin
			createdAt
			updatedAt
		}
	}
`;

const MUT_LOGIN = gql`
	mutation Login($name: String!, $password: String!) {
		login(username: $name, password: $password) {
			success
			token
		}
	}
`;

const MUT_LOGOUT = gql`
	mutation Logout {
		logout
	}
`;

const MUT_CHANGE_PASS = gql`
	mutation ChangePassword($password: String!) {
		changePassword(password: $password)
	}
`;

const MUT_REGISTER = gql`
	mutation Register($name: String!, $password: String!, $admin: Boolean!) {
		register(username: $name, password: $password, admin: $admin) {
			success
			token
		}
	}
`;

export function AuthenticationProvider({ children }) {
	const queryUserResult = useQuery(QUERY_USER);

	const { enqueueSnackbar } = useSnackbar();

	const [loginMut, loginRes] = useMutation(MUT_LOGIN);
	const [logout, logoutRes] = useMutation(MUT_LOGOUT);
	const [changePassowrdMut, changePasswordRes] = useMutation(MUT_CHANGE_PASS);
	const [registerMut, registerMutRes] = useMutation(MUT_REGISTER);

	const history = useHistory();

	const [user, setUser] = React.useState(null);
	// GET THE USER HERE

	React.useEffect(() => {
		if (queryUserResult?.data?.getAuthenticatedUser) {
			setUser(queryUserResult.data.getAuthenticatedUser);
		} else {
			setUser(null);
		}
	}, [queryUserResult.data]);

	React.useEffect(() => {
		if (loginRes?.data?.login?.success === true) {
			localStorage.setItem("token", loginRes.data.login.token);
			// enqueueSnackbar("Logged in!", {
			// 	variant: "success",
			// });
			history.push("/");
		} else if (loginRes?.data?.login?.success === false) {
			enqueueSnackbar("Incorrect name and or password!", {
				variant: "error",
			});
		}
		queryUserResult.refetch();
	}, [loginRes.data, logoutRes.data]);

	React.useEffect(() => {
		if (registerMutRes?.data?.register?.success === true) {
			localStorage.setItem("token", registerMutRes.data.register.token);
			// enqueueSnackbar("Logged in!", {
			// 	variant: "success",
			// });
			history.push("/");
		} else if (registerMutRes?.data?.register?.success === false) {
			enqueueSnackbar("An error occurred", {
				variant: "error",
			});
		}
		queryUserResult.refetch();
	}, [registerMutRes.data, logoutRes.data]);

	/**
	 * @param {string} name
	 * @param {string} password
	 */
	const login = (name, password) => {
		loginMut({
			variables: {
				name,
				password,
			},
		});
	};

	const changePassword = (password) => {
		changePassowrdMut({
			variables: {
				password,
			},
		});
		enqueueSnackbar("Password changed!", { variant: "success" });
		history.push("/");
	};

	const register = (name, password) => {
		registerMut({
			variables: {
				name,
				password,
				admin: false,
			},
		});
	};

	return (
		<AuthCtx.Provider
			value={{ user, login, logout, register, changePassword }}
		>
			{children}
		</AuthCtx.Provider>
	);
}

export function useAuth() {
	const ctx = React.useContext(AuthCtx);

	if (!ctx) {
		throw new Error(
			"useAuth() can only be used in an authentication context!"
		);
	}
	return ctx;
}
