const path = require("path");
const dotenv = require("dotenv");
const pluralize = require("pluralize");
dotenv.config();

const sequelize = require(path.join(__dirname, "../../models/index"));
const models = sequelize.sequelize.models;
const { convertDataTypeToGraphql, LCFirst } = require("./utils");
const fs = require("fs");

function generateModelQueries() {
	console.log("🚧 Generating model query resolvers...");
	let code = "";
	Object.keys(models).forEach((modelName) => {
		if (modelName === "User") {
			code += `${LCFirst(
				modelName
			)}FindOne: async (root, { id }, { loggedIn, models, admin }) => {
				if (!loggedIn || !admin) return null;
				return await models.${modelName}.findOne({
					where: {
						id,
					},
				});
			},
			`;
			code += `${LCFirst(
				modelName
			)}FindAll: async (root, args, { loggedIn, models, admin }) => {
				if (!loggedIn || !admin) return null;
				return await models.${modelName}.findAll();
			},
			`;
		} else {
			code += `${LCFirst(
				modelName
			)}FindOne: async (root, { id }, { loggedIn, models }) => {
				if (!loggedIn) return null;
				return await models.${modelName}.findOne({
					where: {
						id,
					},
				});
			},
			`;
			code += `${LCFirst(
				modelName
			)}FindAll: async (root, args, { loggedIn, models }) => {
				if (!loggedIn) return null;
				return await models.${modelName}.findAll();
			},
			`;
		}
	});
	return code;
}

function generateModelMutations() {
	console.log("🚧 Generating model mutation resolvers...");
	let code = "";
	Object.keys(models).forEach((modelName) => {
		if (modelName === "User") {
			code += `
			${LCFirst(
				modelName
			)}FindOne: async (root, { id }, { loggedIn, models, admin }) => {
				if (!loggedIn || !admin) return null;
				return await models.${modelName}.findOne({
					where: {
						id,
					},
				});
			},
			`;
			code += `
			${LCFirst(
				modelName
			)}FindAll: async (root, args, { loggedIn, models, admin }) => {
				if (!loggedIn || !admin) return null;
				return await models.${modelName}.findAll();
			},
			`;
		} else {
			code += `
			${LCFirst(modelName)}Create: async (root, { record }, { loggedIn, models }) => {
				if (!loggedIn) return null;
				return await models.${modelName}.Create({
					...record,
				});
			},
			`;
			code += `
			${LCFirst(modelName)}Update: async (root, { record }, { loggedIn, models }) => {
				if (!loggedIn) return null;
				return await models.${modelName}.Update({
					...record,
				}, {
					where: {
						id: record.id
					}
				});
			},
			`;
			code += `
			${LCFirst(modelName)}Delete: async (root, { record }, { loggedIn, models }) => {
				if (!loggedIn) return null;
				return await models.${modelName}.Destroy({
					where: {
						id: record.id
					},
				});
			},
			`;
		}
	});
	return code;
}

function generateModelAssociationQueries() {
	console.log("🚧 Generating model query association resolvers...");
	let code = "";
	Object.keys(models).forEach((modelName) => {
		const assoc = models[modelName].associations;
		if (Object.keys(assoc).length > 0) {
			code += `${pluralize.singular(modelName)}: {`;

			Object.keys(assoc).forEach((assocName) => {
				if (pluralize.isPlural(assocName)) {
					code += `
					${LCFirst(assocName)}: async (root, args, extra) => {
						return await root.get${assocName}();
					},
					`;
				} else {
					code += `
					${LCFirst(pluralize.singular(assocName))}: async (root, args, extra) => {
						return await root.get${pluralize.singular(assocName)}();
					},
					`;
				}
			});

			code += `},
			`;
		}
	});
	return code;
}

fs.writeFile(
	path.join(__dirname, "../resolvers/generatedModelResolvers.js"),
	`
const resolvers = {
	Query: {
		${generateModelQueries()}
	},
	Mutation: {
		${generateModelMutations()}
	},
	${generateModelAssociationQueries()}
};

module.exports = resolvers;
`,
	function (err) {
		if (err) return console.log(err);
		console.log("✅ Resolvers generated!");
	}
);
