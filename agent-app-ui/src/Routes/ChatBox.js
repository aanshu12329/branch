import React, {useState} from 'react'
import BoxComponent from '../Component/BoxComponent'
import TextAreaComponent from '../Component/TextAreaComponent'
import { Grid, TextField, Button } from '@mui/material'
import axios from 'axios'
import { selectOptions } from '@testing-library/user-event/dist/select-options'

function ChatBox() {

    const parseLines = (value) => value.replace(/(\\n)/g, "\n");
    const addNewLine = (val1,val2) => {return(val1+ '\\n' + val2)}

    const [textValue, settextValue] = React.useState('')
    const [messageValue, setmessageValue] = React.useState('')
    const [userId, setuserId] = useState('')
    const [disableserId, setdisableserId] = useState(false)
    const [showChatAreaBox, setshowChatAreaBox] = useState(false)
    const [chatid, setchatid] = useState('')

    
    const changeMessageTextArea = (e) => {
        console.log("I was set for message")
        setmessageValue(e.target.value)}
    const changetextTextArea = (e) => {
        console.log("I was set for chat area")
        settextValue(e.target.value)}

    const changetextUserId = (e) => {
        console.log("I was set for userid area")
        setuserId(e.target.value)}

    async function buttonClick() {
        let t = textValue
        let m = messageValue
        await settextValue(parseLines(addNewLine(t,"client" + " ==:: " + messageValue)))
        await setmessageValue('')
        const body = {  chat_id: chatid,
        message: m,
        id: userId,
        sender_type: "client"
        }
        var response = await axios.post("http://localhost:3000/send-message",body)
        console.log("Send message reponse " + JSON.stringify(response))
        /*var response = await axios.get("http://localhost:3000/get-all-unresolved-chat")
        console.log("i was called user id is "+ JSON.stringify(response))*/

    }

    async function initiateChatClick()
    {
        console.log("c initiated")
        await setdisableserId(true)
        await setshowChatAreaBox(true)
        await setuserId(userId)
        const body = {user_id : userId,sender_type:'client'}
        var response = await axios.post("http://localhost:3000/initiate-chat",body)
        console.log("i " + JSON.stringify(response))
        await setchatid(response.data.chat_id)
        let messageArr = []
        if(response.data.message === "New Chat Initiated Success"){
            console.log("New Chat Initiated Succes")
            console.log(response.data.data.messages)
            messageArr = response.data.data.messages
        }else if(response.data.message === "Old Unresolved Chat"){
            console.log("Old Unresolved Chat")
            console.log(response.data.data.messages)
            messageArr = response.data.data.messages
        }
        let finalMessage = ""
        for(let i = 0 ; i < messageArr.length; i++)
        {
            let tempMessage = messageArr[i].sender_type + " ==:: " + messageArr[i].message
            var temp = addNewLine(finalMessage,tempMessage)
            finalMessage = temp
            
        }
        await settextValue(parseLines(finalMessage))
        console.log("message array length "+ messageArr.length)
        console.log("initiated chat" + response.data.message + "chat_id" + response.data.chat_id)
    }

    return (
       
        <>
            <Grid container marginLeft={70} marginBottom={2}>
                <Grid item>
                <TextField label="UserId" variant="outlined" value={userId} onChange={changetextUserId} disabled={disableserId}/>
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
                    <Button variant="contained" onClick={buttonClick} >Send</Button>
                </div>
     
            </div>:null}
        </>
        
    )
}

export default ChatBox

