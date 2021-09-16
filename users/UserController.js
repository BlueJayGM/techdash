const express = require('express');
const router = express.Router();

const User = require('./User');
const bcrypt = require('bcryptjs'); // criador de hash

const { adminAuth, adminAuthRoot } = require('../middlewares/adminAuth');

router.get('/', adminAuth, (req, res) => {
	res.send('User');
});

// create
router.post('/register', adminAuthRoot, (req, res) => {
	const data = {
		name: req.body.name,
		lastname: req.body.lastname,
		email: req.body.email,
		password: req.body.password,
	};

	User.findOne( { where: { email: data.email } } ).then( (user) => {
		if ( user ) {
			res.redirect('/admin/users/register');
		} else {

			let salt = bcrypt.genSaltSync(10); // salt
			let hash = bcrypt.hashSync(data.password, salt); // gera hash a partir de salt

			User.create({
				name: data.name,
				lastName: data.lastname,
				email: data.email,
				password: hash,
			}).then(() => {
				res.redirect('/');
			}).catch( (err) => {
				console.log('Erro ao salvar usuário: ', err);
				res.redirect('/');
			});

		}
	});
});

// delete

router.post('/delete', adminAuthRoot, (req, res) => {

	let id = req.body.id;

	User.destroy({ where: {id} }).then(() => {
		console.log('Usuário deletado com sucesso!');
		res.redirect('/admin/users');
	}).catch((err) => {
		res.redirect('/admin/users');
	});

});

// login

router.get('/login', (req, res) => {
	res.render('admin/users/login');
});

router.post('/authenticate', (req, res) => {

	const data = {
		email: req.body.email,
		password: req.body.password,
	};

	User.findOne( { where: { email: data.email}}).then((user) => {

		if ( user ) {
			let authentication = bcrypt.compareSync(data.password, user.password);

			if (authentication) {
				req.session.user = {
					id: user.id,
					email: user.email,
				};
				res.redirect('/admin');
			} else {
				res.redirect('/users/login');
			}

		} else {
			res.redirect('/users/login');
		}

	});

});

router.get('/logout', (req, res) => {
	req.session.user = undefined;
	res.redirect('/users/login');
});

module.exports = router;
