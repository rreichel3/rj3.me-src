var React = require('react');
var Home = React.createClass({
	render: function() {
		return (
			<div>
				<h1>RJ3.me</h1>
				<ul className="header">
					<li>Home</li>
					<li>Stuff</li>
					<li>Contact</li>
				</ul>
				<div className="content"></div>
			</div>
		)
	}
});

module.exports = Home;