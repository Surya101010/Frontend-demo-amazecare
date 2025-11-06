import React from 'react'

function AddPatient() {
    
    async function add(){
        const token = localStorage.getItem("token");
        const response = await axios.post((BACKEND_URL)+"api/patients",{
            headers :{ Authorization: "Bearer "+localStorage.getItem("token")}
        })
    }
  return (
    <div>AddPatient</div>
  )
}

export default AddPatient