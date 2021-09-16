import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router";

import { Menu, MenuItem, IconButton } from "@material-ui/core";
import {
	Launch as LaunchIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	MoreHoriz as MoreIcon,
} from "@material-ui/icons";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
	createStyles({
		mute: {
			opacity: 0.5,
			transition: "opacity 0.3s ease",
			"&:hover": {
				opacity: 1,
			},
		},
	})
);

export function ActionsMenuContent({ id, deleteRecord = () => null }) {
	const history = useHistory();
	const { path } = useRouteMatch();

	return (
		<>
			<MenuItem
				onClick={(event) => {
					event.stopPropagation();
					history.push(`${path}/show/${id}`);
				}}
			>
				<LaunchIcon /> View
			</MenuItem>
			<MenuItem
				onClick={(event) => {
					event.stopPropagation();
					history.push(`${path}/edit/${id}`);
				}}
			>
				<EditIcon /> Edit
			</MenuItem>
			<MenuItem
				onClick={(event) => {
					event.stopPropagation();
					deleteRecord();
				}}
			>
				<DeleteIcon /> Delete
			</MenuItem>
		</>
	);
}

export function ActionsMenu({
	id,
	size = "medium",
	deleteRecord = () => null,
}) {
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const classes = useStyles();

	const handleClose = () => {
		setOpen(false);
		setAnchorEl(null);
	};

	const handleOpen = (event) => {
		setAnchorEl(event.currentTarget);
		setOpen(true);
	};

	return (
		<>
			<Menu
				anchorEl={anchorEl}
				keepMounted
				open={open}
				onClose={handleClose}
			>
				<ActionsMenuContent id={id} deleteRecord={deleteRecord} />
			</Menu>
			<IconButton
				className={classes.mute}
				size={size}
				onClick={(event) => {
					event.stopPropagation();
					handleOpen(event);
				}}
			>
				<MoreIcon />
			</IconButton>
		</>
	);
}
