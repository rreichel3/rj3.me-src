var React = require('react');
var Link  = require('react-router').Link;
var logo  = '../img/rj3Logo.png';
var Header = React.createClass({
	render: function() {
		return (
			<div className="nav">
		      	<h1><img className="logo" src={'http://rj3.me/wp-content/uploads/2016/02/rj3_logo_2-2-2016.png'}/></h1>
		        <ul className="headerBar">
		          <li><Link to="/" activeClassName="active">About</Link></li>
		          <li><Link to="/ncsu" activeClassName="active">NCSU</Link></li>
		          <li><Link to="/photography" activeClassName="active">Photography</Link></li>
		          <li><Link to="/blog" activeClassName="active">Blog</Link></li>
		        </ul>
	    	</div>
			)
	}
});


var App = React.createClass({
	render: function() {
    return (
      <div>
      	<Header />
        <div className="content">
          {this.props.children}
        </div>
      </div>
    )
  }
});

module.exports = App;