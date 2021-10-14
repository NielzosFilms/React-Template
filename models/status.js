"use strict";
const { Model } = require("sequelize");
const passwordHash = require("password-hash");
module.exports = (sequelize, DataTypes) => {
	class Status extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.Order, {
				foreignKey: "status_id",
			});
		}
	}
	Status.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			timestamps: false,
			modelName: "Status",
		}
	);
	return Status;
};
