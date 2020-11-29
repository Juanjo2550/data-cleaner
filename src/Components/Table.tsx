import React from "react";
import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar} from 'recharts';

export default function Table ({data}) {
  return (
    <>
      <BarChart width={270} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke='#E8E8E8'/>
        <YAxis stroke='#E8E8E8' />
        <Tooltip />
        <Bar dataKey="válidos"  fill="#59B655" />
        <Bar dataKey="inválidos" fill="#CA3B33" />
      </BarChart>
    </>
  )
}