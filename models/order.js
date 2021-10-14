"use strict";
const { Model } = require("sequelize");
const passwordHash = require("password-hash");
module.exports = (sequelize, DataTypes) => {
	class Order extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsToMany(models.Product, {
				through: "OrderedProducts",
				foreignKey: "ordernumber",
			});

			this.belongsTo(models.Status, {
				foreignKey: "status_id",
			});

			this.belongsTo(models.User, {
				foreignKey: "user_id",
			});

			this.belongsTo(models.Store, {
				foreignKey: "store_id",
			});
		}
	}
	Order.init(
		{
			ordernumber: {
				type: DataTypes.BIGINT,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			status_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			store_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			paranoid: true,
			modelName: "Order",
		}
	);
	return Order;
};
