const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const { ApolloServer, AuthenticationError } = require("apollo-server-express");
if (!fs.existsSync(path.join(__dirname, "generatedSchema.js")))
	throw Error(
		"You need to generate the GraphQL schema first, run `yarn generate:schema` to do so."
	);
const typeDefs = require(path.join(__dirname, "generatedSchema"));
const resolvers = require(path.join(__dirname, "resolvers"));

const sequelize = require(path.join(__dirname, "../models/index"));

const corsOptions = {
	origin: `http://${process.env.HOST || "localhost"}:${
		process.env.SERVER_PORT || "8080"
	}`,
	credentials: true,
};

async function startBackend() {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req }) => {
			if (process.env.DISABLE_AUTHENTICATION === "1") {
				return {
					models: sequelize,
					loggedIn: true,
					user: {
						id: 1,
						name: "admin",
					},
					admin: true,
					token: null,
				};
			}
			const token = req.headers.authorization || "";
			const session = await sequelize.Session.findOne({
				where: {
					token: token,
				},
			});

			if (session) {
				const user = await sequelize.User.findOne({
					where: {
						id: session.user_id,
					},
				});
				if (user) {
					return {
						models: sequelize,
						loggedIn: true,
						user,
						admin: user.admin,
						token,
					};
				}
			}
			return {
				models: sequelize,
				loggedIn: false,
				user: null,
				admin: false,
				token: null,
			};
		},
	});

	console.log(process.env.NODE_ENV);

	await server.start();

	server.applyMiddleware({
		app,
		path: "/graphql",
		...(process.env.NODE_ENV === "production" && { cors: corsOptions }),
	});

	app.use(express.static(path.join(__dirname, "../build")));

	app.use(function (req, res) {
		res.sendFile(path.join(__dirname, "../build", "index.html"));
	});

	app.listen(process.env.SERVER_PORT || 8080);
	console.log(`Listening on port ${process.env.SERVER_PORT || 8080}`);
}

startBackend();
