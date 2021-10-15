"use strict";

const path = require("path");
const pluralize = require("pluralize");

const { DATE, NOW } = require("sequelize");
const passwordHash = require("password-hash");

const sequelize = require(path.join(__dirname, "../models/index"));
const models = sequelize.sequelize.models;

const modelOrder = ["User", "Session"];

module.exports = {
	up: async (queryInterface, Sequelize) => {
		modelOrder.forEach(async (modelName) => {
			console.log(`==== Migrating model: "${modelName}"`);
			const generatedModel = {};
			Object.keys(models[modelName].rawAttributes).forEach(
				(attributeName) => {
					const attribute =
						models[modelName].rawAttributes[attributeName];
					if (
						attributeName === "createdAt" ||
						attributeName === "updatedAt" ||
						attributeName === "deletedAt"
					) {
						generatedModel[attributeName] = {
							type: Sequelize.DATE,
							allowNull: attributeName === "deletedAt",
							defaultValue: new Date(),
						};
						return;
					}
					generatedModel[attributeName] = {
						...(attribute?.type?.key
							? {
									type: Sequelize[attribute.type.key],
							  }
							: { type: Sequelize.STRING }),
						...(attribute.private !== null && {
							private: attribute.private,
						}),
						...(attribute.set !== null && {
							set: attribute.set,
						}),
						...(attribute.get !== null && {
							get: attribute.get,
						}),
						...(attribute.allowNull !== null && {
							allowNull: attribute.allowNull,
						}),
						...(attribute.defaultValue !== null && {
							defaultValue: attribute.defaultValue,
						}),
						...(attribute.autoIncrement !== null && {
							autoIncrement: attribute.autoIncrement,
						}),
						...(attribute.primaryKey !== null && {
							primaryKey: attribute.primaryKey,
						}),
						...(attribute.unique !== null && {
							unique: attribute.unique,
						}),
						...(attribute.references && {
							references: {
								...(attribute.references.model && {
									model: attribute.references.model,
								}),
								...(attribute.references.key && {
									key: attribute.references.key,
								}),
							},
						}),
					};
				}
			);
			await queryInterface.createTable(
				pluralize.plural(modelName),
				generatedModel
			);
		});
	},
	down: async (queryInterface, Sequelize) => {
		Object.keys(models).forEach(async (modelName) => {
			await queryInterface.dropTable(pluralize.plural(modelName));
		});
	},
};
