import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CarList = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:5001/cars");
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="pb-24">
      <div className="container">
        <h1 className="text-3xl sm:text-4xl font-semibold font-serif mb-3">Available Cars</h1>
        <p className="text-sm pb-10">Choose from our selection of cars for your rental needs.</p>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
            {cars.map((car) => (
              <div key={car.id} className="space-y-3 border-2 border-gray-300 hover:border-primary p-3 rounded-xl relative group">
                <Link to={`/cars/${car.id}`} className="block space-y-2">
                  <h1 className="text-primary font-semibold">{car.name}</h1>
                  <div className="flex justify-between items-center text-xl font-semibold">
                    <p>${car.price}/Day</p>
                  </div>
                  <p className="text-xl font-semibold">{car.mileage} Km</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <Link to="/cars">
        <div className="grid place-items-center mt-8">
          <button className="button-outline">Get Started</button>
        </div>
        </Link>
      </div>
    </div>
  );
};

export default CarList;
