import React, { Component, Fragment } from "react";
import { baseURL } from 'Constants/defaultValues';
import IntlMessages from "Util/IntlMessages";
import {Alert, Row, Card, CardBody,CardHeader, Progress, CardTitle, Button} from "reactstrap";
import moment from 'moment'
import Layout from "../../components/Layout";
import voteOutImage from "../../assets/img/vote_out.svg";
import voteInImage from "../../assets/img/vote_in.svg";
import { css } from '@emotion/core';
import BounceLoader from 'react-spinners/BounceLoader';
const override = css`
    display: inline-block;
    border-color: red;
`;
moment.updateLocale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s ago",
        s  : '%d seconds',
        ss : '%d seconds',
        m:  "a minute",
        mm: "%d minutes",
        h:  "an hour",
        hh: "%d hours",
        d:  "a day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }
});
import { Colxx, Separator } from "Components/CustomBootstrap";
import { NavLink } from "react-router-dom";
import Web3 from 'web3';
const web3 = new Web3()
import axios from 'axios'

import ReactTooltip from 'react-tooltip'

export default class extends Component {

  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      localWeb3: {},
      consortiumId: 2018,
      publicKey: '',
      nodes: [],
      blockProducers: [],
      validators: [],
      ballots: [],
      ballotCount: 0,
      votes: {},
      nodeCount: 0,
      snapshot: {},
      error: '',
      message: ''
    }
  }

  componentWillMount() {
    axios.get(`${baseURL}/api/state`)
      .then(response => {
        const {consortiumId, nodes, nodeCount, snapshot} = response.data.data
        let validators = []
        let blockProducers = []
        for(let i=0; i<nodes.length; i++) {
          if(nodes[i].role === "MasterNode") {
            blockProducers.push(nodes[i])
          } else {
            validators.push(nodes[i])
          }
        }
        let votes = snapshot.tally
        let ballotCount = 0
        for (let i = 0; i<snapshot.votes.length; i++) {
          const vote = snapshot.votes[i]
          if (votes[vote.address]) {
            if (votes[vote.address.votees]) {
              votes[vote.address].votees.push(vote)
            } else {
              votes[vote.address].votees = [vote]
              ballotCount++
            }
          }
        }
        console.log(votes)


        this.setState({
          consortiumId,
          nodes,
          nodeCount,
          validators,
          ballotCount,
          votes,
          blockProducers,
          snapshot
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  componentDidMount() {
    this.connectToWallet()
  }

  startVote = (votee, proposal) => {
    this.setState({
      error: "",
      message: ""
    })
    this.getChallenge()
      .then(challenge => {
        this.signChallenge(challenge)
          .then(signature => {
            const signee = this.state.localWeb3.eth.accounts.recover(challenge, signature)
            if(signee.toLowerCase() === this.state.publicKey.toLowerCase()) {
              axios.post(`${baseURL}/api/istanbul-propose`, {
                challenge,
                signature,
                votee,
                proposal,
              })
              .then(response => {
                this.setState({
                  error: "",
                  message: "Your vote has been proposed"
                })
              })
              .catch(error => {
                try {
                  this.setState({
                    error: error.response.data.message,
                    message: ''
                  })
                } catch (bugger) {
                  console.log(error)
                  console.log(bugger)
                }
              })
            }
          })
          .catch(console.log)
      })
      .catch(error => {
        try {
          this.setState({
            error: error.response.data.message
          })
        } catch (bugger) {
          console.log(error)
          console.log(bugger)
        }
      })
  }

  getChallenge = () => {
    return new Promise((resolve, reject) => {
      if(!this.state.connected) reejct('not connected')
      axios.post(`${baseURL}/api/start-propose`, {
        address: this.state.publicKey
      })
      .then(response => {
        if(response.data.success) {
          this.setState({
            error: '',
            message: <span>
                <BounceLoader
                css={override}
                sizeUnit={"px"}
                size={12}
                loading={true}
              /> { " "}
              Recieved challenge, please sign the request
            </span>
          })
          resolve(response.data.data.challenge)
        } else {
          reject(resposne.data.data.message)
        }
      })
      .catch(reject)
    })

  }

  signChallenge = (challenge) => {
    return new Promise((resolve, reject) => {
      this.state.localWeb3.eth.personal.sign(challenge, this.state.publicKey, '')
        .then(resolve)
        .catch(reject)
    })
  }

  async connectToWallet() {
    if(window.ledgerium) {
      const localWeb3 = new Web3(window.ledgerium)
      try {
        await window.ledgerium.enable()
        this.setState({
          connected: true,
          publicKey: window.ledgerium.selectedAddress,
          localWeb3
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  render() {
    return (
      <Layout tabIndex={1}>

        <div className="container container--middle">
        {this.state.error !== "" ? <div><Alert color="danger">{this.state.error}</Alert></div> : <br/>}
        {this.state.message !== "" ? <div><Alert color="success">{this.state.message}</Alert></div> : <br/>}
          <div className="nodelist">
            <div className="nodelist__header">
              <div className="node_info">
                <span className="node_text">Block Producers / Validators</span>
                <span className="node_number">{this.state.blockProducers.length}</span>
              </div>
              <div className="node_info">
                <span className="node_text">Peers</span>
                <span className="node_number">{this.state.validators.length}</span>
              </div>
            </div>

            <div className="divide-line" />
            <div className="nodelist__cards">
              <div className="nodelist__cards__column">
                {this.state.blockProducers.map((item, index) => (
                  <div className="node_card" key={`$nodecard_${index}`}>
                    <div className="node_card__left">
                      <p className="p1">{item.name}</p>
                      <p>
                        {web3.utils.isAddress(item.publicKey)
                          ? web3.utils.toChecksumAddress(item.publicKey)
                          : item.publicKey}
                      </p>
                    </div>
                    <div className="node_card__right">
                    <button disabled={!this.state.connected || this.state.publicKey.toLowerCase() === item.publicKey.toLowerCase()} onClick={()=>{this.startVote(item.publicKey, false)}} className="vote-out">
                        <img src={voteOutImage} alt="Vote out" />
                        &nbsp;&nbsp;Vote out
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="nodelist__cards__column">
                {this.state.validators.map((item, index) => (
                  <div className="node_card" key={`$nodecard_${index}`}>
                    <div className="node_card__left">
                      <p className="p1">{item.name}</p>
                      <p>
                        {web3.utils.isAddress(item.publicKey)
                          ? web3.utils.toChecksumAddress(item.publicKey)
                          : item.publicKey}
                      </p>
                    </div>
                    <div className="node_card__right">
                    <button disabled={!this.state.connected || this.state.publicKey.toLowerCase() === item.publicKey.toLowerCase()} onClick={()=>{this.startVote(item.publicKey, true)}} className="vote-out">
                        <img src={voteInImage} alt="Vote in" />
                        &nbsp;&nbsp;Vote in
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
