import React, {useState, useEffect} from 'react'
import axios from 'axios'
import RowComponent from '../Component/RowComponent'
import { ListItem } from '@mui/material'

function ListBox() {

    let messageObjectArr = []
    
    const [msgArr, setmsgArr] = useState([])
    
    useEffect(() => {
        const fetchProducts = async () => {
            var response = await axios.get("http://localhost:3000/get-all-unresolved-chat")
            console.log("i was called user id is "+ JSON.stringify(response))
            messageObjectArr = response.data.list
            await setmsgArr(messageObjectArr)
          }
          fetchProducts()
        
    }, [])

    return (
        <div>
            <ul>
                {msgArr.map(item => (
                <RowComponent key={item._id} chat_id={item.chat_id}  user_id={item.user_id} messages={item.messages}></RowComponent>
                ))}
            </ul>
        </div>
    )
}

export default ListBox
