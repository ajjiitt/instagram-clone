import React, { useState } from "react";
import { Link ,useHistory} from "react-router-dom";
import M from 'materialize-css'
const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();

  const postData = () => {
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password, email }),
    })
      .then(res => 
        res.json()
      )
      .then((data) => {
        if(data.error){
          M.toast({html: data.error,classes:'red'})
        }else{
          M.toast({html: data.message,classes:'green'}) 
          history.push('/signin')
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
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button class="btn waves-effect waves-light" onClick={() => postData()}>
          SignUp
        </button>
        <p>
          <Link to="/signin">Already have account</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
