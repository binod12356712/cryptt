import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Nav({ open }) {
  const navigate = useNavigate();

  const handleDashboard = async () => {
    console.log(localStorage.authToken);
    try {
      const response = await axios.post(
        "https://trcnfx.com/dashboard/dashboard",
        { Token: localStorage.authToken },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const json = response.data;
      console.log("response we get");
      console.log(json);
      navigate("/dashboard", { state: { id: json.id } });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleTrade = () => {
    navigate("/trade");
  };
  const handleResult = () => {
    navigate("/result");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
    console.log("logged out");
  };

  return (
    <div className="fixed w-screen z-30">
      <div>
        <ul className="flex justify-between bg-[#131722] h-[70px] text-white w-[100%] p-5">
          <div>
            <li className="text-[15px] sm:text-[18px] md:text-2xl font-bold text-white">
              <Link to="/">CryptoCurrency</Link>
            </li>
          </div>
          <div className="text-[20px] font-bold text-white">
            {!localStorage.getItem("authToken") ? (
              <div className="flex">
                <li className="mx-2 text-[15px] sm:text-[18px] md:text-xl">
                  <button
                    onClick={() => open[1](true)}
                    style={{
                      backgroundColor: "transparent",
                      color: "white",
                      padding: "0px 16px",
                      cursor: "pointer",
                      transition: "background-color 0.3s, color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "green";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "white";
                    }}
                  >
                    SignIn
                  </button>
                </li>
                <li
                  className="mx-2 text-[15px] sm:text-[18px] md:text-xl"
                  style={{
                    backgroundColor: "transparent",
                    color: "white",
                    padding: "0px 16px",
                    cursor: "pointer",
                    transition: "background-color 0.3s, color 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "green";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "white";
                  }}
                >
                  <button onClick={() => open[0](true)}>SignUp</button>
                </li>
              </div>
            ) : (
              <div className="flex text-[15px] sm:text-[18px] md:text-xl">
                <li className="mx-2">
                  <button
                    onClick={handleDashboard}
                    style={{
                      backgroundColor: "transparent",
                      color: "white",
                      padding: "0px 16px",
                      cursor: "pointer",
                      transition: "background-color 0.3s, color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "orange";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "white";
                    }}
                  >
                    Dashboard
                  </button>
                </li>
                <li className="mx-2">
                  <button
                    onClick={handleTrade}
                    style={{
                      backgroundColor: "transparent",
                      color: "white",
                      padding: "0px 16px",
                      cursor: "pointer",
                      transition: "background-color 0.3s, color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "yellow";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "white";
                    }}
                  >
                    Trade
                  </button>
                </li>
                <li className="mx-2">
                  <button
                    onClick={handleResult}
                    style={{
                      backgroundColor: "transparent",
                      color: "white",
                      padding: "0px 16px",
                      cursor: "pointer",
                      transition: "background-color 0.3s, color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "yellow";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "white";
                    }}
                  >
                    Result
                  </button>
                </li>
                <li className="mx-2">
                  <button
                    onClick={handleLogout}
                    style={{
                      backgroundColor: "transparent",
                      color: "white",
                      padding: "0px 16px",
                      cursor: "pointer",
                      transition: "background-color 0.3s, color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "red";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "white";
                    }}
                  >
                    SignOut
                  </button>
                </li>
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
}
