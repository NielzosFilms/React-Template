const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = require(path.join(__dirname, "../../models/index"));
const models = sequelize.sequelize.models;
const { convertDataTypeToGraphql, LCFirst } = require("./utils");
const fs = require("fs");

function generateModelQueries() {
	let code = "";
	Object.keys(models).forEach((modelName) => {
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
	});
	return code;
}

console.log(generateModelQueries());
