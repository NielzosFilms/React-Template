const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = require(path.join(__dirname, "../../models/index"));
const models = sequelize.sequelize.models;
const { convertDataTypeToGraphql, LCFirst } = require("./utils");
const fs = require("fs");

function generateModelTypes() {
	let graphql = "";
	Object.keys(models).forEach((modelName) => {
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
				if (assoModel) {
					graphqlProp += `${assoModel.toLowerCase()}: ${assoModel.toString()}`;
				} else {
					graphqlProp += "ASSOCIATION-HERE";
				}
			} else {
				graphqlProp += `${propName}: ${convertDataTypeToGraphql(
					attribute.type
				)}`;
			}
			// if (attribute.allowNull === false) graphqlProp += "!";
			graphqlType += `${graphqlProp}\n`;
		});
		graphqlType += `}\n`;
		graphql += graphqlType + "\n";
	});
	return graphql;
}

function generateModelInputTypes() {
	let graphql = "";
	Object.keys(models).forEach((modelName) => {
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
				if (assoModel) {
					graphqlProp += `${assoModel.toLowerCase()}: ${assoModel.toString()}Input`;
				} else {
					graphqlProp += "ASSOCIATION-HERE";
				}
			} else {
				graphqlProp += `${propName}: ${convertDataTypeToGraphql(
					attribute.type
				)}`;
			}
			// if (attribute.allowNull === false) graphqlProp += "!";
			graphqlInput += `${graphqlProp}\n`;
		});
		graphqlInput += `}\n`;
		graphql += graphqlInput + "\n";
	});
	return graphql;
}

function generateModelQueries() {
	let graphql = "";
	Object.keys(models).forEach((modelName) => {
		graphql += `    ${LCFirst(modelName)}FindOne(id: Int): ${modelName}\n`;
		graphql += `    ${LCFirst(modelName)}FindAll: [${modelName}]\n`;
	});
	return graphql;
}

function generateModelMutations() {
	let graphql = "";
	Object.keys(models).forEach((modelName) => {
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
		console.log("Schema generated!");
	}
);
