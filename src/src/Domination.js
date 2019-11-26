import React from 'react';
import './Domination.css';
import './BlankMap-World.css';

var XMLParser = require('react-xml-parser');

class Country extends React.Component {
  /* constructor(props){
    super(props);
  } */

  render() {
    return (
        <path id="ss" className={this.props.red ? this.props.class + " red" : this.props.class} d={this.props.path}
              onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave} >
          <title>{this.props.name}</title>
        </path>
    );
  }
}

export default class Domination extends React.Component {
  constructor(props){
    super(props);
    this.state = {countries: [], currentCountry: 1}
  }

  componentDidMount(){
    fetch('./BlankMap-World.svg')
    .then((r) => r.text())
    .then(text  => {
      var parser = new XMLParser();
      var xml = parser.parseFromString(text);
      var objects = xml.getElementsByTagName('path');
      // objects.push(...xml.getElementsByTagName('g'));
      var cs = [];
      for (var i in objects){
        var country = objects[i];
        if ("class" in country.attributes && country.attributes.class.includes("landxx") && country.children.length >= 1) {
          country.name = country.getElementsByTagName("title")[0].value;
          cs.push(country);
        }
      }
      this.setState({countries: cs});
    });
  }

  render() {
    /* var countries = [];
    for (var i in this.state.countries) {
      var country = this.state.countries[i];
      countries.push(<Country name={country.name} key={country.attributes.id} class="landxx ss" path={country.attributes.d}
              hoverFun={this.hoverCountry} red={i === this.state.currentCountry}
              onMouseEnter={(i) => this.mouseEnter(i)} onMouseLeave={() => this.mouseLeave()} />);
    } */
    return (
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-30 61 2754 1398" width="100%">
          {this.state.countries.map((country, index) =>
            <Country name={country.name} key={country.attributes.id} class="landxx ss" path={country.attributes.d}
                    hoverFun={this.hoverCountry} red={index === this.state.currentCountry}
                    onMouseEnter={() => this.mouseEnter(index)} onMouseLeave={() => this.mouseLeave()} />
          )}
        </svg>

        <div className="bottomBar">
          <div>{this.state.countries.length > 0 && this.state.currentCountry != null ? this.state.countries[this.state.currentCountry].name : ""}</div>
        </div>
      </div>
    );
  }

  mouseEnter (index) {
    this.setState({currentCountry: index});
  }

  mouseLeave () {
    this.setState({currentCountry: null});
  }
}
