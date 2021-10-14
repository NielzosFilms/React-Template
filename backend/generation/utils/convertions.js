const graphQLConversions = {
	INTEGER: "Int",
	STRING: "String",
	VARCHAR: "String",
	DATETIME: "Date",
	TINYINT: "Boolean",
	BIGINT: "Int",
	TEXT: "String",
	FLOAT: "Float",
};

/**
 *
 * @param {string} dataType from sequelize
 * @returns
 */
function convertDataTypeToGraphql(dataType) {
	const foundConvertion =
		graphQLConversions[
			Object.keys(graphQLConversions).find((key) =>
				dataType.toString().includes(key)
			)
		];

	if (foundConvertion) {
		return foundConvertion;
	} else {
		throw Error(
			`The given dataType was not found in the convertions '${dataType}'`
		);
	}
}

module.exports = {
	graphQLConversions,
	convertDataTypeToGraphql,
};
