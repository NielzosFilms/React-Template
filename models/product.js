"use strict";
const { Model } = require("sequelize");
const passwordHash = require("password-hash");
module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsToMany(models.User, {
				through: "ShoppingCarts",
				foreignKey: "product_id",
			});

			this.belongsToMany(models.Order, {
				through: "OrderedProducts",
				foreignKey: "product_id",
			});

			this.belongsToMany(models.Store, {
				through: "Stocks",
				foreignKey: "product_id",
			});

			this.belongsTo(models.Category, {
				foreignKey: "category_id",
			});
		}
	}
	Product.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			price: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			category_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			image: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			sequelize,
			paranoid: true,
			modelName: "Product",
		}
	);
	return Product;
};
