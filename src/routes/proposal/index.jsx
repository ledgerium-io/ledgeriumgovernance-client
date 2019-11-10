import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProposalRow from "../../components/Proposal/row";
import Layout from "../../components/Layout";
import Pager from "../../components/Pager";
import axios from "axios";

export default function Proposals() {
  const [data, setData] = useState({ rows: [] });

  // fetch real data here
  useEffect(() => {
    async function fetchData() {
      const result = await axios("https://jsonplaceholder.typicode.com/posts/");
      console.log("result", result);
      setData({ rows: mockRows });
    }
    fetchData();
  }, []);

  return (
    <Layout tabIndex={0}>
      <div className="container container--middle">
        <div className="props__create">
          <Link to="/proposal/create">
            <button>Create Proposal</button>
          </Link>
        </div>
        <div className="props">
          {data.rows.map((row, index) => (
            <ProposalRow {...row} key={`row_${index}`} />
          ))}
        </div>
        <div className="ppager">
          <Pager />
        </div>
      </div>
    </Layout>
  );
}

const mockRows = [
  {
    id: "0xfsdfigtigjf3432igv45uovi234",
    progress: 70,
    pathColor: "#2a93d5",
    title: "“dash-texas-farms-fall-events - No title entered by proposalowner“",
    timeRemaining: "21 XLG per month (3 month remaining)",
    vote: 15
  },
  {
    id: "0xfsdfigtigjf3432igv45uovigk3234",
    progress: 66,
    pathColor: "#ffc107",
    title: "“dash-texas-farms-fall-events - No title entered by proposalowner“",
    timeRemaining: "21 XLG per month (3 month remaining)",
    vote: 90
  },
  {
    id: "0xfsdfigtigjf3432igv45uovigk3iwer",
    progress: 35,
    pathColor: "#dc3545",
    title: "“dash-texas-farms-fall-events - No title entered by proposalowner“",
    timeRemaining: "21 XLG per month (3 month remaining)",
    vote: 90
  },
  {
    id: "0xfsdfigtigjf3432igv45wewrgk3ig5",
    progress: 90,
    pathColor: "#50E6C5",
    title: "“dash-texas-farms-fall-events - No title entered by proposalowner“",
    timeRemaining: "21 XLG per month (3 month remaining)",
    vote: 25
  }
];
