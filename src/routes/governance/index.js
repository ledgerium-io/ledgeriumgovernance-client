import React, { Component, Fragment } from "react";
import { baseURL } from 'Constants/defaultValues';
import IntlMessages from "Util/IntlMessages";
import {Alert, Row, Card, CardBody,CardHeader, Progress, CardTitle, Button} from "reactstrap";
import moment from 'moment'
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
      <Fragment>
      <ReactTooltip />
        <div className="d-flex justify-content-between">
          <h3>LEDGERIUM GOVERNANCE UI</h3>
          <span>
            Ledgerium Wallet: {this.state.connected ? this.state.publicKey : "Null"}
          </span>
        </div>
        <Separator className="mb-5" />

        {this.state.error !== "" ? <div><Alert color="danger">{this.state.error}</Alert></div> : <br/>}
        {this.state.message !== "" ? <div><Alert color="success">{this.state.message}</Alert></div> : <br/>}
        <h3> Open Ballots <small>({this.state.ballotCount})</small></h3>
        {this.state.ballotCount.length == 0 ?
          <Card>
            <CardBody>
              There are no open ballots
            </CardBody>
          </Card>
        : null}
        {Object.keys(this.state.votes).map((ballot, i) => {
          return(<div key={`ballot${i}`}>
            <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <small className="text-muted"> Proposer</small> <br/>
                  {  this.state.votes[ballot].votees[0].validator }
                </div>
                <div>
                  <small className="text-muted"> Add/Remove? </small> <br/>
                  {this.state.votes[ballot].authorize ? "ADD" : "REMOVE"}
                </div>
                <div>
                  <small className="text-muted"> Effected Key </small> <br/>
                  {ballot}
                </div>
                <div>
                  <small className="text-muted"> Ballot Time </small> <br/>
                  Opened Block #{ this.state.votes[ballot].votees[0].block.toLocaleString() } <br/>
                  Expires Block #{ (this.state.votes[ballot].votees[0].block + 30000).toLocaleString() }
                </div>
              </div>

              <br/>
              <Row>
                <Colxx>
                  <Row>
                    <Colxx xs="1">
                    <Button disabled={!this.state.connected || this.state.publicKey.toLowerCase() === ballot.toLowerCase()} onClick={()=>{this.startVote(ballot, false)}}size="xs"> No </Button>
                    </Colxx>
                    <Colxx>
                      <Row>
                        <Colxx>
                          <strong> 0% </strong> 0 Votes
                        </Colxx>
                      </Row>
                      <Row>
                        <Colxx xs="11">
                          <Progress value={0}/>
                        </Colxx>
                      </Row>
                    </Colxx>
                  </Row>
                </Colxx>
                <Colxx>
                  <Row>
                    <Colxx>
                      <Row>
                        <Colxx xs="11">
                          <strong> 100% </strong> {this.state.votes[ballot].votes} { this.state.votes[ballot].votes === 1 ? " Vote" : "Votes"}
                        </Colxx>
                      </Row>
                      <Row>
                        <Colxx>
                          <Progress value={100}/>
                        </Colxx>
                      </Row>
                    </Colxx>
                    <Colxx xs="1">
                      <Button disabled={!this.state.connected || this.state.publicKey.toLowerCase() === ballot.toLowerCase()} onClick={()=>{this.startVote(ballot, true)}}size="xs"> Yes </Button>
                    </Colxx>
                  </Row>
                </Colxx>
              </Row>
            </CardBody>
          </Card>
          <br/>
        </div>)
        })}

        <br/><br/>

        <Row>
        <Colxx xs="6">
          <h3>Block Producers <small>({this.state.blockProducers.length})</small></h3>
          {this.state.blockProducers.map((node, i) => {
            return(
              <div key={`blockProducers${i}`}>
                <br/>
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <div> <small>#{i+1}</small> {node.name} <br/>
                      {node.publicKey}</div>
                      <div> <Button disabled={!this.state.connected || this.state.publicKey.toLowerCase() === node.publicKey.toLowerCase()} onClick={()=>{this.startVote(node.publicKey, false)}}size="xs"> Vote out</Button></div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )
          })}
        </Colxx>

        <Colxx xs="6">
          <h3>Validators <small>({this.state.validators.length})</small></h3>
          {this.state.validators.map((node, i) => {
            return(
              <div key={`validators${i}`}>
                <br/>
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <div>
                      <small>#{i+1}</small> {node.name} <br/>
                      {node.publicKey}
                      </div>
                      <div> <Button disabled={!this.state.connected || this.state.publicKey.toLowerCase() === node.publicKey.toLowerCase()} onClick={()=>{this.startVote(node.publicKey, true)}}size="xs"> Vote in</Button></div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )
          })}
        </Colxx>

        </Row>
      </Fragment>
    );
  }
}
