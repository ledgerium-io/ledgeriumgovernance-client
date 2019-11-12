import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";
import Pager from "../../components/Pager";
import voteOutImage from "../../assets/img/vote_out.svg";

export default function NodeList() {
  const [data, setData] = useState({ blockProducers: [], peers: [] });

  // fetch real data here
  useEffect(() => {
    async function fetchData() {
      const result = await axios("http://localhost:4002/api/state");
      let blockProducers = []
      let peers = []

      for(let i = 0; i < result.data.data.nodes.length; i++) {
        if(result.data.data.nodes[i].role === "MasterNode") {
          blockProducers.push(result.data.data.nodes[i])
        }
        if(result.data.data.nodes[i].role === "PeerNode") {
          peers.push(result.data.data.nodes[i])
        }

      }
      console.log(blockProducers)
      console.log(peers)
      setData({ blockProducers, peers});
    }
    fetchData();
  }, []);


  return (
    <Layout tabIndex={1}>
      <div className="container container--middle">
        <div className="nodelist">
          <div className="nodelist__header">
            <div className="node_info">
              <span className="node_text">Block Producers / Validators</span>
              <span className="node_number">{data.blockProducers.length}</span>
            </div>
            <div className="node_info">
              <span className="node_text">Peers</span>
              <span className="node_number">{data.peers.length}</span>
            </div>
          </div>

          <div className="divide-line" />
          <div className="nodelist__cards">
            <div className="nodelist__cards__column">
              {data.blockProducers.map((item, index) => (
                <div className="node_card" key={`$nodecard_${index}`}>
                  <div className="node_card__left">
                    <p className="p1">{item.name}</p>
                    <p>{item.publicKey}</p>
                  </div>
                  <div className="node_card__right">
                    <button className="vote-out">
                      <img src={voteOutImage} alt="vote out" />
                      &nbsp;&nbsp;Vote out
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="nodelist__cards__column">
              {data.peers.map((item, index) => (
                <div className="node_card" key={`$nodecard_${index}`}>
                  <div className="node_card__left">
                    <p className="p1">{item.name}</p>
                    <p>{item.publicKey}</p>
                  </div>
                  <div className="node_card__right">
                    <button className="vote-out">
                      <img src={voteOutImage} alt="vote out" />
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
