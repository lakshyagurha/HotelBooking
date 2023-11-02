import React, { useEffect, useState } from "react";
import { AccountNav } from "./AccountNav";
import { Perks } from "./Perks";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export const PlacesFormPage = () => {
    const {id} = useParams();
    
    const [title , setTitle] = useState('');
    const [address , setAddress] = useState('');
    const [addedPhotos , setAddedPhotos] = useState([]);
    const [photoLink , setPhotoLink] = useState('');
    const [perks , setPerks] = useState([]);
    const [description , setDescription] = useState('');
    const [extraInfo , setExtraInfo] = useState('');
    const [checkIn , setCheckIN] = useState('');
    const [checkOut , setCheckOut] = useState('');
    const [maxGuest , setMaxGuest] = useState(1);
    const [price, setPrice] = useState(100)
    const [redirect , setRedirect] = useState(false)
    
    useEffect(()=>{
        if(!id) {
            return ;

        }
        axios.get('/places/'+id).then((res)=>{
            const {data} = res
            setTitle(data.title)
            setAddress(data.address)
            setAddedPhotos(data.photos)
            setDescription(data.description)
            setPerks(data.perks)
            setExtraInfo(data.extraInfo)
            setCheckIN(data.checkIn)
            setCheckOut(data.checkOut)
            setMaxGuest(data.maxGuest)
            setPrice(data.price)

        })
    }, [id])

    async function addPhotoByLink(ev) {
        ev.preventDefault()
        two();

    }

    async function savePlaces(ev) {
        ev.preventDefault();
        const token = localStorage.getItem('token')

        const placeData = {
            title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuest, token,price
        }
        if(id){
            //update
            console.log("this is /places" + token)
            axios.put('/places', 
            { id , ...placeData})
    
            setRedirect(true)
        }else{
            //new place
            console.log("this is /places" + token)
            axios.post('/places', placeData)
    
            setRedirect(true)
        }
  

    }



    if(redirect){
        return <Navigate to={'/account/places'} />
    }

    async function two(){

        await axios.post('/uploadbylink', {link:photoLink} ).then((res)=>{
            console.log(res.data)
    
            setAddedPhotos(prev =>{
                return [...prev, res.data]
            })

            setPhotoLink('')
            message.success('image link successfully added')
        })

    }

    function uploadphoto(ev){
        ev.preventDefault();
        const files = ev.target.files;
        
        const data = new FormData();
        for(let i = 0; i<files.length; i++){
            data.append('photos', files[i]);
        }
        axios.post('/upload', data, {
            headers: {'Content-type' : 'multipart/form-data'}
        }).then(res =>{
            const {data:filenames} = res;
            setAddedPhotos(prev =>{
                return [...prev, ...filenames]
            })
        })

    }

    const removePhoto = (e,filename)=>{
        e.preventDefault()
        // const updatedPhotos = addedPhotos.filter(photo => photo !== filename);
        // setAddedPhotos(updatedPhotos)
        // ([...addedPhotos.filter(photo => photo !== filename)])
        const updatedPhotos = addedPhotos.filter(photo => photo !== filename);
        setAddedPhotos(updatedPhotos); 

    }

    const selectMainPhoto = (e,filename) =>{
        e.preventDefault()
        const addedPhotosWithoutSelected = addedPhotos.filter(photo => photo !== filename)
        const newAddedPhoto = [filename,...addedPhotosWithoutSelected]
        setAddedPhotos(newAddedPhoto)
    }
  return (
    <>
    <AccountNav/>
      <div className="p-4 m-16">
        <form onSubmit={savePlaces}>
          <h2 className="text-2xl mt-4">Title</h2>
          <p className="text-gray-500 text-sm">
            title for you place. should be short and catchy{" "}
          </p>
          <input
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            placeholder="title, For Example : My Lovely APT"
          />
          <h2 className="text-2xl mt-4">address</h2>
          <p className="text-gray-500 text-sm">Address to this place </p>
          <input
            type="text"
            value={address}
            placeholder="address"
            onChange={(ev) => setAddress(ev.target.value)}
          />
          <h2 className="text-2xl mt-4">Photos</h2>
          <p className="text-gray-500 text-sm">More = better</p>
          <div className="flex gap-2">
            <input
              type="text"
              id="photolink"
              placeholder={"Add Using a link.... jpeg"}
              value={photoLink}
              onChange={(ev) => {
                setPhotoLink(ev.target.value);
              }}
            />
            <button
              onClick={addPhotoByLink}
              className="bg-gray-200 px-4 rounded-2xl"
            >
              Add&nbsp;Photo
            </button>
          </div>
          <div className=" mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {addedPhotos.length > 0 &&
              addedPhotos.map((Link) => (
                <div className="h-32 flex relative" key={Link}>
                  <img
                    key={Date.now}
                    className="rounded-2xl w-full object-cover "
                    src={"http://127.0.0.1:4000/uploads/" + Link}
                    alt="loading"
                  />
                  <button onClick={(e)=> removePhoto(e , Link)} className="cursor-pointer absolute bottom-1  right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3">

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>

                  </button>
                  <button onClick={(e)=> selectMainPhoto(e , Link)} className="cursor-pointer absolute bottom-1  left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3">
                    {Link === addedPhotos[0] && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                      </svg>
                      
                    )}
                    {Link !== addedPhotos[0] && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>

                    )}




                </button>
                </div>
              ))}

            <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600 ">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={uploadphoto}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                />
              </svg>
              Upload
            </label>
          </div>
          <h2 className="text-2xl mt-4">Description</h2>
          <p className="text-gray-500 text-sm">
            Description of the place. How you discribe it
          </p>
          <textarea
            className=""
            value={description}
            onChange={(ev) => {
              setDescription(ev.target.value);
            }}
          ></textarea>

          <h2 className="text-2xl mt-4">Perks</h2>
          <p className="text-gray-500 text-sm">
            Select all the perks of your place
          </p>
          <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <Perks selected={perks} onChange={setPerks} />
          </div>
          <h2 className="text-2xl mt-4">Extra Information</h2>
          <p className="text-gray-500 text-sm">house Rules Extra</p>
          <textarea
            value={extraInfo}
            onChange={(ev) => {
              setExtraInfo(ev.target.value);
            }}
          />
          <h2 className="text-2xl mt-4">Check In&Out times, max guest</h2>
          <p className="text-gray-500 text-sm">
            Add check in and out times remember to have some time window for
            cleaning room between guests
          </p>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mt-2 -mb-1">Check in time</h3>
              <input
                type="text"
                placeholder="12:00 AM"
                value={checkIn}
                onChange={(ev) => {
                  setCheckIN(ev.target.value);
                }}
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Check out time</h3>
              <input
                type="text"
                placeholder="12:00 PM"
                value={checkOut}
                onChange={(ev) => {
                  setCheckOut(ev.target.value);
                }}
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Max number to guests</h3>
              <input
                type="number"
                placeholder="5"
                value={maxGuest}
                onChange={(ev) => {
                  setMaxGuest(ev.target.value);
                }}
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Price per night</h3>
              <input
                type="number"
                placeholder="5"
                value={price}
                onChange={(ev) => {
                  setPrice(ev.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <button className="primary my-4">Save</button>
          </div>
        </form>
      </div>
    </>
  );
};
