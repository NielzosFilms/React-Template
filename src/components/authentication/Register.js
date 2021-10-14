import { useState } from "react";
import { useAuth } from "../../providers";

import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Paper, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";

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

export function Register() {
	const classes = useStyles();
	const authCtx = useAuth();
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const { enqueueSnackbar } = useSnackbar();

	const onSubmit = (e) => {
		e.preventDefault();
		if (name && password) {
			if (password === passwordConfirm) {
				authCtx.register(name, password);
			} else {
				enqueueSnackbar("Passwords do not match!", {
					variant: "error",
				});
			}
		} else {
			enqueueSnackbar("Please fill out all fields!", {
				variant: "warning",
			});
		}
	};

	return (
		<Paper className={classes.wrapper}>
			<form onSubmit={onSubmit}>
				<Typography variant="h2" color="initial">
					Register
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
				<TextField
					className={classes.formElement}
					type="password"
					value={passwordConfirm}
					onChange={(e) => setPasswordConfirm(e.target.value)}
					label="Confirm password"
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
