import React, { Component, Fragment } from "react";
import { baseURL } from 'Constants/defaultValues';
import IntlMessages from "Util/IntlMessages";
import { Row, Card, CardBody,CardHeader, Progress, CardTitle, Button} from "reactstrap";
import moment from 'moment'
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
import API from 'Components/API'
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
      ballots: [1],
      ballotCount: 0,
      nodeCount: 0,
      snapshot: {}

    }
  }

  componentWillMount() {
    API.get('/api/state')
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
        this.setState({
          consortiumId,
          nodes,
          nodeCount,
          validators,
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

  startVote(address, decision) {

    axios.post('http://localhost:4002', {
        vote: address,
        proposal: decision,
        sender: this.publicKey
    })
    .then(response => {
      this.state.localWeb3.eth.personal.sign(data.token, this.publicKey)
        .then(signature => {
          console.log(signature)
        })
    })
    .catch(error => {
      this.state.localWeb3.eth.personal.sign('token', this.state.publicKey, '')
        .then(signature => {
          console.log(signature)
          console.log(this.state.localWeb3.eth.accounts.recover('token', signature))
        })
        .catch(error => {
          console.log(error)
          console.log(this.localWeb3)
        })
    })

  }

  startVote = (votee, proposal) => {
    this.getChallenge()
      .then(challenge => {
        this.signChallenge(challenge)
          .then(signature => {
            const signee = this.state.localWeb3.eth.accounts.recover(challenge, signature)
            if(signee.toLowerCase() === this.state.publicKey.toLowerCase()) {
              API.post('http://localhost:4002/api/istanbul-propose', {
                challenge,
                signature,
                votee,
                proposal,
              })
              .then(console.log)
              .catch(console.log)
            }
          })
          .catch(console.log)
      })
      .catch(console.log)
  }

  getChallenge = () => {
    return new Promise((resolve, reject) => {
      if(!this.state.connected) reejct('not connected')
      API.post('http://localhost:4002/api/start-propose', {
        address: this.state.publicKey
      })
      .then(response => {
        if(response.data.success) {
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
      <Button onClick={this.getChallenge}> Get Challenge </Button>
      <ReactTooltip />
        <div className="d-flex justify-content-between">
          <h3>LEDGERIUM GOVERNANCE UI</h3>
          <span>
            Ledgerium Wallet: {this.state.connected ? this.state.publicKey : "Null"}
          </span>
        </div>
        <Separator className="mb-5" />
        <h3> Open Ballots <small>({this.state.ballotCount})</small></h3>
        {this.state.ballots.length == 0 ?
          <Card>
            <CardBody>
              There are no open ballots
            </CardBody>
          </Card>
        : null}
        {this.state.ballots.map((ballot, i) => {
          return(<Card key={`ballot${i}`}>
            <CardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <small className="text-muted"> Proposer</small> <br/>
                  0x12312321321dc12d1d12d1dx12xEe7
                </div>
                <div>
                  <small className="text-muted"> Add </small> <br/>
                  0xD12idh12idh12idhdDH@1d121ds12FeD
                </div>
                <div>
                  <small className="text-muted"> Ballot Time </small> <br/>
                  Opened Block # <br/>
                  Closes Block #
                </div>
              </div>

              <br/>
              <Row>
                <Colxx>
                  <Row>
                    <Colxx xs="1">
                      <Button size="xs"> No </Button>
                    </Colxx>
                    <Colxx>
                      <Row>
                        <Colxx>
                          <strong> 25% </strong> 2 Votes
                        </Colxx>
                      </Row>
                      <Row>
                        <Colxx xs="11">
                          <Progress value={25}/>
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
                          <strong> 75% </strong> 6 Votes
                        </Colxx>
                      </Row>
                      <Row>
                        <Colxx>
                          <Progress value={75}/>
                        </Colxx>
                      </Row>
                    </Colxx>
                    <Colxx xs="1">
                      <Button size="xs"> Yes </Button>
                    </Colxx>
                  </Row>
                </Colxx>

              </Row>

            </CardBody>
          </Card>)
        })}


        <br/>

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
                      <div> <small>#{i+1}</small> {node.publicKey} <br/>
                      {node.name}</div>
                      <div> <Button onClick={()=>{this.startVote(node.publicKey, false)}}size="xs"> Vote out</Button></div>
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
                      <div> <small>#{i+1}</small> {node.publicKey} <br/>
                      {node.name}
                      </div>
                      <div> <Button onClick={()=>{this.startVote(node.publicKey, true)}}size="xs"> Vote in</Button></div>
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
