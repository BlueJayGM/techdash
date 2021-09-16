const Sequelize = require('sequelize');
const { connection } = require('../database/connection');

const Category = require('../categories/Category');

const Article = connection.define('articles', {
	title: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	slug: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	body: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
});

try {
	Category.hasMany(Article); // Uma categoria possui muitos artigos
	Article.belongsTo(Category); // Um artigo pertence a uma categoria
	console.log('\nLOG-ARTICLE: Relationship between Articles and Categories created successful.\n');
} catch(err) {
	console.log('LOG-ARTICLE: Error to create relationship.\n', err);
}

Article.sync({force: false,}).then(() => {
	console.log('\nTable <Articles> create successful.\n')
});

module.exports = Article;
