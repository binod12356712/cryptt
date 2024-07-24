import React, { useState } from "react";
import axios from "axios";

export default function LoginModal({ closemod }) {
  const [credentials, setCredentials] = useState({
    first_name: "",
    last_name: "",
    age: "",
    mob: "",
    email: "",
    password: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const eventHandler = async () => {
    try {
      const response = await axios.post(
        "https://trcnfx.com/register/createuser",
        credentials
      );

      if (response.data.userExist) {
        alert("User already exists");
      } else if (!response.data.success) {
        alert("Enter correct credentials");
      } else {
        localStorage.setItem("authToken", response.data.authToken);

        // Create wallet with zero balance for new user
        await axios.post("https://trcnfx.com/api/wallet", {
          userId: response.data.userId,
          symbol: "usd",
          amount: 0,
        });

        setLoggedIn(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loggedIn) {
    closemod[0](false);
    return null;
  }

  return (
    <div className="w-[100%] fixed top-0 h-full snap-none z-50 bg-[#131722c3]">
      <div className="text-black bg-white rounded-md border-2 border-white w-[70%] md:w-[50%] mx-auto mt-[40px] md:mt-[200px]">
        <button
          onClick={() => closemod[0](false)}
          className="font-bold ml-5 mt-3"
        >
          X
        </button>
        <h1 className="text-center p-1 font-bold text-[18px] sm:text-[25px]">
          Welcome to our Cryptofolio!
        </h1>
        <form className="grid grid-cols-1 md:grid-cols-2 p-3">
          <div className="flex p-2 justify-between m-1 flex-wrap">
            <label htmlFor="first_name" className="font-semibold">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={credentials.first_name}
              onChange={onChange}
              className="text-black bg-[#cfcfcf]"
            />
          </div>
          <div className="flex p-2 justify-between m-1 flex-wrap">
            <label htmlFor="last_name" className="font-semibold">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={credentials.last_name}
              onChange={onChange}
              className="text-black bg-[#cfcfcf]"
            />
          </div>
          <div className="flex p-2 justify-between m-1 flex-wrap">
            <label htmlFor="age" className="font-semibold">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={credentials.age}
              onChange={onChange}
              className="text-black bg-[#cfcfcf]"
            />
          </div>
          <div className="flex p-2 justify-between m-1 flex-wrap">
            <label htmlFor="mob" className="font-semibold">
              Mobile Number
            </label>
            <input
              type="number"
              id="mob"
              name="mob"
              value={credentials.mob}
              onChange={onChange}
              className="text-black bg-[#cfcfcf]"
            />
          </div>
          <div className="flex p-2 justify-between m-1 flex-wrap">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              className="text-black bg-[#cfcfcf]"
            />
          </div>
          <div className="flex p-2 justify-between m-1 flex-wrap">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="text"
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              className="text-black bg-[#cfcfcf]"
            />
          </div>
        </form>
        <div className="text-center mx-auto font-semibold">
          <button
            onClick={() => {
              closemod[1](true);
              closemod[0](false);
            }}
          >
            Already a user...?
          </button>
        </div>
        <div className="text-center mx-auto font-semibold m-3 bg-[#131722] rounded-md text-white w-[100px] p-1 hover:bg-[#414141]">
          <button onClick={eventHandler}>Signup</button>
        </div>
      </div>
    </div>
  );
}
