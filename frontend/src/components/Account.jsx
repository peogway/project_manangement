import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserFn } from "../reducers/userReducer";
import Heading from "./Heading";

const Account = ({ user }) => {
  const dispatch = useDispatch();
  return (
    <div className="z-999 flex flex-row h-screen flex-1 overflow-auto left-[60px] max-w-[calc(100vw-60px)]  relative">
      <Heading name="Account" user={user} />
    </div>
  );
};

export default Account;
