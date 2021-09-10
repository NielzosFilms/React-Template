"use strict";

const passwordHash = require("password-hash");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert("Users", [
			{
				name: "admin",
				password: passwordHash.generate("asdf"),
				admin: true,
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Sessions", null, {});
		await queryInterface.bulkDelete("Users", null, {});
	},
};
