import React from "react";
import {
	Drawer,
	IconButton,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from "@material-ui/core";
import {
	ChevronRight,
	PersonAdd,
	ExitToApp as LogoutIcon,
	VpnKey as LoginIcon,
	Person,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../providers";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	menu: {
		height: "100%",
	},
	drawerHeader: {
		display: "flex",
		justifyContent: "flex-start",
		padding: theme.spacing(1),
	},
}));

export function UserMenu({ open, setOpen }) {
	const classes = useStyles();
	const history = useHistory();
	const authCtx = useAuth();

	const handleClose = () => {
		setOpen(false);
	};

	const getConditionalMenuButtons = () => {
		if (authCtx.user) {
			return (
				<>
					<ListItem
						button
						onClick={() => history.push("/change-password")}
					>
						<ListItemIcon>
							<Person />
						</ListItemIcon>
						<ListItemText>Change password</ListItemText>
					</ListItem>
					<ListItem button onClick={() => authCtx.logout()}>
						<ListItemIcon>
							<LogoutIcon />
						</ListItemIcon>
						<ListItemText>Log uit</ListItemText>
					</ListItem>
				</>
			);
		} else {
			return (
				<>
					<ListItem button onClick={() => history.push("/login")}>
						<ListItemIcon>
							<LoginIcon />
						</ListItemIcon>
						<ListItemText>Inloggen</ListItemText>
					</ListItem>
					<ListItem button onClick={() => history.push("/register")}>
						<ListItemIcon>
							<PersonAdd />
						</ListItemIcon>
						<ListItemText>Registreren</ListItemText>
					</ListItem>
				</>
			);
		}
	};

	return (
		<Drawer
			variant="temporary"
			anchor="right"
			open={open}
			onClose={() => setOpen(false)}
			onClick={handleClose}
		>
			<div className={classes.drawerHeader}>
				<IconButton onClick={handleClose}>
					<ChevronRight />
				</IconButton>
			</div>
			<Divider />
			<List className={classes.menu}>{getConditionalMenuButtons()}</List>
		</Drawer>
	);
}
