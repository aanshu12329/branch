import React, {useEffect, useState,useRef} from 'react'
import TextAreaComponent from '../Component/TextAreaComponent'
import { Grid, TextField, Button } from '@mui/material'
import axios from 'axios';
import { io } from 'socket.io-client';


function RowComponent(props) {

    const parseLines = (value) => value.replace(/(\\n)/g, "\n");
    const addNewLine = (val1,val2) => {return(val1+ '\\n' + val2)}

    const [disableserId, setdisableserId] = useState(false)
    const [showChatAreaBox, setshowChatAreaBox] = useState(false)
    const [textValue, settextValue] = React.useState('')
    const [messageValue, setmessageValue] = React.useState('')
    const [chatid, setchatid] = useState('')

    const socket = io("http://localhost:3000",  { transports: ['websocket'] });

    useEffect(() => {
        /*socket.on('connect', function() {
            console.log('Connected');
            socket.emit('message', {room: '12345' });
          });

        socket.on("msgToClient", data => {
            console.log("i was called from server with room " + JSON.stringify(data))
        });*/

        const fetchProducts = async () => {
            let messageArr = props.messages
            let finalMessage = ""
            for(let i = 0 ; i < messageArr.length; i++)
            {
                let tempMessage = messageArr[i].sender_type + " ==:: " + messageArr[i].message
                var temp = addNewLine(finalMessage,tempMessage)
                finalMessage = temp
                
            }
            await settextValue(parseLines(finalMessage))
          }
          fetchProducts()
        
    }, [])

    useEffect(() => {
        const fetchProducts = async (sender_type,message) => {
            const t = textValue
            console.log("previous value of t "+ t)
            await settextValue(parseLines(addNewLine(t,sender_type + " ==:: " + message)))
            console.log(textValue)
          }

        socket.on('connect', function() {
            console.log('Connected Agent ' + chatid);
            socket.emit('message', {room: chatid });
          });

        socket.on("msgToClient", data => {
            console.log("i was called from server with room " + JSON.stringify(data))
            fetchProducts(data.sender_type, data.message)
        });
        
    }, [chatid])
    
    useEffect(()=>{
            console.log("()" + textValue)
    },[textValue])
    const changetextTextArea = (e) => {
        console.log("I was set for chat area")
        settextValue(e.target.value)
    }

    const changeMessageTextArea = (e) => {
        console.log("I was set for message")
        setmessageValue(e.target.value)
    }

    async function initiateChatClick() {
        await setchatid(props.user_id)
        await setshowChatAreaBox(true)
    }

    async function buttonClick() {
        console.log("Button Click")
        let t = textValue
        let m = messageValue
        //await settextValue(parseLines(addNewLine(t,"agent" + " ==:: " + messageValue)))
        await setmessageValue('')
        const body = { room : chatid,
        chat_id: props.chat_id,
        message: m,
        id: "a-id-12", 
        sender_type: "agent"
        }
        await socket.emit('messageToServer', body)
        //var response = await axios.post("http://localhost:3000/send-message",body)
        //console.log("Send message reponse " + JSON.stringify(response))
        console.log("Button Click 2")
        /*var response = await axios.get("http://localhost:3000/get-all-unresolved-chat")
        console.log("i was called user id is "+ JSON.stringify(response))*/

    }

    return (
        <>
            <Grid container marginLeft={70} marginBottom={2}>
                <Grid item>
                <TextField label="UserId" variant="outlined" value={props.user_id} disabled={disableserId}/>
                </Grid>

                <Grid item alignItems="stretch" style={{ display: "flex" }}>
                <Button  variant="contained" onClick={initiateChatClick} disabled={disableserId}>
                    InitiateChat
                </Button>
                </Grid>
            </Grid>
            
            { showChatAreaBox ? 
            <div>
                <div>
                <TextAreaComponent value={textValue} h={400} func={changetextTextArea}></TextAreaComponent>
                </div>
                <div>
                    <TextAreaComponent value={messageValue} h={50} func={changeMessageTextArea}></TextAreaComponent>
                </div>
                <div>
                    <Button variant="contained" onClick={buttonClick}>Send</Button>
                </div>
     
            </div>:null}
            
        </>
    )
}

export default RowComponent
