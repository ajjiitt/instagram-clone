import { useState, useEffect, useContext } from "react";
import React from "react";
import { UserContext } from "../../App";
import { useHistory, Link } from "react-router-dom";
const Home = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/allpost", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setData(result.posts);
      });
  }, []);
  const likeUnlikePosts = (id, check) => {
    if (check) {
      fetch("/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          const newData = data.map((item) => {
            if (JSON.stringify(item._id) === JSON.stringify(result._id)) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      fetch("/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          const newData = data.map((item) => {
            if (item._id === result._id) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
    console.log("delete");
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="home">
      {data.map((item) => {
        console.log(item);
        return (
          <div className="card home-card" key={item._id}>
            <h5>
              <Link
                to={
                  item.postedBy._id === state._id
                    ? `/profile`
                    : `/profile/${item.postedBy._id}`
                }
              >
                {item.postedBy.name}
              </Link>

              {item.postedBy._id === state._id && (
                <i
                  onClick={() => deletePost(item._id)}
                  className="material-icons "
                  style={{ color: "red", float: "right" }}
                >
                  delete
                </i>
              )}
            </h5>

            <div className="card-image">
              <img src={item.photo} alt="" />
            </div>
            <div className="card-content">
              <div style={{ display: "flex" }}>
                {item.likes.includes(state._id) ? (
                  <i
                    onClick={() => {
                      likeUnlikePosts(item._id, false);
                    }}
                    className="material-icons "
                    style={{ color: "red" }}
                  >
                    favorite
                  </i>
                ) : (
                  <i
                    onClick={() => {
                      likeUnlikePosts(item._id, true);
                    }}
                    className="material-icons "
                    style={{ color: "red" }}
                  >
                    favorite_border
                  </i>
                )}

                <h6 style={{ marginLeft: "10px" }}>
                  {item.likes.length} Likes
                </h6>
              </div>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}
                    </span>
                    {"  "}
                    {record.text}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="add comments" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
