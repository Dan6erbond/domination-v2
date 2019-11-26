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
        <path id={this.props.id} className="landxx" d={this.props.path}
              onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave} >
          <title>{this.props.name}</title>
        </path>
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
        } else if (path.attributes.class.includes("landxx") && path.children.length >= 1) {
          path.name = path.getElementsByTagName("title")[0].value;
          if (!ids.includes(path.attributes.id)) {
            countries.push(path);
            ids.push(path.attributes.id);
          }
        } else if (path.attributes.class.includes("oceanxx")) {
          ocean = <path id="ocean" className="oceanxx" d={path.attributes.d} />;
        }
      }
      for (let i in gs) {
        var g = gs[i];
        if (!("class" in g.attributes)) {
          continue;
        } else if (g.attributes.class.includes("landxx") && g.children.length >= 1 && g.getElementsByTagName("title").length >= 1) {
          let paths = g.getElementsByTagName("path");
          let found = false;
          for (let j in paths) {
            let path = paths[j];
            if (!("class" in path.attributes)) {
              continue;
            } else if (path.attributes.class.includes("landxx")) {
              found = true;
              path.name = g.getElementsByTagName("title")[0].value;
              path.attributes.id = g.attributes.id;
              if (!ids.includes(path.attributes.id)) {
                countries.push(path);
                ids.push(path.attributes.id);
              }
            }
          }
          if (!found) {
            let path = paths[0];
            path.name = g.getElementsByTagName("title")[0].value;
            path.attributes.id = g.attributes.id;
            if (!ids.includes(path.attributes.id)) {
              countries.push(path);
              ids.push(path.attributes.id);
            }
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
            <Country name={country.name} key={country.attributes.id} id={country.attributes.id}
                    path={country.attributes.d} hoverFun={this.hoverCountry}
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
