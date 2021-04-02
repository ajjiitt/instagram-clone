import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
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
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjF8fHByb2ZpbGV8ZW58MHwyfDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            alt=""
          />
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
