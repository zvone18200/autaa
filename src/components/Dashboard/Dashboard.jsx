import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        try {
          const response = await axios.get(`http://localhost:5001/reservations/${user.id}`);
          setReservations(response.data);
        } catch (error) {
          console.error('Error fetching reservations:', error);
        }
      }
    };

    fetchReservations();
  }, []);

  const handleDelete = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:5001/reservations/${reservationId}`);
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5 text-center dark:text-white">My Reservations</h1>
      {reservations.length > 0 ? (
        <ul className="space-y-4">
          {reservations.map((reservation) => (
            <li key={reservation.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-xl font-semibold dark:text-white">Car: {reservation.carName}</p>
              <div className="text-lg">
                <p className="font-medium dark:text-gray-300">Start Date: 
                  <span className="ml-2 dark:text-white">{new Date(reservation.start_date).toLocaleDateString()}</span>
                </p>
                <p className="font-medium dark:text-gray-300">End Date: 
                  <span className="ml-2 dark:text-white">{new Date(reservation.end_date).toLocaleDateString()}</span>
                </p>
              </div>
              <p className="text-lg font-bold dark:text-white">
                Total Price: ${(
                  reservation.carPrice *
                  (new Date(reservation.end_date) - new Date(reservation.start_date)) /
                  (1000 * 60 * 60 * 24)
                ).toFixed(2)}
              </p>
              <button
                onClick={() => handleDelete(reservation.id)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              >
                Delete Reservation
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-xl dark:text-white">No reservations found.</p>
      )}
    </div>
  );
};

export default Dashboard;
