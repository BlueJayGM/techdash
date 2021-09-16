function adminAuth(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/users/login');
	}
}

function adminAuthRoot(req, res, next) {
	const user = req.session.user;
	if (user && user.email == "damato578@gmail.com") {
		next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = { adminAuth, adminAuthRoot };
