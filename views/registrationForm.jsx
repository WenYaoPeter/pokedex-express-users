var React = require("react");

class registrationForm extends React.Component {
	render() {
		return (
			<html>
			<body>
				<h1>Pokedex User Registration</h1>
				<form method="POST" action='/pokemon/user/registration'>
					Enter User Name: <input name="userName" type="text" placeholder="User Name"/>
					Enter Password: <input name="password" type="text" placeholder="Password"/>
					Enter Email: <input name="email" type="text" placeholder="Email"/>
					<input type="submit" value="Submit"/>
				</form>
			</body>
			</html>
		)
	}
}
module.exports = registrationForm;