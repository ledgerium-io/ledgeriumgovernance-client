import React, { Component } from "react"
import io from 'socket.io-client';
import './v.css'
import { baseURL } from 'Constants/defaultValues';
import API from 'Components/API'
class ValidatorCircle extends Component {

  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      connecting: false,
      loading: true,
      latestBlock: {miner: '', validators: [], number:0},
    }
  }

  componentDidMount() {
    API.get('/api/latestBlocks/1')
      .then(response => {
        this.setState({
          loading: false,
          latestBlock: response.data.data[0]
        })
      })
      .catch(console.log)
      this.serverSocket()
  }

  serverSocket() {
    if(this.state.connecting || this.state.connected) return;
    const self = this
    this.setState({
      connecting: true
    })
    const socket = io(baseURL)

    socket.on('connect', () => {
      self.setState({
        connected: true,
        connecting: false
      })
    })

    socket.on('disconnect', () => {
      self.setState({
        connected: false,
        connecting: false
      })
    })

    socket.on('newBlockHeaders', (block) => {
      self.setState({
        latestBlock: block
      })
    })
  }



  render() {
    const {loading} = this.state
    const {miner, validators} = this.state.latestBlock
    const list = []
    list.push({
      address: '',
      status: ''
    })
    list.push({
      address: miner,
      status: "miner"
    })
    for(let i=0; i<validators.length; i++) {
      list.push({
        address: validators[i],
        status: "validator"
      })
    }

    let type = 1;
    let radius = '16em';
    let start = -90;
    let elements = list
    elements.shift()
    let numberOfElements = (type === 1) ? elements.length : elements.length-1;
    let slice = 360 * type / numberOfElements;

    return (
      <div>
      <h3> Current Block: {this.state.latestBlock.number.toLocaleString()} </h3>
      <h3> Validators: {validators.length} </h3>
      <p>
      <ul>
      { !loading ? list.map((node, i) => {
        let rotate = (slice * i) + start
        let rotateReverse = rotate * -1
        return (
          <li key={i} style={{'transform': `rotate(${rotate}deg) translate(${radius}) rotate(${rotateReverse}deg)`}} className={node.status == "miner" ? "changeUp" : ""}>{node.address}</li>
        )
      }) : ""}
      </ul></p>
      </div>
    )
  }
}

export default ValidatorCircle
