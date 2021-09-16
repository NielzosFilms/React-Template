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
	ChevronLeft,
	Person,
	ExitToApp,
	Home,
	Explore,
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
		justifyContent: "flex-end",
		padding: theme.spacing(1),
	},
}));

export function DrawerMenu({ open, setOpen }) {
	const classes = useStyles();
	const history = useHistory();
	const authCtx = useAuth();

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Drawer
			variant="temporary"
			anchor="left"
			open={open}
			onClose={() => setOpen(false)}
			onClick={handleClose}
		>
			<div className={classes.drawerHeader}>
				<IconButton onClick={handleClose}>
					<ChevronLeft />
				</IconButton>
			</div>
			<Divider />
			<List className={classes.menu}>
				<ListItem button onClick={() => history.push("/")}>
					<ListItemIcon>
						<Home />
					</ListItemIcon>
					<ListItemText>Home</ListItemText>
				</ListItem>
				<ListItem
					button
					onClick={() => history.push("/crud-table-lab")}
				>
					<ListItemIcon>
						<Explore />
					</ListItemIcon>
					<ListItemText>Crud Table Lab</ListItemText>
				</ListItem>
			</List>
			<Divider />
			<List>
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
						<ExitToApp />
					</ListItemIcon>
					<ListItemText>Logout</ListItemText>
				</ListItem>
			</List>
		</Drawer>
	);
}
