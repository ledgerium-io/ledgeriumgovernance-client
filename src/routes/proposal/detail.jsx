import React, { useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { Progress } from "reactstrap";
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
        <div className="props_detail">
          <ul className="props_detail__header">
            <li>Proposer</li>
            <li>Action</li>
            <li>Affected Key</li>
            <li>Block Producer</li>
            <li>Ballot Time (UTC)</li>
            <li>Final Voting Deadline</li>
          </ul>
          <div className="props_detail__vote">
            <ul className="props_detail__vote__header">
              <li>
                <p>0xd05f7236d732d2cv24rfds75cdv2r93r</p>
              </li>
              <li>
                <p> Remove</p>
              </li>
              <li>
                <p>0xd05f7236d732d2cv24rfds75cdv2r93r</p>
              </li>
              <li>
                <p>flinders.ciredwc22sf32scxzcdvet3234</p>
              </li>
              <li>
                <p>10/21/2019 5:46:23 PM</p>
              </li>
              <li>
                <p>3 March, 2019</p>
              </li>
            </ul>
            <h2></h2>
            <div className="divide-line" />
            <div className="props_detail__vote__info">
              <div className="vote_no">
                <div className="text-center">50%</div>
                <Progress value="50" />
                <p className="votes">25 Votes</p>
                <button className="vote__btn--no">No</button>
              </div>

              <div className="vote_yes">
                <div className="text-center">25%</div>
                <Progress value="5" />
                <p className="votes">25 Votes</p>
                <button className="vote__btn--yes">Yes</button>
              </div>
            </div>
          </div>
          <h2 className="props_detail__desc-title">Proposal Description</h2>
          <div className="divide-line" />

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum
            nullam sem quis vulputate ullamcorper porttitor viverra. Lacus
            libero rhoncus orci feugiat vestibulum, quis sit netus. Nunc tortor
            ultrices ut aliquam sit integer turpis sit convallis. Pretium netus
            diam tellus morbi nibh eget nibh. Proin orci venenatis massa
            rhoncus. Commodo gravida tellus mi aenean faucibus. Lobortis purus
            enim, ut eget fusce quis tellus. Quis vehicula nunc orci nunc cras
            et. Et pellentesque orci posuere sit vitae. Facilisis non sed
            gravida nisl ac maecenas tincidunt. Nisl, eu feugiat purus phasellus
            urna, pellentesque. Enim nec amet, tincidunt at faucibus. Volutpat
            mattis iaculis non, purus aliquet diam. Semper pulvinar tellus, in
            eget commodo ac commodo aenean pellentesque. Pharetra turpis donec
            mauris tempor accumsan malesuada faucibus pellentesque. Tristique
            faucibus sed non consectetur nibh sapien. Faucibus arcu fusce vel
            amet sagittis, cursus. Turpis vitae ornare rhoncus luctus cras enim
            et. Id lectus lectus blandit feugiat viverra pretium amet interdum.
            Justo mi massa nunc tincidunt integer etiam. Neque, fusce eget
            congue nec. Lobortis viverra massa, morbi et. Eu, eget leo at
            malesuada volutpat in sit. Sapien sed et eu arcu porta turpis eget
            tempor. Faucibus enim gravida suspendisse sed purus, pellentesque
            velit neque. Consequat odio convallis nunc eget sed arcu nulla in
            vulputate. Ut neque lacinia elit nunc bibendum metus. Ultricies est
            augue cras velit etiam molestie eget ultricies viverra. Ut risus
            molestie lectus condimentum congue erat. Enim, nec dolor ipsum proin
            commodo, amet pulvinar. Semper duis egestas eu ut. Egestas dolor
            adipiscing sit eget sapien, risus, at non egestas.
          </p>
        </div>
      </div>
    </Layout>
  );
}
