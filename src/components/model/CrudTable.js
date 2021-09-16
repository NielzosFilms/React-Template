import {
	Table,
	TableContainer,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useRouteMatch } from "react-router";
import { ActionsMenu } from ".";

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

export function CrudTable({
	data,
	columns,
	showActions = true,
	showActionsHeader = false,
	deleteRecord = () => null,
}) {
	const classes = useStyles();
	const history = useHistory();
	const { path } = useRouteMatch();

	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						{columns.map((column, idx) => (
							<TableCell key={idx}>
								<b>{UCFirst(column)}</b>
							</TableCell>
						))}
						{showActions && (
							<TableCell align="right">
								{showActionsHeader && <b>Actions</b>}
							</TableCell>
						)}
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((entity) => {
						return (
							<TableRow
								key={entity.id}
								hover
								className={classes.row}
							>
								{columns.map((column, idx) => {
									if (Object.keys(entity).includes(column)) {
										return (
											<TableCell
												key={`${entity.id}_${idx}`}
												onClick={() => {
													history.push(
														`${path}/show/${entity.id}`
													);
												}}
											>
												{entity[column]}
											</TableCell>
										);
									}
									return <></>;
								})}
								{showActions && (
									<TableCell align="right">
										<ActionsMenu
											id={entity.id}
											size="small"
											deleteRecord={deleteRecord}
										/>
									</TableCell>
								)}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
