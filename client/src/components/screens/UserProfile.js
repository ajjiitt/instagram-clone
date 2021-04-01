import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { UserContext } from "../../App";

const UserProfile = () => {
  const { state, dispatch } = useContext(UserContext);
  const [userProfile, setProfile] = useState(null);
  const { userid } = useParams();

  useEffect(() => {
    fetch(`/user/${userid}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setProfile(result);
      })
      .catch((error) => console.log(error));
  }, []);


  return (
    <>
      {userProfile ? (
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
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  width: "108%",
                  justifyContent: "space-between",
                }}
              >
                <h6>{userProfile.posts.length} Posts</h6>
                <h6>40Followers</h6>
                <h6>40Followings</h6>
              </div>
              
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
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
      ) : (
        "loading....."
      )}
    </>
  );
};

export default UserProfile;
