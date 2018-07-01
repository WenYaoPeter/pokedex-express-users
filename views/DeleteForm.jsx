var React = require("react");

class DeleteForm extends React.Component {
	render() {
		return (
			<html>
				<head/>
				<body>
				<h1>Pokemon to Delete</h1>
				<form method="POST"action={"/pokemon/"+this.props.pokedex.id+"?_method=delete"}
          >
					<div>{this.props.pokedex.id}</div>
		            <div>{this.props.pokedex.num}</div>
		            <div>{this.props.pokedex.name}</div>
		            <img src={this.props.pokedex.img}/>
		            <div>{this.props.pokedex.weight}</div>
		            <div>{this.props.pokedex.height}</div>
					<input name="submit" type="submit" />
				 </form>
				</body>
			</html>
			)
	}
}

module.exports = DeleteForm;

