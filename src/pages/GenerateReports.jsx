import React, { useRef, useState } from 'react'
import Button from '../components/Button'
import axios from 'axios'
import { BACKEND_URL } from '../Config'
import GenerateReportsCard from '../cards/GenerateReportsCard';

function GenerateReports() {
    const [data,setData] =useState([]);
    async function generate(){
        const token = localStorage.getItem("token");
        const response = await axios.get((BACKEND_URL)+"api/medicalrecords",{
            headers :{ Authorization: "Bearer "+localStorage.getItem("token")}
        })
        const a = (response.data);
        setData(a);
        console.log(a);
    }
    return (
    <div>
        <Button text={"generate reports"} onclick={generate} />
        <GenerateReportsCard records={data} />
    </div>
  )
}

export default GenerateReports