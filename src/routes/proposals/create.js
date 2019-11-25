import React, { Component, Fragment } from "react";
import { baseURL } from 'Constants/defaultValues';
import IntlMessages from "Util/IntlMessages";
import { Alert, Row, Card, CardBody, CardHeader, Progress, CardTitle, Form, FormGroup, Label, Input, Button } from "reactstrap";
import moment from 'moment'
import Layout from "../../components/Layout";
import voteOutImage from "../../assets/img/vote_out.svg";
import voteInImage from "../../assets/img/vote_in.svg";
import { css } from '@emotion/core';
import BounceLoader from 'react-spinners/BounceLoader';
import Goback from "../../components/Proposal/goback";

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
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].role === "MasterNode") {
            blockProducers.push(nodes[i])
          } else {
            validators.push(nodes[i])
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

  createProposal() {
    this.setState({
      error: "You are not authorized to create proposals at this stage"
    })
  }

  render() {
    return (
      <Layout tabIndex={0}>
        <div className="container">
          <Goback />
          <div className="divide-line" />
          {this.state.error !== "" ? <div><Alert color="danger">{this.state.error}</Alert></div> : <br />}
          {this.state.message !== "" ? <div><Alert color="success">{this.state.message}</Alert></div> : <br />}
          <div className="creat_propoal">
            <Form className="creat_propoal__form">
              <h2>Create a Proposal</h2>
              <FormGroup>
                <Label for="proposal_name">Proposal Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="proposal_name"
                  placeholder=""
                />
              </FormGroup>
              <FormGroup>
                <Label for="proposal_description">Proposal Description</Label>
                <Input
                  type="textarea"
                  name="desc"
                  id="proposal_description"
                  style={{ height: 166 }}
                />
              </FormGroup>
              <div className="creat_propoal__btns">
                <Button className="p_btn">Cancel</Button>
                <Button onClick={() => { this.createProposal() }} className="p_btn--primary">Create Proposal</Button>
              </div>
            </Form>
          </div>
        </div>
      </Layout>
    );
  }
}
