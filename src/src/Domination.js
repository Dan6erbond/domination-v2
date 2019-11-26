import React from 'react';
import './Domination.css';
import './BlankMap-World.css';

var XMLParser = require('react-xml-parser');

class Country extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      red: false
    }
  }

  render() {
    return (
      <path id="ss" className={this.state.red ? this.props.class + " red" : this.props.class} d={this.props.path}
            onMouseEnter={() => this.mouseEnter()}
            onMouseLeave={() => this.mouseLeave()}>
    		<title>{this.state.name}</title>
    	</path>
    );
  }

  mouseEnter(){
    this.setState({
      red: true
    });
  }

  mouseLeave(){
    this.setState({
      red: false
    });
  }
}

export default class Domination extends React.Component {
  constructor(props){
    super(props);
    this.state = {countries: []}
  }

  componentDidMount(){
    fetch('./BlankMap-World.svg')
    .then((r) => r.text())
    .then(text  => {
      var parser = new XMLParser();
      var xml = parser.parseFromString(text);
      var objects = xml.getElementsByTagName('path');
      // objects.push(...xml.getElementsByTagName('g'));
      var countries = [];
      for (var i in objects){
        var country = objects[i];
        if ("class" in country.attributes && country.attributes.class.includes("landxx")) {
          countries.push(country);
        }
      }
      this.setState({countries: countries});
    });
  }

  render() {


    return (
      <div>
        The game.
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-30 61 2754 1398" width="100%">
          {this.state.countries.map((country) => <Country name="South Sudan" key={country.attributes.id} class="landxx ss" path={country.attributes.d} />)}

        </svg>
      </div>
    );
  }
}
