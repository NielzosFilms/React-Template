import { useState, useEffect, cloneElement } from "react";
import { useQuery } from "@apollo/client";
import { CircularProgress, Box, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";

export function QueryProvider({
	query,
	variables,
	returnName = null,
	children,
	...props
}) {
	const queryResult = useQuery(query, {
		variables,
		fetchPolicy: props.fetchPolicy || "cache-first",
	});
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		if (queryResult.error) {
			enqueueSnackbar(queryResult.error.message, { variant: "error" });
		}
	}, [queryResult.loading]);

	if (queryResult.loading)
		return (
			<Box display="flex" justifyContent="center">
				<CircularProgress color="primary" />
			</Box>
		);
	if (queryResult.error)
		return (
			<>
				<Typography variant="h2">Error :(</Typography>
				<Typography>{queryResult.error.message}</Typography>
			</>
		);

	if (!queryResult.data) return <Typography variant="h2">No data</Typography>;

	return (
		<>
			{cloneElement(children, {
				[returnName ? returnName : Object.keys(queryResult.data)[0]]:
					queryResult,
				...props,
			})}
		</>
	);
}
