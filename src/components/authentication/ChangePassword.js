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

export function ChangePassword() {
	const classes = useStyles();
	const authCtx = useAuth();
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const { enqueueSnackbar } = useSnackbar();

	const onSubmit = (e) => {
		e.preventDefault();
		if (password === passwordConfirm) {
			authCtx.changePassword(password);
		} else {
			enqueueSnackbar("Passwords don't match!", { variant: "error" });
		}
	};

	return (
		<Paper className={classes.wrapper}>
			<form onSubmit={onSubmit}>
				<Typography variant="h2" color="initial">
					Change password
				</Typography>
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
					CHANGE PASSWORD
				</Button>
			</form>
		</Paper>
	);
}
