const path = require("path");
const dotenv = require("dotenv");
const pluralize = require("pluralize");
dotenv.config();

const sequelize = require(path.join(__dirname, "../../models/index"));
const models = sequelize.sequelize.models;
const { convertDataTypeToGraphql, LCFirst } = require("./utils");
const fs = require("fs");

function generateModelTypes() {
	console.log("🚧 Generating model types...");
	let graphql = "";
	Object.keys(models).forEach((modelName) => {
		if (modelName === "Session") return;
		let graphqlType = `type ${modelName} {\n`;
		const model = models[modelName];
		Object.keys(model.rawAttributes).forEach((propName) => {
			if (propName === "deletedAt") return;
			const attribute = model.rawAttributes[propName];
			if (attribute.private === true) return;
			let graphqlProp = `    `;
			if (attribute.references) {
				const assoModel = Object.keys(
					attribute.Model.associations
				).find(
					(assoModel) =>
						attribute.Model.associations[assoModel].options
							.foreignKey === propName
				);
				if (!assoModel) {
					const referenceModel = attribute.references.model;
					if (pluralize.isPlural(referenceModel)) {
						graphqlProp += `${LCFirst(
							referenceModel
						)}: [${pluralize.singular(referenceModel)}]`;
					} else {
						graphqlProp += `${LCFirst(
							referenceModel
						)}: ${referenceModel}`;
					}
				}
			} else {
				graphqlProp += `${propName}: ${convertDataTypeToGraphql(
					attribute.type
				)}`;
			}
			if (attribute.allowNull === false) {
				// graphqlProp += "!";
				// console.log("🔶 Skipping the allowNull character '!'");
			}
			if (graphqlProp !== "    ") graphqlType += `${graphqlProp}\n`;
		});
		Object.keys(model.associations).forEach((key) => {
			if (pluralize.singular(key) === "Session") return;
			let graphqlProp = `    `;
			if (pluralize.isPlural(key)) {
				graphqlProp += `${LCFirst(key)}: [${pluralize.singular(key)}]`;
			} else {
				graphqlProp += `${LCFirst(
					pluralize.singular(key)
				)}: ${pluralize.singular(key)}`;
			}
			graphqlType += `${graphqlProp}\n`;
		});
		graphqlType += `}\n`;
		graphql += graphqlType + "\n";
	});
	return graphql;
}

function generateModelInputTypes() {
	console.log("🚧 Generating input yypes...");
	let graphql = "";
	Object.keys(models).forEach((modelName) => {
		if (modelName === "Session") return;
		let graphqlInput = `input ${modelName}Input {\n`;
		const model = models[modelName];
		Object.keys(model.rawAttributes).forEach((propName) => {
			if (
				propName === "deletedAt" ||
				propName === "createdAt" ||
				propName === "updatedAt"
			) {
				return;
			}

			const attribute = model.rawAttributes[propName];
			if (attribute.private === true) return;
			let graphqlProp = `    `;
			if (attribute.references) {
				const assoModel = Object.keys(
					attribute.Model.associations
				).find(
					(assoModel) =>
						attribute.Model.associations[assoModel].options
							.foreignKey === propName
				);
				if (!assoModel) {
					const referenceModel = attribute.references.model;
					if (pluralize.isPlural(referenceModel)) {
						graphqlProp += `${LCFirst(
							referenceModel
						)}: [${pluralize.singular(referenceModel)}Input]`;
					} else {
						graphqlProp += `${LCFirst(
							referenceModel
						)}: ${referenceModel}Input`;
					}
				}
			} else {
				graphqlProp += `${propName}: ${convertDataTypeToGraphql(
					attribute.type
				)}`;
			}
			if (attribute.allowNull === false) {
				// graphqlProp += "!";
				// console.log("🔶 Skipping the allowNull character '!'");
			}
			if (graphqlProp !== "    ") graphqlInput += `${graphqlProp}\n`;
		});
		Object.keys(model.associations).forEach((key) => {
			if (pluralize.singular(key) === "Session") return;
			let graphqlProp = `    `;
			if (pluralize.isPlural(key)) {
				graphqlProp += `${LCFirst(key)}: [${pluralize.singular(
					key
				)}Input]`;
			} else {
				graphqlProp += `${LCFirst(
					pluralize.singular(key)
				)}: ${pluralize.singular(key)}Input`;
			}
			graphqlInput += `${graphqlProp}\n`;
		});
		graphqlInput += `}\n`;
		graphql += graphqlInput + "\n";
	});
	return graphql;
}

function generateModelQueries() {
	console.log("🚧 Generating model queries...");
	let graphql = "";
	Object.keys(models).forEach((modelName) => {
		if (modelName === "Session") return;
		graphql += `    ${LCFirst(modelName)}FindOne(id: Int): ${modelName}\n`;
		graphql += `    ${LCFirst(modelName)}FindAll: [${modelName}]\n`;
	});
	return graphql;
}

function generateModelMutations() {
	console.log("🚧 Generating model mutations...");
	let graphql = "";
	Object.keys(models).forEach((modelName) => {
		if (modelName === "Session") return;
		graphql += `    ${LCFirst(
			modelName
		)}Create(record: ${modelName}Input!): ${modelName}\n`;
		graphql += `    ${LCFirst(
			modelName
		)}Update(record: ${modelName}Input!): ${modelName}\n`;
		graphql += `    ${LCFirst(modelName)}Delete(id: Int!): Boolean\n`;
	});
	return graphql;
}

const schema = `
scalar Date

${generateModelTypes()}
${generateModelInputTypes()}
type LoginPayload {
    success: Boolean!
    token: String
}

type Query {
    isAuthenticated: Boolean
    getAuthenticatedUser: User

${generateModelQueries()}
}

type Mutation{
    login(username: String!, password: String!): LoginPayload
	register(username: String!, password: String!, admin: Boolean!): LoginPayload
    logout: Boolean
    changePassword(password: String!): Boolean

${generateModelMutations()}
}
`;

fs.writeFile(
	path.join(__dirname, "../generatedSchema.js"),
	`
const { gql } = require("apollo-server-express");

const typeDefs = gql(\`${schema}\`);

module.exports = typeDefs;
`,
	function (err) {
		if (err) return console.log(err);
		console.log("✅ Schema generated!");
	}
);
