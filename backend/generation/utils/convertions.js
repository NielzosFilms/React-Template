const graphQLConversions = {
	INTEGER: "Int",
	STRING: "String",
	VARCHAR: "String",
	DATETIME: "Date",
	TINYINT: "Boolean",
};

/**
 *
 * @param {string} dataType from sequelize
 * @returns
 */
function convertDataTypeToGraphql(dataType) {
	return graphQLConversions[
		Object.keys(graphQLConversions).find((key) =>
			dataType.toString().includes(key)
		)
	];
}

module.exports = {
	graphQLConversions,
	convertDataTypeToGraphql,
};
