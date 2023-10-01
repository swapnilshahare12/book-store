import React, { useEffect, useState } from "react";
import "../Pagescss/Myorders.css";
import Footer from "../components/Footer";
import Copyright from "../components/Copyright";
import tickIcon from "../assets/tick.svg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import Cookies from "js-cookie";

const Myorders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [myOrders, setMyOrders] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  //getting userData state from redux store
  const user = useSelector((state) => {
    return state.userData;
  });


  //success notification
  const success = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  //error notification
  const error = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  //warning notification
  const warning = (message) => {
    messageApi.open({
      type: "warning",
      content: message,
    });
  };

  
  useEffect(() => {
    window.scrollTo(0, 0);
    const token = Cookies.get("jwt");
    if (token) {
      axios
        .post(
          "/user-auth",
          {
            token,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            dispatch({ type: "setUser", payload: res.data.userDetails });
          } else {
            error("Please login your account");
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    } else {
      error("Please login your account");
      navigate("/");
    }

    axios
      .get("/get-all-orders")
      .then((res) => {
        if (res.data.success) {
          setMyOrders(res.data.orders);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredMyOrders = myOrders?.filter((filteredOrder) => {
    return filteredOrder.userId === user?._id;
  });
  return (
    <>
    {contextHolder}
      {myOrders ? (
        filteredMyOrders.length > 0 ? (
          <div className="myorders">
            <table className="orders">
              <tr>
                <th>Serial No.</th>
                <th>Order ID</th>
                <th>Book Image</th>
                <th>Price</th>
                <th>Book Name</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
              {filteredMyOrders.map((order, index) => {
                return (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order._id}</td>
                    <td className="ordered-image-container">
                      <img
                        className="ordered-image"
                        src={order.bookImage}
                        alt=""
                      />
                    </td>
                    <td>$ {order.bookPrice}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {order.bookName}
                    </td>
                    <td>{order.quantity}</td>
                    <td>
                      <img src={tickIcon} alt="" className="tickicon" />
                      {order.status}
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        ) : (
          <div className="empty-wishlist">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/confusing-woman-due-to-empty-cart-4558760-3780056.png"
              alt=""
              loading="lazy"
            />
            <h1>You have not ordered yet!</h1>
            <h2>Order something to make me Happy!!</h2>
          </div>
        )
      ) : (
        ""
      )}

      <Footer />
      <Copyright />
    </>
  );
};

export default Myorders;
