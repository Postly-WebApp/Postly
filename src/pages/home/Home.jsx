import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import React, { useState } from "react";
import "./home.css";
import { useNavigate } from "react-router";
export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const onVerify = async () => {
    console.log();
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify", {
        method: "GET",

        credentials: "include",
      });

      console.log(response.body);
      if (response.ok) {
        console.log("Login successful");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Login request failed:", error);
    }
  };
  onVerify();
  return (
    <>
      <Topbar setSearchTerm={setSearchTerm} />

      <div className="homeContainer">
        <Sidebar />
        <Feed searchTerm={searchTerm} />
        <Rightbar />
      </div>
    </>
  );
}
