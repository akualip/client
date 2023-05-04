import React from "react";
import { Link } from "react-router-dom";

function Landingscreen() {
    return (

        <div className="row landing justify-content-center">

            <div className="col-md-9 my-auto text-center">

                <h2 style={{color:'white', fontSize:'130px',}}>Hotel Abu</h2>
                <h1 style={{color:'white', marginTop:'300px'}}>"Just Come And Sleep, Okay..."</h1>

                <Link to="/home">
                    <button className="btn landingbtn" style={{color:'black'}}>Get Started</button>
                </Link>

                <div className="box">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

            </div>

        </div>

    )
}

export default Landingscreen;