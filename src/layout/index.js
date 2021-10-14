import React from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TopBar } from "./TopBar";
import { useAuth } from "../providers";
import { useHistory } from "react-router-dom";
import { DrawerMenu } from "./DrawerMenu";

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(4),
		paddingBottom: theme.spacing(20),
	},
	menu: {
		height: "100%",
	},
}));

export function Layout({ children }) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	return (
		<>
			<TopBar sideBarOpen={open} setSideBarOpen={setOpen} />
			<DrawerMenu open={open} setOpen={setOpen} />
			<main className={classes.root}>{children}</main>
		</>
	);
}
