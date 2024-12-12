import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
// import './MQTTPage.css';

const socket = io("http://localhost:5000");

function MQTTPage() {
  const { id } = useParams();
  const [data, setData] = useState("Waiting for data...");
  const [ML_response, setMLrespone] = useState("No data found...");

  useEffect(() => {
    socket.on("mqttData", async (message) => {
      setData(message);
    });

    return () => socket.off("mqttData");
  }, []);

  useEffect(() => {
    if (data === "Waiting for data...") return;
    // const data =
    //   "RPM: 0.00, Temperature: 28.5687°C, Peak Frequency: 11.72 Hz, Microphone: 0.00085db, current: 5A, voltage: 412V, id: 6e783t8, ";
    console.log("printing data:  ");
    console.log(data);
    // const data = "RPM: 0.0000, Temperature: 17.8000°C, Peak Acceleration: 0.4295 m/s², Sound Voltage: 0.0999V, MotorID: M1";
    // setData(data);


    // Extract individual values using regular expressions
    try {
      const rpm = data.match(/RPM:\s([\d.]+)/)[1];
      const temperature = data.match(/Temperature:\s([\d.]+)°C/)[1];
      const peakAcceleration = data.match(/Peak Acceleration:\s([\d.]+)\s*m\/s²/)[1];
      const soundVoltage = data.match(/Sound Voltage:\s([\d.]+)V/)[1];
      const motorID = data.match(/MotorID:\s(\w+)/)[1];
      const current = parseFloat(data.match(/Current:\s([\d.]+)\s*A/)[1]);
      const voltage = parseFloat(data.match(/Volts:\s([\d.]+)\s*V/)[1]);


      //threshold value condition
      const threshold_current = 4.8; 
      if (current > threshold_current) {
        alert(`Alert: Current value (${current} A) exceeds the threshold of ${threshold_current} A.`);
      } 

      const threshold_voltage = 220;
      if(voltage > threshold_voltage){
        alert(`Alert: Voltage value (${voltage}V) exceeds the threshold of ${threshold_voltage}V.`);
      }


    const ML_URl = `http://127.0.0.1:8000/predict?Accelerometer_1=${peakAcceleration}&Microphone=${soundVoltage}&Temperature=${temperature}`;

      const fetchData = async () => {
        try {
          console.log("Fetching from URL:", ML_URl);
          const response = await fetch(ML_URl);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          console.log("ML Response:", result);
          setMLrespone(result);
        } catch (error) {
          console.error("Error fetching ML response:", error);
        }
      };

      fetchData();
    } catch (error) {
      console.error("Error processing data:", error);
    }
  }, [data]);

  return (
    <div  className="mqtt-page" style={{ padding: "20px" }}>
      <h1>MQTT Data for Booster Fan {id} </h1>
      
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>RPM</td>
          <td>{data.match(/RPM:\s([\d.]+)/)?.[1] || "N/A"}</td>
        </tr>
        <tr>
          <td>Temperature (°C)</td>
          <td>{data.match(/Temperature:\s([\d.]+)°C/)?.[1] || "N/A"}</td>
        </tr>
        <tr>
          <td>Peak Acceleration (m/s²)</td>
          <td>{data.match(/Peak Acceleration:\s([\d.]+)\s*m\/s²/)?.[1] || "N/A"}</td>
        </tr>
        <tr>
          <td>Sound Voltage (V)</td>
          <td>{data.match(/Sound Voltage:\s([\d.]+)V/)?.[1] || "N/A"}</td>
        </tr>
        <tr>
          <td>Motor ID</td>
          <td>{data.match(/MotorID:\s(\w+)/)?.[1] || "N/A"}</td>
        </tr>
        <tr>
          <td>Current (A)</td>
          <td>{data.match(/Current:\s([\d.]+)\s*A/)?.[1] || "N/A"}</td>
        </tr>
        <tr>
          <td>Voltage (V)</td>
          <td>{data.match(/Volts:\s([\d.]+)\s*V/)?.[1] || "N/A"}</td>
        </tr>
      </tbody>
    </table>

      {/* <p>Received: {data}</p> */}
      <p>Motor Health: {ML_response.prediction}</p>
    </div>
  );
}

export default MQTTPage;
