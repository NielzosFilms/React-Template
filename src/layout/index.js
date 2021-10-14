import { useState } from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TopBar } from "./TopBar";
import { useAuth } from "../providers";
import { useHistory } from "react-router-dom";
import { DrawerMenu } from "./DrawerMenu";
import { UserMenu } from "./UserMenu";

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
	const [open, setOpen] = useState(false);
	const [userOpen, setUserOpen] = useState(false);

	return (
		<>
			<TopBar
				sideBarOpen={open}
				setSideBarOpen={setOpen}
				userOpen={userOpen}
				setUserOpen={setUserOpen}
			/>
			<DrawerMenu open={open} setOpen={setOpen} />
			<UserMenu open={userOpen} setOpen={setUserOpen} />
			<main className={classes.root}>{children}</main>
		</>
	);
}
