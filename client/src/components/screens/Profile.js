import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  const { state, dispatch } = useContext(UserContext);
  const [pic, setPic] = useState([]);
  useEffect(() => {
    fetch("/mypost", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPic(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "omen123");

      fetch("https://api.cloudinary.com/v1_1/omen123/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem(
                "user",
                JSON.stringify({
                  ...state,
                  pic: result.pic,
                })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [image]);
  const updatePhoto = async (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "solid 1px grey",
        }}
      >
        <div>
          <img
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "80px",
            }}
            src={
              state
                ? state.pic
                : "https://res.cloudinary.com/omen123/image/upload/v1617388397/pcoplxipnaalpwhhefuv.png"
            }
            alt=""
          />
          <div className="file-field input-field" style={{ margin: "10px" }}>
            <div className="btn #64b5f6 blue darken-1">
              <span>Update profile pic</span>
              <input
                type="file"
                onChange={(e) => updatePhoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </div>
        <div>
          <h4>{state ? state.name : "loading..."}</h4>
          <h4>{state ? state.email : "loading..."}</h4>
          <div
            style={{
              display: "flex",
              width: "108%",
              justifyContent: "space-between",
            }}
          >
            <h6>{pic.length} Posts</h6>
            <h6>{state ? state.followers.length : "0 "} Followers</h6>
            <h6>{state ? state.following.length : "0 "} Following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {pic.map((item) => {
          return (
            <img
              className="item"
              key={item._id}
              src={item.photo}
              alt={item.title}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
