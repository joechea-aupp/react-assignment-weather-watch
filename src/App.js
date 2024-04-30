import React, { Component, createRef } from "react";
import debounce from "lodash.debounce";
import Input from "./components/Input";
import SearchResults from "./components/SearchResults";
import SetUnits from "./components/SetUnits";
import WeatherReport from "./components/WeatherReport";

class App extends Component {
  state = {
    searchResults: [],
    error: false,
    isLoading: true,
    selectedLocId: 0,
    tempUnits: "C",
    weatherData: {},
  };
  searchRef = createRef();
  componentDidMount() {
    this.searchRef.current.focus();
    this.getWeather();
  }
  componentDidUpdate(_, prevState) {
    if (
      this.state.selectedLocId !== prevState.selectedLocId ||
      this.state.tempUnits !== prevState.tempUnits
    ) {
      this.getWeather();
    }
  }
  searchLocations = debounce(async (keyword) => {
    try {
      const data = await fetch(
        `https://api.weatherserver.com/weather/cities/${keyword}`,
      );
      const response = await data.json();
      this.setState({ searchResults: response.results, error: false });
    } catch (error) {
      this.setState({ error: true });
    }

    // fetch(`https://api.weathersever.com/weather/cities/${keyword}`)
    //   .then((res) => res.json())
    //   .then(({ result }) =>
    //     this.setState({ searchResults: result, error: false }),
    //   )
    //   .catch(() => this.setState({ error: true }));
  }, 200);
  getWeather = () => {
    this.setState({
      searchResults: [],
      isLoading: true,
      error: false,
    });
    this.searchRef.current.value = "";
    fetch(
      `https://api.weatherserver.com/weather/current/${this.state.selectedLocId}/${this.state.tempUnits}`,
    )
      .then((res) => res.json())
      .then((data) => this.setState({ weatherData: data, isLoading: false }))
      .catch(() => this.setState({ error: true }));
  };
  render() {
    return (
      <div className="weather-app">
        <h1>WeatherWatch</h1>
        <Input
          label="LOCATION"
          onInput={(e) => this.searchLocations(e.target.value)}
          inputRef={this.searchRef}
        />
        {this.state.searchResults.length > 0 && (
          <SearchResults
            data={this.state.searchResults}
            selectLocation={(cityId) =>
              this.setState({ selectedLocId: cityId })
            }
          />
        )}
        <SetUnits
          value={this.state.tempUnits}
          onSet={(e) => this.setState({ tempUnits: e.target.value })}
        />
        {this.state.isLoading ? (
          <div className="is-loading"></div>
        ) : (
          <WeatherReport
            weatherData={this.state.weatherData}
            units={this.state.tempUnits === "C" ? "C" : "F"}
          />
        )}
        {this.state.error && (
          <p className="error">Something went wrong. Please try again.</p>
        )}
      </div>
    );
  }
}

export default App;
