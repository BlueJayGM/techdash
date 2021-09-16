const express = require('express');
const router = express.Router();

const Category = require('../categories/Category');
const Article = require('../articles/Articles');
const User = require('../users/User');

const { adminAuth, adminAuthRoot } = require('../middlewares/adminAuth');

router.get('/', adminAuth, (req, res) => {
	res.render('admin/index.ejs');
});


// categories
router.get('/categories', adminAuth, (req, res) => {
	Category.findAll({raw: true,})
	.then( categories => {
		res.render('admin/categories/index', { categories });
	} );
});

router.get('/categories/edit/:id', adminAuth, (req, res) => {
	const id = req.params.id;

	if (isNaN(id)) {
		res.redirect('/admin/categories');
	}

	Category.findByPk(id)
	.then( (category) => {
		if (category) {
			res.render('admin/categories/edit.ejs', { category });
		} else {
			res.redirect('/admin/categories');
		}
	} ).catch( (err) => {
		res.redirect('/admin/categories');
	});
});

router.get('/categories/new', adminAuth, (req, res) => {
	res.render('admin/categories/new');
});

// articles

router.get('/articles', adminAuth, (req, res) => {
	Article.findAll({raw: true, include: [{model: Category}],})
	.then( articles => {
		console.log(articles);
		res.render('admin/articles/index', { articles });
	} );
});

router.get('/articles/new', adminAuth, (req, res) => {

	Category.findAll().then( (categories) => {
		res.render('admin/articles/new', {categories});
	}).catch( (err) => {
		res.redirect('admin/articles');
	});
});

router.get('/articles/edit/:id', adminAuth, (req, res) => {
	let id = req.params.id;

	Article.findOne( { row: true,  where: { id: id, }, }).then((article) => {
		Category.findAll({row: true, }).then( (categories) => {
			res.render('admin/articles/edit', { article, categories });
		}).catch( (err) => {
			res.redirect('/admin/articles');
		});
	}).catch((err) => {
		res.redirect('/admin/articles');
	});

});

// users

router.get('/users', adminAuth, (req, res) => {

	User.findAll({ raw: true, }).then((users) => {
		res.render('admin/users/index', { users });
	});

});

router.get('/users/register', adminAuthRoot, (req, res) => {
	res.render('admin/users/register');
});



module.exports = router;
