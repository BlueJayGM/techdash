const express = require('express');
const { default: slugify } = require('slugify');
const router = express.Router();

const { adminAuth } = require('../middlewares/adminAuth');

const Article = require('./Articles');
const Category = require('../categories/Category');

router.get('/', adminAuth, (req, res) => {
	res.send('Articles Router.');
});

// save
router.post('/save', adminAuth, (req, res) => {

	const data = {
		title: req.body.title,
		body: req.body.body,
		category: req.body.category,
	};

	if ( data.title && data.body && data.category ) {
		Article.create({
			title: data.title,
			slug: slugify(data.title.toLowerCase()),
			body: data.body,
			categoryId: data.category,
		}).then(() => {
			res.redirect('/admin/articles');
		}).catch((err) => {
			console.log('Erro ao salvar: ', err);
			res.redirect('/admin/articles');
		});
	} else {
		res.redirect('/admin/articles');
	}

});

// update
router.post('/update', adminAuth, (req, res) => {
	const data = {
		id: req.body.id,
		title: req.body.title,
		body: req.body.body,
		category: req.body.category,
	};

	if ( data.title && data.body && data.category && data.id ) {
		Article.update( {
			title: data.title,
			body: data.body,
			slug: slugify(data.title.toLowerCase()),
			categoryId: data.category,
		}, { where: { id: data.id, }, } )
		.then(() => {
			res.redirect('/admin/articles');
		}).catch((err) => {
			res.redirect('/admin/articles');
		});
	}

});


// delete

router.post('/delete', adminAuth, (req, res) => {
	const data = {
		id: req.body.id,
	};

	if (data.id && !isNaN(data.id)) {
		Article.destroy({ where: { id: data.id, }, })
		.then( () => {
			res.redirect('/admin/articles')
		});
	} else {
		res.redirect('/admin/articles');
	}
});


// pagination

router.get('/page/:value', (req, res) => {
	let page = req.params.value;
	let offset = 0;

	if (!isNaN(page)) {
		offset = (parseInt(page) - 1 ) * 4;
	}

	Article.findAndCountAll(
		{
			limit: 4,
			offset,
			order: [
				['id', 'DESC']
			]
		}
	).then( (articles) => {

		let next = offset + 4 >= articles.count ? false : true;

		if ( offset > articles.count ) {
			res.redirect('/');
		}

		Category.findAll().then( categories => {
			res.render("page", {
				next,
				articles: articles.rows,
				categories,
				page: parseInt(page) });
		}).catch( (err) => {
			res.redirect('/');
		});

	}).catch( (err) => {
		res.redirect('/');
	});
});

module.exports = router;
