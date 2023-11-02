import axios from "axios";
import React, { useEffect, useState } from "react";
import {Navigate, useParams } from "react-router-dom";
import { differenceInCalendarDays } from "date-fns";

export const PlacePage = () => {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
  const [numberOfGuests, setNumberOfGuest] = useState(1);

  const [name, setName] = useState();
  const [phone, setPhone] = useState();

  const [redirect, setRedirect] = useState();


  let numberOfDays = 0;
  if (checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((res) => {
      setPlace(res.data);
    });
  }, [id]);

  const bookThisPlace = async()=>{
    const  token = localStorage.getItem('token')
    const data = {checkIn, checkOut,numberOfGuests, name, phone, place:place._id, price:numberOfDays * place.price, token}
    await axios.post('/bookingThisPlace', data).then((res)=>{
        const bookingId = res.data._id;
        setRedirect(`/account/bookings/${bookingId}`)

    })

  }

  if(redirect){
    return <Navigate to={redirect}/>
  }

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 fixed bg-black text-white min-h-screen">
        <div className="p-8 grid gap-4 bg-black ">
          <div>
            <h2 className="text-3xl mr-48">Photos of {place.title}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed right-8 top-8 flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black  bg-white text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
              Close Photos
            </button>
          </div>
          <div className="mx-auto">
            {place?.photos?.length > 0 &&
              place.photos.map((photo) => (
                <div className="mt-2">
                  <img
                    src={"http://localhost:4000/uploads/" + photo}
                    alt="loading"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (!place) return "";

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <a
        className="my-3 block font-semibold underline flex gap-1"
        target="_blank"
        href={"https://maps.google.com/?q=" + place.address}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>

        {place.address}
      </a>

      <div className="reletive">
        <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-2xl overflow-hidden">
          <div>
            {place.photos?.[0] && (
              <div>
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-cover cursor-pointer"
                  src={"http://localhost:4000/uploads/" + place.photos[0]}
                  alt="loading"
                />
              </div>
            )}
          </div>
          <div className="grid">
            {place.photos?.[1] && (
              <img
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square object-cover cursor-pointer"
                src={"http://localhost:4000/uploads/" + place.photos[1]}
                alt="loading"
              />
            )}
            <div className=" overflow-hidden">
              {place.photos?.[2] && (
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-cover relative top-2 cursor-pointer"
                  src={"http://localhost:4000/uploads/" + place.photos[2]}
                  alt="loading"
                />
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="flex gap-1 absolute bg-white rounded-2xl shadow shadow-md shadow-gray-500 bottom-2 right-2 py-2 px-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
              clip-rule="evenodd"
            />
          </svg>
          Show more photo{" "}
        </button>
      </div>

      <div className="mt-8 mb-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl ">Description</h2>
            {place.description}
          </div>
          Check-In {place.checkIn} <br />
          Check-Out {place.checkOut} <br />
          Max number of guest {place.maxGuests}
        </div>
        <div>
          <div className="bg-white shadow  p-4 rounded-2xl">
            <div className="text-2xl text-center">
              price: ${place.price} / per night
            </div>
            <div className="border rounded-2xl  mt-4">
              <div className="flex">
                <div className="py-3 px-4">
                  <label>Check In :</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(ev) => setCheckIn(ev.target.value)}
                  />
                </div>
                <div className="py-3 px-4 border-l">
                  <label>Check out :</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(ev) => setCheckOut(ev.target.value)}
                  />
                </div>
              </div>
              <div className="py-3 px-4 border-t">
                <label>Number of guest :</label>
                <input
                  type="number"
                  value={numberOfGuests}
                  onChange={(ev) => setNumberOfGuest(ev.target.value)}
                />
              </div>
              {numberOfDays > 0 && (
                <div className="">
                  <div className="py-3 px-4 border-t">
                    <label>Your Full name :</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(ev) => setName(ev.target.value)}
                    />
                    <label>Phone Number :</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(ev) => setPhone(ev.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <button onClick={bookThisPlace} className="primary mt-4">
              Book this place
              {numberOfDays > 0 && <span> ${numberOfDays * place.price}</span>}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 broder-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>

        <div className="mb-4 mt-2 onClick={()=> setShowAllPhotos(true)} text-sm text-gray-700 leading-5 mt-2">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
};
