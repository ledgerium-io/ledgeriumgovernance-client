import React, { useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import Goback from "../../components/Proposal/goback";
import axios from "axios";

export default function ProposalDetail() {
  let { slug } = useParams();
  let location = useLocation();
  let history = useHistory();

  console.log("slug,location,history", slug, location, history);
  const [data, setData] = useState({ rows: [] });

  // fetch real data here
  useEffect(() => {
    async function fetchData() {
      const result = await axios("https://jsonplaceholder.typicode.com/posts/");
      console.log("result", result);
      setData({ rows: result.data });
    }
    fetchData();
  }, []);
  return (
    <Layout tabIndex={0}>
      <div className="container container--middle">
        <Goback />

        <div className="divide-line" />
      </div>
    </Layout>
  );
}
