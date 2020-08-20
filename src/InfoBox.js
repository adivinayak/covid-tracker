import React from 'react'
import {Card,CardContent,Typography} from '@material-ui/core';
import './infoBox.css'
function InfoBox({title,cases,isRed,total,active,...props}) {
    return (
        <Card className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"} `}
        onClick={props.onClick}
        >
           <CardContent>
               <Typography className='infoBox_title' color='textSecondary'>
                   {title}
               </Typography>
    <h2 className='infoBox_cases'>{cases}</h2>
    {/* {console.log(cases)} */}
    <Typography className='infoBox_total' color='textSecondary'>
        {total} Total
    </Typography>
           </CardContent>
        </Card>
    )
}

export default InfoBox
