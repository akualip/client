import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2';

function Bookingscreen({ match }) {
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();
    const [room, setroom] = useState();

    let { roomid, fromdate, todate } = useParams();
    fromdate = moment(fromdate, 'DD-MM-YYYY');
    todate = moment(todate, 'DD-MM-YYYY');

    const totaldays = moment.duration(todate.diff(fromdate)).asDays() + 1;
    const [totalamount, settotalamount] = useState();

    useEffect(() => {
        const fetchData = async () => {
            if(!localStorage.getItem('currentUser')){
                window.location.reload='/login'
            }

            try {
                setloading(true);
                const data = (await axios.post("/api/rooms/getroombyid", { roomid: roomid })).data;

                settotalamount(data.rentperday * totaldays);
                setroom(data);
                setloading(false);
                console.log(data);
            } catch (error) {
                seterror(true);
                console.log(error);
                setloading(false);
            }
        };
        fetchData();
    }, []);

    async function onToken(token) {
        console.log(token)
        const bookingDetails = {
            room,
            userid: JSON.parse(localStorage.getItem('currentUser'))._id,
            fromdate,
            todate,
            totalamount,
            totaldays,
            token
        }
        try {
            setloading(true);
            const result = await axios.post('/api/bookings/bookroom', bookingDetails)
            setloading(false);
            Swal.fire('Congratulations', 'Your Room Booked Successfully', 'success').then(result=>{
                window.location.href='/bookings'
            })
        } catch (error) {
            setloading(false)
            Swal.fire('Oops', 'Something Went Wrong', 'error')
        }
    }

    return (
        <div className="m-5 justify-content-center">
            {loading ? (
                <Loader />
            ) : room ? (
                <div>
                    <div className="row justify-content-center mt-5 bs">
                        <div className="col-md-5">
                            <h1>{room.name}</h1>
                            <img src={room.imageurls[0]} className="bigimg" />
                        </div>
                        <div className="col-md-5">
                            <div style={{ textAlign: "right" }}>
                                <h1>Booking Details</h1>
                                <hr />

                                <b>
                                    <p>Name : {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                                    <p>From Date : {fromdate.format('DD-MM-YYYY')}</p>
                                    <p>To Date : {todate.format('DD-MM-YYYY')}</p>
                                    <p>Max Count : {room.maxcount}</p>
                                </b>
                            </div>

                            <div style={{ textAlign: "right" }}>
                                <b>
                                    <h1>Amount</h1>
                                    <hr />
                                    <p>Total days : {totaldays} </p>
                                    <p>Rent per day : {room.rentperday}</p>
                                    <p>Total Amount : {totalamount}</p>
                                </b>
                            </div>

                            <div style={{ float: "right" }}>
                                <StripeCheckout
                                    amount={totalamount * 100}
                                    token={onToken}
                                    currency="INR"
                                    stripeKey="pk_test_51MvpjrBW9KfdJIYMd816kQnuy9cD2K3XbxLH7qAmI1XAjmDHio2pW1Fr8K0FibNHFgmncgtzuqtcc4NAaJVw2hpw00vGKuSAOG"
                                >
                                    <button className="btn btn-primary">Pay Now{" "}</button>

                                </StripeCheckout>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Error />
            )}
        </div>
    );
}

export default Bookingscreen;
