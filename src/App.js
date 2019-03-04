import React, { Component } from 'react';
import Search from './components/Search';
import Table from './components/Table';
import './App.css'

const DEFAULT_QUERY = 'redux'
const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
  }

  setSearchTopStories(result) {
    this.setState({ result })
  }

  componentDidMount() {
    const { searchTerm } = this.state
    this.fetchSearchTopStories(searchTerm)
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error)
  }


  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value })
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state
    this.fetchSearchTopStories(searchTerm)
    event.preventDefault()
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  render() {
    const { searchTerm, result } = this.state

    if (!result) { return null }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          > Search
            </Search>
        </div>
        {result &&
          <Table
            list={result.hits}
            onDismiss={this.onDismiss}

          />
        }

      </div>
    );
  }
}


export default App;
