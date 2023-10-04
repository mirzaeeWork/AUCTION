import React from 'react'

export default function FormInput({name,type,label,value,onChange}) {
  return (
    <div style={{marginTop:10}}>
        <label htmlFor={name}>{label}</label>
        <input type={type} name={name} value={value} onChange={onChange}/>
    </div>
  )
}
