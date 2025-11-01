import axios from "axios";
import { useEffect } from "react"
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const getMessage = () => {
    let dispatch = useDispatch();
    let {userData, selectedUser}=useSelector(state=>state.user)
    useEffect(() => {
        if (!selectedUser || !selectedUser._id) return;
        const fetchMessage = async () => {
            try {
                let result= await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, { withCredentials: true });
                dispatch(setMessages(result.data));
            } catch (error) {
                console.error("Error in get messages frontend:", error);
            }
        };
        fetchMessage();
    }, [selectedUser, userData])
}

export default getMessage;