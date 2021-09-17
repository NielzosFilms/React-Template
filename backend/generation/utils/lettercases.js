function LCFirst(str) {
	return str.slice(0, 1).toLowerCase() + str.slice(1);
}

function UCFirst(str) {
	return str.slice(0, 1).toUpperCase() + str.slice(1);
}

module.exports = {
	LCFirst,
	UCFirst,
};
