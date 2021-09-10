import {
	Table,
	TableContainer,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	IconButton,
} from "@material-ui/core";

import { Launch, Delete, Edit } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useRouteMatch } from "react-router";

const useStyles = makeStyles((theme) => ({
	row: {
		cursor: "pointer",
	},
}));

/**
 * @param {string} str
 * @returns
 */
function UCFirst(str) {
	return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function CrudTable({ data, columns }) {
	const classes = useStyles();
	const history = useHistory();
	const { path } = useRouteMatch();

	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						{columns.map((column) => (
							<TableCell>{UCFirst(column)}</TableCell>
						))}
						<TableCell align="right">Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((entity) => {
						return (
							<TableRow
								hover
								className={classes.row}
								onClick={(event) => {
									event.stopPropagation();
									history.push(`${path}/show/${entity.id}`);
								}}
							>
								{Object.keys(entity).map((property) => {
									if (columns.includes(property)) {
										return (
											<TableCell>
												{entity[property]}
											</TableCell>
										);
									}
									return <></>;
								})}
								<TableCell align="right">
									<IconButton
										size="small"
										color="secondary"
										onClick={(event) => {
											event.stopPropagation();
											history.push(
												`${path}/show/${entity.id}`
											);
										}}
									>
										<Launch />
									</IconButton>
									<IconButton
										size="small"
										color="secondary"
										onClick={(event) => {
											event.stopPropagation();
											history.push(
												`${path}/edit/${entity.id}`
											);
										}}
									>
										<Edit />
									</IconButton>
									<IconButton
										size="small"
										color="secondary"
										onClick={(event) => {
											event.stopPropagation();
										}}
									>
										<Delete />
									</IconButton>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
