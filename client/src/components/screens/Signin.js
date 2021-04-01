import React, { useState ,useContext} from "react";
import {UserContext} from '../../App'
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";


const Signin = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext);

  const postData = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "red" });
          history.push("/signin");
        } else {
          M.toast({ html: "User signedIn", classes: "green" });
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({type:"User",payload:data.user})
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button class="btn waves-effect waves-light" onClick={() => postData()}>
          Login
        </button>
        <p>
          <Link to="/signup">Dont have account</Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
