const express = require('express');
const router = express.Router();
const slugify = require('slugify');

const Category = require('./Category');

const { adminAuth } = require('../middlewares/adminAuth');

router.get('/', adminAuth, (req, res) => {
	res.send('Categories Router.');
});

// save
router.post('/save', adminAuth, (req, res) => {
	const data = { title: req.body.title, };

	if (data.title) {
		Category.create(
			{
				title: data.title,
				slug: slugify(data.title, {
					replacement: '-',
					lower: true,
					trim: true,
					remove: /[*+~.()'"!:@]/g
				}),
			}
		)
		.then(() => { res.redirect('/admin/categories') });
	} else {
		res.redirect('/admin/categories/new');
	}

});

// edit
router.post('/update', adminAuth, (req, res) => {
	const data = {
		id: req.body.id,
		title: req.body.title,
	};

	if ( data.id && data.title ) {
		Category.update(
			{
				title: data.title,
				slug: slugify(data.title, {
					replacement: '-',
					lower: true,
					trim: true,
					remove: /[*+~.()'"!:@]/g
				}),
			}, { where: {id: data.id, }, },)
		.then( () => {
			res.redirect('/admin/categories');
		}).catch( (err) => {
			console.log('error to edit category. ', err);
			res.redirect('/admin/categories');
		});
	} else {
		res.redirect('/admin/categories');
	}
});

// delete
router.post('/delete', adminAuth, (req, res) => {
	const data = {
		id: req.body.id,
	};

	if (data.id && !isNaN(data.id)) {
		Category.destroy({ where: { id: data.id, }, })
		.then( () => {
			res.redirect('/admin/categories')
		});
	} else {
		res.redirect('/admin/categories');
	}
});

module.exports = router;
