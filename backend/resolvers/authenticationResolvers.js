const passwordHash = require("password-hash");
const crypto = require("crypto");

const resolvers = {
	Query: {
		isAuthenticated: async (root, args, { loggedIn }) => {
			return loggedIn;
		},
		getAuthenticatedUser: async (root, args, { loggedIn, user }) => {
			if (!loggedIn) return null;
			return user;
		},
		userFindOne: async (root, { id }, { loggedIn, models }) => {
			if (!loggedIn) return null;
			return await models.User.findOne({
				where: {
					id,
				},
			});
		},
	},
	Mutation: {
		login: async (root, { username, password }, { models, loggedIn }) => {
			if (loggedIn) return { success: false, token: null };
			const user = await models.User.findOne({
				where: {
					name: username,
				},
			});

			if (user) {
				if (passwordHash.verify(password, user.password)) {
					const token = crypto.randomBytes(64).toString("hex");
					const session = await models.Session.create({
						token,
						user_id: Number(user.id),
					});
					session.save();
					return { success: true, token };
				}
			}
			return { success: false, token: null };
		},
		logout: async (root, args, { models, loggedIn, user, token }) => {
			if (!loggedIn || !user || !token) return false;
			await models.Session.destroy({
				where: {
					token,
				},
			});
			return true;
		},
		register: async (
			root,
			{ username, password },
			{ models, loggedIn }
		) => {
			if (loggedIn) return { success: false, token: null };
			const user = await models.User.create({
				name: username,
				password,
			});

			if (user) {
				const token = crypto.randomBytes(64).toString("hex");
				const session = await models.Session.create({
					token,
					user_id: Number(user.id),
				});
				session.save();
				return { success: true, token };
			}
			return { success: false, token: null };
		},
		changePassword: async (
			root,
			{ password },
			{ models, loggedIn, user }
		) => {
			if (!loggedIn) return false;
			user.update({
				password,
			});
			user.save();
			return true;
		},
	},
};

module.exports = resolvers;
