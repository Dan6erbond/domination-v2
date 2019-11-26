import React from 'react';
import './Domination.css';
import './BlankMap-World.css';

var XMLParser = require('react-xml-parser');
var parser = new XMLParser();

class Country extends React.Component {
  /* constructor(props){
    super(props);
  } */

  render() {
    return (
        <g id={this.props.id} className="landxx" onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave} >
          <title>{this.props.name}</title>
          {this.props.paths.map((path, index) =>
            <path d={path} key={index} />
          )}
        </g>
    );
  }
}

export default class Domination extends React.Component {
  constructor(props){
    super(props);
    this.state = {countries: [], currentCountry: null}
  }

  componentDidMount(){
    fetch('./BlankMap-World.svg')
    .then((r) => r.text()).then(text  => {
      var xml = parser.parseFromString(text);

      var paths = xml.getElementsByTagName('path');
      var gs = xml.getElementsByTagName('g');

      var ids = [];
      var countries = [];
      var ocean;
      for (let i in paths){
        let path = paths[i];
        if (!("class" in path.attributes)) {
          continue;
        } else if (path.attributes.class.includes("landxx") && path.children.length >= 1 && path.attributes.id.length === 2) {
          path.name = path.getElementsByTagName("title")[0].value;
          path.id = path.attributes.id;
          path.paths = [path.attributes.d];
          if (!ids.includes(path.id)) {
            countries.push(path);
            ids.push(path.id);
          }
        } else if (path.attributes.class.includes("oceanxx")) {
          ocean = <path id="ocean" className="oceanxx" d={path.attributes.d} />;
        }
      }
      for (let i in gs) {
        var g = gs[i];
        if (!("class" in g.attributes)) {
          continue;
        } else if (g.attributes.class.includes("landxx") && g.children.length >= 1 && g.getElementsByTagName("title").length >= 1 && g.attributes.id.length === 2) {
          g.name = g.getElementsByTagName("title")[0].value;
          g.id = g.attributes.id;
          g.paths = [];
          let paths = g.getElementsByTagName("path");
          for (let j in paths) {
            let path = paths[j];
            g.paths.push(path.attributes.d);
          }
          if (!ids.includes(g.id)) {
            console.log(g)
            countries.push(g);
            ids.push(g.id);
          }
        }
      }
      this.setState({countries: countries, ocean: ocean});
    });
  }

  render() {
    return (
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-30 61 2754 1398" className="map">
          {"ocean" in this.state ? this.state.ocean : null}
          {this.state.countries.map((country, index) =>
            <Country name={country.name} key={country.id} id={country.id} paths={country.paths}
                    onMouseEnter={() => this.mouseEnter(index)} onMouseLeave={() => this.mouseLeave()} />
          )}
        </svg>

        <div className="bottomBar">
          <div>
            {this.state.countries.length > 0 && this.state.currentCountry != null ? this.state.countries[this.state.currentCountry].name : ""}
          </div>
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
