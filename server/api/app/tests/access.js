var tokens = [
	"14:5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8",
	"14:5baa61e4c9b93f3f0682250b6cf8331b7ee68fd",
	"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8",
	"145baa61e4c9b93f3f0682250b6cf8331b7ee68fd8"
];

var access = require("../bundles/access/access.js");

/*
// parseToken
for (var i = 0; i < tokens.length; i++) {
	var token = access.parseToken(tokens[i]);
	if (token.error)
		console.log(token.message);
	else
		console.log(token);
}; /**/

// login
access.login("degieter". "password"); // false
access.login("d". "password"); // false
access.login("d". "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8"); // false
access.login("degieter". "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8"); // true