var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;
var App 		= require('./components/App.js');
var About 		= require('./components/About.js');
var NCSU  		= require('./components/Ncsu.js');
var Photography = require('./components/Photography.js');
var Blog 		= require('./components/Blog.js');
ReactDOM.render(
	<ReactRouter.Router history={browserHistory}>
		<ReactRouter.Route path="/" component={App}>
			<IndexRoute component={About}/>
			<ReactRouter.Route path="about" component={About}/>
			<ReactRouter.Route path="ncsu" component={NCSU} />
			<ReactRouter.Route path="photography" component={Photography} />
			<ReactRouter.Route path="blog" component={Blog} />
		</ReactRouter.Route>
	</ReactRouter.Router>, 
	document.getElementById('app')
);