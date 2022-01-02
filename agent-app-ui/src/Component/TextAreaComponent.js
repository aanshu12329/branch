import TextareaAutosize from '@mui/base/TextareaAutosize';

import React from 'react'

export default function TextAreaComponent(props) {
    return (
        <TextareaAutosize
            aria-label="maximum height"
            placeholder=""
            value={props.value}
            style={{ width: 400 ,height:props.h}}
            onChange={props.func}
        />
    )
}
