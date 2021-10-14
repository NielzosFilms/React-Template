import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Button,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
	Menu as MenuIcon,
	AccountCircle as AccountIcon,
} from "@material-ui/icons";
import { useAuth } from "../providers";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));

export function TopBar({ sideBarOpen, setSideBarOpen, userOpen, setUserOpen }) {
	const classes = useStyles();
	const authCtx = useAuth();

	return (
		<AppBar position="static">
			<Toolbar>
				<IconButton
					className={classes.menuButton}
					edge="start"
					color="inherit"
					aria-label="menu"
					onClick={() => setSideBarOpen(!sideBarOpen)}
				>
					<MenuIcon />
				</IconButton>
				<Typography className={classes.title} variant="h6">
					{process.env.REACT_APP_NAME}
				</Typography>
				<IconButton
					className={classes.menuButton}
					edge="start"
					color="inherit"
					aria-label="account-menu"
					onClick={() => setUserOpen(!userOpen)}
				>
					<AccountIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}
