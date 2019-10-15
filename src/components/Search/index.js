import React, { Component } from "react"
import { Redirect } from 'react-router-dom';
import {
  Input,
  Form
} from "reactstrap";
class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      redirect: false,
      redirectTo: ''
    }
  }

  inputChange = (e) => {
    const { id, value } = e.currentTarget
    this.setState({ [id]:value })
  }

  handleSearchIconClick = e => {
    if(e) e.preventDefault();
    let {search} = this.state
    if(search.length <= 0) return;
    search = search.trim()
    if(search.length >= 64 && search.length <= 66) {
      this.setState({
        search: '',
        redirect: true,
        redirectTo: `/blockexplorer/tx/${search}`
      })
    } else if(search.length >= 40 && search.length <=42) {
      this.setState({
        search: '',
        redirect: true,
        redirectTo: `/blockexplorer/address/${search}`
      })
    } else if(Number.isInteger(+search)) {
      this.setState({
        search: '',
        redirect: true,
        redirectTo: `/blockexplorer/block/${search}`
      })
    }
  }

  render() {

  const {markers} = this.state
    return (
      <div>
      { this.state.redirect ? <Redirect to={this.state.redirectTo}/> : null}
        <Form onSubmit={this.handleSearchIconClick}>
        <Input
          name="search"
          id="search"
          placeholder="Search by block number, address or transaction hash"
          value={this.state.search}
          onChange={this.inputChange}
        />
        <span
          className="search-icon"
          onClick={e => this.handleSearchIconClick()}
        >
          <i className="simple-icon-magnifier" />
        </span>
        </Form>
      </div>
    )
  }
}

export default Search
