import React, { Component, Fragment } from "react";
import { baseURL } from 'Constants/defaultValues';
import IntlMessages from "Util/IntlMessages";
import { Alert, Row, Card, CardBody, CardHeader, Progress, CardTitle, Button } from "reactstrap";
import moment from 'moment'
import Layout from "../../components/Layout";
import { css } from '@emotion/core';
import BounceLoader from 'react-spinners/BounceLoader';
const override = css`
    display: inline-block;
    border-color: red;
`;
moment.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: '%d seconds',
    ss: '%d seconds',
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
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
        const { consortiumId, nodes, nodeCount, snapshot } = response.data.data
        let validators = []
        let blockProducers = []
        let blockProducerKeys = []
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].role === "MasterNode") {
            blockProducers.push(nodes[i])
            blockProducerKeys.push(nodes[i].publicKey.toLowerCase())
          } else {
            validators.push(nodes[i])
          }
        }

        for (let i = 0; i < snapshot.validators.length; i++) {
          const node = snapshot.validators[i].toLowerCase()
          if(!blockProducerKeys.includes(node)) {
            blockProducers.push({
              enode: 'Unknown',
              name: 'Unknown',
              publicKey: node,
              role: 'MasterNode',
              ip: '0.0.0.0',
              port: '0000'
            })
          }
        }



        let votes = snapshot.tally
        let ballotCount = 0
        for (let i = 0; i < snapshot.votes.length; i++) {
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
            if (signee.toLowerCase() === this.state.publicKey.toLowerCase()) {
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
      if (!this.state.connected) reejct('not connected')
      axios.post(`${baseURL}/api/start-propose`, {
        address: this.state.publicKey
      })
        .then(response => {
          if (response.data.success) {
            this.setState({
              error: '',
              message: <span>
                <BounceLoader
                  css={override}
                  sizeUnit={"px"}
                  size={12}
                  loading={true}
                /> {" "}
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
    if (window.ledgerium) {
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
        <div> <br/> Ledgerium Wallet: {this.state.connected ? this.state.publicKey : "Null"}</div>
        <div className="container container--middle">
          {this.state.error !== "" ? <div><Alert color="danger">{this.state.error}</Alert></div> : ""}
          {this.state.message !== "" ? <div><Alert color="success">{this.state.message}</Alert></div> : ""}
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

            <div className="divide-line desktop" />
            <div className="nodelist__cards">
              <div className="node_info node_info--mobile">
                <span className="node_text">Block Producers / Validators</span>
                <span className="node_number">{this.state.blockProducers.length}</span>
                <div className="divide-line" style={{ marginTop: 12, marginBottom: 8 }} />
              </div>
              <div className="nodelist__cards__column">
                {this.state.blockProducers.length === 0 ? "No block producers/validators found" : null}
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
                      <button disabled={!this.state.connected || this.state.publicKey.toLowerCase() === item.publicKey.toLowerCase()} onClick={() => { this.startVote(item.publicKey, false) }} className="vote-out">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.5603 12.0734H13.5363C13.4564 12.0734 13.3898 12.1405 13.3898 12.2211V13.4065H1.40466V1.3255H13.3917V2.51097C13.3917 2.59153 13.4583 2.65867 13.5382 2.65867H14.5622C14.6422 2.65867 14.7088 2.59345 14.7088 2.51097V0.588898C14.7088 0.262798 14.448 0 14.1245 0H0.673792C0.35023 0 0.0894775 0.262798 0.0894775 0.588898V14.1431C0.0894775 14.4692 0.35023 14.732 0.673792 14.732H14.1225C14.4461 14.732 14.7069 14.4692 14.7069 14.1431V12.2211C14.7069 12.1386 14.6402 12.0734 14.5603 12.0734ZM14.9143 7.24517L12.2135 5.09675C12.1127 5.01618 11.9661 5.08907 11.9661 5.21759V6.67545H5.98972C5.90598 6.67545 5.83746 6.74451 5.83746 6.82891V7.90312C5.83746 7.98752 5.90598 8.05658 5.98972 8.05658H11.9661V9.51444C11.9661 9.64296 12.1146 9.71585 12.2135 9.63529L14.9143 7.48686C14.9325 7.47251 14.9472 7.45417 14.9574 7.43323C14.9675 7.41229 14.9727 7.38931 14.9727 7.36602C14.9727 7.34273 14.9675 7.31974 14.9574 7.2988C14.9472 7.27786 14.9325 7.25952 14.9143 7.24517Z" fill="white" />
                        </svg>
                        Vote out
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="nodelist__cards__column">
                <div className="node_info node_info--mobile">
                  <span className="node_text">Peers</span>
                  <span className="node_number">{this.state.validators.length}</span>
                  <div className="divide-line" style={{ marginTop: 12, marginBottom: 8 }} />
                </div>
                {this.state.validators.length === 0 ? "No peers found" : null}

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
                      <button disabled={!this.state.connected || this.state.publicKey.toLowerCase() === item.publicKey.toLowerCase()} onClick={() => { this.startVote(item.publicKey, true) }} className="vote-out">
                        <svg fill="none" height="16" viewBox="0 0 15 16" width="15" xmlns="http://www.w3.org/2000/svg"><path d="m.4869 3.68078 1.02397-.00326c.07994-.00026.14634-.06761.14609-.14817l-.00378-1.18547 11.98502-.03815.0385 12.08097-11.98696.0382-.00378-1.1855c-.00025-.0806-.06708-.1475-.14702-.1472l-1.023973.0032c-.079938.0003-.146345.0657-.146082.1482l.006118 1.9221c.001039.3261.262626.588.586186.587l13.450611-.0428c.3235-.0011.5835-.2647.5824-.5908l-.0431-13.55415c-.0011-.3261-.2627-.58807-.5862-.58704l-13.448706.04281c-.32356.00103-.583475.26466-.582437.59076l.006119 1.92206c.000262.08248.067085.14749.147024.14724zm-.338643 4.82929 2.707613 2.13983c.10113.0802.24746.0069.24705-.1217l-.00464-1.4578 5.97635-.01903c.08374-.00026.15204-.06954.15177-.15394l-.00342-1.07421c-.00027-.0844-.06901-.15323-.15275-.15297l-5.97635.01903-.00464-1.45785c-.00041-.12852-.1491-.20094-.24781-.12006l-2.693943 2.15701c-.018153.01441-.032813.0328-.042868.05377-.0100556.02097-.0152422.04397-.015168.06726.0000741.02329.0054071.04626.015596.06716.010188.02091.024965.0392.04321.0535z" fill="#fff" /></svg>
                        Vote in
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
