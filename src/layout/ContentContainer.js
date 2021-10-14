import React from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: theme.spacing(4),
		paddingBottom: theme.spacing(20),
	},
}));

export function ContentContainer({ children }) {
	const classes = useStyles();
	return <Container className={classes.root}>{children}</Container>;
}
