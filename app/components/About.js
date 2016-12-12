var React = require('react');
var RobertPhoto = React.createClass({
	render: function() {
		return (
			<img className="profilePic" src={'http://rj3.me/wp-content/uploads/2016/02/robert_photo.png'} />
			)
	}
});
var About = React.createClass({
	render: function() {
		return (
			<div className="stdPage">
				<div className="aboutDesc">
					<p className="description">
						I am a software engineer that is skilled in C, Java, Go, Ruby, and Python development as well as deploying and maintaining large-scale big data warehouses.  I have extensive knowledge of the Hadoop ecosystem especially when it comes to security and reporting. I have considerable experience with Kerberos, LDAP, and Active Directory from both a development and administrative perspective. I also have substantial networking experience and am knowledgeable about TCP/IP, DNS and routing. I have done a wide array of virtualization infrastructure deployments using VMware and OpenStack.
					</p>
					<img className="github" src="https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png" alt="Check me out on github! "/>
				</div>
				<div className="aboutPhoto"><RobertPhoto /></div>
			</div>
		)
	}
});

module.exports = About;