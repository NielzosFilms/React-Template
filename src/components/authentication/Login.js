import { useState } from "react";
import { useAuth } from "../../providers";

import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	wrapper: {
		width: "50%",
		margin: "auto",
		padding: 20,
	},
	formElement: {
		display: "block",
		margin: 10,
	},
}));

export function Login() {
	const classes = useStyles();
	const authCtx = useAuth();
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");

	const onSubmit = (e) => {
		e.preventDefault();
		authCtx.login(name, password);
	};

	return (
		<Paper className={classes.wrapper}>
			<form onSubmit={onSubmit}>
				<Typography variant="h2" color="initial">
					Login
				</Typography>
				<TextField
					className={classes.formElement}
					value={name}
					onChange={(e) => setName(e.target.value)}
					label="Name"
				/>
				<TextField
					className={classes.formElement}
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					label="Password"
				/>
				<Button
					className={classes.formElement}
					type="submit"
					variant="contained"
					color="primary"
				>
					LOGIN
				</Button>
			</form>
		</Paper>
	);
}
