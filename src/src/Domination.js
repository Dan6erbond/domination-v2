import React from 'react';
import './Domination.css';
import './BlankMap-World.css';

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
    this.state = {map: {}, currentCountry: null}
  }

  componentDidMount(){
    fetch('./BlankMap-World.json')
    .then((r) => r.text()).then(text  => {
      this.setState({map: JSON.parse(text)});
    });
  }

  render() {
    var countries = [], ocean = null;
    if ("countries" in this.state.map){
      countries = this.state.map.countries;
    }
    if ("ocean" in this.state.map){
      ocean = <path id="ocean" className="oceanxx" d={this.state.map.ocean} />;
    }

    return (
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-30 61 2754 1398" className="map">
          {ocean}
          {countries.map((country, index) =>
            <Country name={country.name} key={country.id} id={country.id} paths={country.paths}
                    onMouseEnter={() => this.mouseEnter(index)} onMouseLeave={() => this.mouseLeave()} />
          )}
        </svg>

        <div className="bottomBar">
          <div>
            {countries.length > 0 && this.state.currentCountry != null ? countries[this.state.currentCountry].name : ""}
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
