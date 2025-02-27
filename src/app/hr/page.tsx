"use client"

import {useState, useEffect} from "react"

export default function HRPage(){
    const [employees, setEmployees] = useState([])

    useEffect(()=>{
        async function fetchEmployees(){
            const res = await fetch('/api/employees')
            const data = await res.json()
            if(data.success){
                setEmployees(data.data)
            }
        }
        fetchEmployees()
    }
    ,[])

    return (
        <div>
      <h1>HR Module</h1>
      {employees.length > 0 ? (
        employees.map((emp: any) => (
          <div key={emp._id}>
            <p>{emp.name} - {emp.position} in {emp.department}</p>
          </div>
        ))
      ) : (
        <p>No employees available.</p>
      )}
    </div>
    )
}