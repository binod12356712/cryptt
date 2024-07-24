import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

export default function Market() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=true";

  const [info, setInfo] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const getFilteredItem = (query, item) => {
    if (!query) {
      return item;
    }

    return item.filter((val) => {
      return val.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
  };

  const filtered = getFilteredItem(query, info);

  return (
    <div className="pt-[100px] bg-[#171b26]">
      {/* <Nav /> */}
      <div className="w-[100px] grad_bg blur-[220px] right-[10px] h-[100px] absolute border-2 rounded-full"></div>
      <div className="p-7 w-[70%] sticky top-[70px] bg-[#1b202d] mx-auto text-center">
        <div className="">
          <input
            id="searchInput"
            type="text"
            placeholder="Search crypto here"
            className="w-[90%] rounded-md p-2 font-semibold"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="w-[70%] mx-auto min-h-screen bg-[#1b202d] p-6 items-center">
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto">
            {filtered.map((value, key) => {
              return (
                <div key={key}>
                  <Link
                    to={{ pathname: "/coin", hash: `${value.name}` }}
                    state={{ value }} // Pass state data here
                  >
                    <div className="bg-[#1b202d] rounded-md shadow-md p-5 shadow-[#000000be] m-3 w-[180px] border-t-2 border-[#00000050]">
                      <div className="mx-auto w-[100px] h-[100px] ">
                        <img src={value.image} alt="" />
                      </div>
                      <div className="p-1 text-center text-white font-medium">
                        <h3>Name- {value.name}</h3>
                        <p>Value- {value.current_price}</p>
                        <h3>Up- {value.high_24h}</h3>
                        <h3>Down- {value.low_24h}</h3>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
