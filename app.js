const express = require('express');
const app = express();
const database = require('./database/connection');
const session = require('express-session');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const userController = require('./users/UserController');

const Category = require('./categories/Category');
const Article = require('./articles/Articles');
const User = require('./users/User');

const adminRouters = require('./admin/AdminRouters');

// Config Template EJS
app.set('view engine', 'ejs');

// Static
app.use(express.static('public'));

// Body Parser
app.use(express.urlencoded({extended: false}))
app.use(express.json());

// Database
database.connect();

// Session
app.use(session(
	{
		secret: 'anywherex32y',
		cookie: {
			maxAge: 30000,
		},
	}
));

// Routes
app.get('/', (req, res) => {
	Article.findAll({
		row: true,
		order: [ ["id", 'DESC'] ],
		limit: 4,
	}).then( (articles) => {
		Category.findAll().then(categories => {
			res.render('index', {articles, categories});
		});
	});
});

app.use('/admin', adminRouters);
app.use('/categories', categoriesController);
app.use('/articles', articlesController);
app.use('/users', userController);

app.get('/:slug', (req, res) => {
	let slug = req.params.slug;

	Article.findOne({ where: {
		slug: slug,
	}, }).then( (article) => {
		if (article) {
			Category.findAll().then(categories => {
				res.render("article", { article, categories });
			});
		} else {
			res.redirect('/');
		}
	}).catch( (err) => {
		res.redirect('/');
	});
});

app.get('/category/:slug', (req, res) => {
	let slug = req.params.slug;

	Category.findOne({ where: {slug: slug, }, include: [{model: Article}] }).then((category) => {
		if (category) {
			Category.findAll().then( categories => {
				res.render('index', { articles: category.articles, categories});
			});
		} else {
			res.redirect('/');
		}
	}).catch((err) => {
		res.redirect('/');
	});
});

const port = process.env.PORT || 4040;
app.listen(port, () => console.log('Listening on port ' + port));
