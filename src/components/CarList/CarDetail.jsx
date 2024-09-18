import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [days, setDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/cars/${id}`);
        setCar(response.data);
        setTotalPrice(response.data.price * days);
      } catch (error) {
        console.error("Error fetching car:", error);
      }
    };

    fetchCar();
  }, [id, days]);

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate - startDate;
    const daysDiff = timeDiff / (1000 * 3600 * 24) + 1;
    return daysDiff > 0 ? daysDiff : 1;
  };

  const handleReservation = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please log in to make a reservation");
        return navigate("/login");
      }

      const response = await axios.post("http://localhost:5001/reservations", {
        userId: user.id,
        carId: car.id,
        startDate,
        endDate,
      });

      if (response.status === 200) {
        alert("Reservation successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error making reservation:", error);
      alert("Failed to make reservation. Please try again.");
    }
  };

  if (!car) return <p>Loading car details...</p>;

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-3">{car.name}</h1>
      <p className="text-xl mb-3">Price per day: ${car.price}</p>
      <p className="text-xl mb-3">Mileage: {car.mileage} km</p>
      <div className="mb-3">
        <label htmlFor="startDate" className="block mb-2">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            if (endDate) {
              const daysDiff = calculateDays(e.target.value, endDate);
              setDays(daysDiff);
              setTotalPrice(car.price * daysDiff);
            }
          }}
          className="border rounded p-2 w-full"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="endDate" className="block mb-2">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            if (startDate) {
              const daysDiff = calculateDays(startDate, e.target.value);
              setDays(daysDiff);
              setTotalPrice(car.price * daysDiff);
            }
          }}
          className="border rounded p-2 w-full"
        />
      </div>
      <p className="text-xl font-bold mb-3">Total Price: ${totalPrice.toFixed(2)}</p>
      <button onClick={handleReservation} className="bg-blue-500 text-white p-2 rounded">Reserve Now</button>
    </div>
  );
};

export default CarDetail;
