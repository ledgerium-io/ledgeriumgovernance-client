import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";
import Pager from "../../components/Pager";
import voteOutImage from "../../assets/img/vote_out.svg";

export default function NodeList() {
  const [data, setData] = useState({ rows: [] });

  // fetch real data here
  useEffect(() => {
    async function fetchData() {
      // const result = await axios("https://jsonplaceholder.typicode.com/posts/");
      // console.log("result", result);
      setData({ rows: [1, 1, 1, 1, 1, 1, 1, 1] });
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
              <span className="node_number">10</span>
            </div>
            <div className="node_info">
              <span className="node_text">Peers</span>
              <span className="node_number">7</span>
            </div>
          </div>

          <div className="divide-line" />
          <div className="nodelist__cards">
            <div className="nodelist__cards__column">
              {data.rows.map((item, index) => (
                <div className="node_card" key={`$nodecard_${index}`}>
                  <div className="node_card__left">
                    <p className="p1">flinders.ciredwc22sf32scxzcdvet3234</p>
                    <p>0xfsdfigtigjf3432igv45uovigk3ig5</p>
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
              {data.rows.map((item, index) => (
                <div className="node_card" key={`$nodecard_${index}`}>
                  <div className="node_card__left">
                    <p className="p1">flinders.ciredwc22sf32scxzcdvet3234</p>
                    <p>0xfsdfigtigjf3432igv45uovigk3ig5</p>
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
