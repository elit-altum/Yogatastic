import React, { useEffect, useState } from "react";
import qs from "qs";
import axios from "axios";
import Header from "./Header";

const Pose = ({ pose, number = 1 }) => {
  return (
    <div className="pose">
      <img
        className="pose-image"
        src={pose.image_url}
        alt={`${pose.name}'s image`}
      />
      <div className="pose-details">
        <h2>{`0${number}. ${pose.name}`}</h2>
        <p className="pose-difficulty">{pose.difficulty}</p>
        <div className="post-benefits">{pose.benefits}</div>
      </div>
    </div>
  );
};

const defaultRequest = {
  difficulty: "",
  helps_with: "",
  body_area: "",
};

const sampleStatements = [
  "Show me beginner level poses to relieve stress.",
  "How can I rejuvenate my body ?",
  "Show me poses to help with headaches.",
  "Help me stretch my legs & lower back.",
  "What can I do to strengthen my joints ?",
  "Help me get a better posture.",
  "Poses to help relieve menstrual cramps",
  "Poses to stretch your spine & neck.",
  "What can I do if I have anxiety ?",
  "Find poses for the carpal tunnel syndrome.",
  "Poses to help with high thyroid.",
  "Find poses to help with pregnancy.",
  "Show me only intermediate level poses.",
  "Poses to help with blood circulation.",
  "How can I cope with insomnia ?",
];

const Microphone = () => {
  let sampleStatementsIndex = 0;
  const [poses, setPoses] = useState([]);
  const [isRequested, setIsRequested] = useState(false);
  const [statement, setStatement] = useState(
    sampleStatements[sampleStatementsIndex]
  );

  let lastLoad = "";
  let requestObject = {};

  const fetchPoses = async (req) => {
    if (req.difficulty) {
      requestObject.difficulty = req.difficulty;
    }

    requestObject.helpsWith = req.helps_with || "";
    requestObject.bodyArea = req.body_area || "";

    setIsRequested(false);
    try {
      const res = await axios({
        url: "/api/v1/poses/findPose",
        method: "POST",
        data: requestObject,
      });
      setPoses(res.data.data.poses);
      setIsRequested(true);
    } catch (e) {
      console.log(e.response);
      setIsRequested(true);
    }
  };

  useEffect(() => {
    fetchPoses(defaultRequest);
    setInterval(() => {
      const result = document.getElementById("result").textContent;
      if (result !== lastLoad) {
        lastLoad = result;
        fetchPoses(qs.parse(result, { delimiter: "\n" }));
      }
    }, 2000);

    setInterval(() => {
      sampleStatementsIndex =
        sampleStatementsIndex === sampleStatements.length - 1
          ? 0
          : sampleStatementsIndex + 1;

      setStatement(sampleStatements[sampleStatementsIndex]);
    }, 4000);
  }, []);

  return (
    <div>
      <Header />
      <div className="main-body">
        <div className="opening">
          <div className="intro">
            <h1 className="opening-heading-1">Cure Yourself</h1>
            <h1 className="opening-heading-2">With Yoga.</h1>
            <p className="opening-tag-line">
              Discover yoga poses and their benefits specific to your needs.
            </p>
            <p>Interact openly and freely using your voice.</p>
          </div>

          <div className="sample-commands">
            <h3>Try Saying:</h3>
            <p className="sample-command-box">{`"${statement}"`}</p>
          </div>
        </div>
        <div className="body-poses">
          {isRequested &&
            (!!poses.length ? (
              poses.map((pose, index) => (
                <Pose pose={pose} number={index + 1} key={pose.id} />
              ))
            ) : (
              <p className="poses-not-found">
                No Poses Found. <br /> Please Try Again 😢
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Microphone;
