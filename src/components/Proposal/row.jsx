import React from "react";
import thumbsUpImage from "../../assets/img/thumbs_up.svg";
import thumbsDownImage from "../../assets/img/thumbs_down.svg";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";
export default function ProposalRow({
  progress,
  pathColor,
  title,
  timeRemaining,
  vote,
  id
}) {
  // console.log("path color", pathColor);

  return (
    <div className="props__row">
      <div className="props__row__left">
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            // Rotation of path and trail, in number of turns (0-1)
            rotation: 0,

            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: "butt",

            // Text size
            textSize: "16px",

            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 0.5,

            // Can specify path transition in more detail, or remove it entirely
            // pathTransition: 'none',

            // Colors
            pathColor: `${pathColor}`,
            textColor: "#f88",
            trailColor: "#d6d6d6",
            backgroundColor: "#3e98c7"
          })}
        />
        <Link to={`/proposal/detail/${id}`}>
          <div className="info">
            <h3>{title}</h3>
            <h2>{timeRemaining}</h2>
          </div>
        </Link>
      </div>
      <div className="props__row__right">
        <div className="vote">
          <img src={thumbsUpImage} alt="up" className="grow" />
          <p>{vote}</p>
          <img src={thumbsDownImage} alt="cown" className="grow" />
        </div>
      </div>
    </div>
  );
}

ProposalRow.defaultProps = {
  progress: 0,
  pathColor: "#F2C94C",
  title: "",
  timeRemaining: ""
};
