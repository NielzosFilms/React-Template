"use strict";
const { Model } = require("sequelize");
const passwordHash = require("password-hash");
module.exports = (sequelize, DataTypes) => {
	class Store extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.Country, {
				foreignKey: "country_id",
			});

			this.hasMany(models.Order, {
				foreignKey: "store_id",
			});

			this.belongsToMany(models.Product, {
				through: "Stocks",
				foreignKey: "store_id",
			});
		}
	}
	Store.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			street: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			housenumber: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			postalCode: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			country_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			paranoid: true,
			modelName: "Store",
		}
	);
	return Store;
};
