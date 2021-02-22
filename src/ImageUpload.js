import { Button } from '@material-ui/core';
import firebase from "firebase";
import React,{useState} from 'react';
import { storage, db } from "./Firebase";
import './imageUpload.css'

function Imageupload({username}) {
    const [Caption, setCaption]= useState("");
    const [Image, setImage]= useState(null);
    const [Progress, setProgress]= useState(0);
    const [url, setUrl] = useState("");

    const handleChange = (e) => {
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
      };
      const handleUpload = () => {
        const uploadTask = storage.ref(`images/${Image.name}`).put(Image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // progress function ...
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            // Error function ...
            console.log(error);
          },
          () => {
            // complete function ...
            storage
              .ref("images")
              .child(Image.name)
              .getDownloadURL()
              .then((url) => {
                setUrl(url);
    
                // post image inside db
                db.collection("insta").add({
                  imageUrl: url,
                  caption: Caption,
                  userName: username,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
    
                setProgress(0);
                setCaption("");
                setImage(null);
              });
          }
        );
      };

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={Progress} max="100" />
            <input type="text" placeholder="Enter a Caption.." onChange={e => setCaption(e.target.value)} value={Caption}/>
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default Imageupload
