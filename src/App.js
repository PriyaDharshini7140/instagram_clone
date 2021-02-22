import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from "./Firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import Imageupload from './ImageUpload';
import InstagramEmbed from "react-instagram-embed";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openSignin, setopenSignin]= useState(false);
  const [Posts, setPosts] =useState([]);
  const [open, setOpen] = useState(false);
  const [Username, setUsername] =useState("");
  const [Email, setEmail] =useState("");
  const [Password, setPassword] =useState("");
  const [User, setUser] = useState(null)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if (authUser) {
        console.log(authUser);
        setUser(authUser)
      }
      else{
           setUser(null)
      }
return ()=>{
  unsubscribe();
}


    })
   }, [User,Username])
useEffect(()=>{
       db.collection('insta').orderBy("timestamp","desc").onSnapshot((snapshot) =>
       setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })))
     );
},[])

const signUp = (event)=>{
  event.preventDefault();
  auth.createUserWithEmailAndPassword(Email,Password)
  .then((authUser)=>{
   return authUser.user.updateProfile({
      displayName:Username
    })
  })
  .catch((error)=> alert(error.message))
  setOpen(false)
}

const signIn=(event)=>{
event.preventDefault();
auth.signInWithEmailAndPassword(Email,Password)
.catch((error)=> alert(error.message))
setopenSignin(false)
}

  return (
    <div className="app">


  <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
       <form className="app_signup"> 
      <center>
       <img className='app_headerImage'
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
         </center>
      <Input
              placeholder="userName"
              type="text"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
            />
      <Input
              placeholder="email"
              type="text"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Sign Up</Button>
     
      </form>
    </div>
      </Modal>
      <Modal
        open={openSignin}
        onClose={()=> setopenSignin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
       <form className="app_signup"> 
      <center>
       <img className='app_headerImage'
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
         </center>
      <Input
              placeholder="email"
              type="text"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Sign In</Button>
     
      </form>
    </div>
      </Modal>
       <div className="app_header">
        <img className='app_headerImage'
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
      {User ? (<Button onClick={()=> auth.signOut()}>LogOut</Button>):(
       <div className="app_logincontainer">
        <Button onClick={()=> setopenSignin(true)}>Sign In</Button>
       <Button onClick={()=> setOpen(true)}>Sign Up</Button>
       </div>
        
      )}
      </div>
     {/* <h1>INSTA CLONE</h1> */}
     <div className="app_posts">
       <div className="app__postsLeft">
       {Posts.map(({ id, post }) => (
              <Post
                
                key={id}
                postId={id}
                userName={post.userName}
                user={User}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            ))}
       </div>
     
            <div className="app__postsRight">
            <InstagramEmbed
  url='https://instagr.am/p/Zw9o4/'
  clientAccessToken='123|456'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
          </div>
     </div>
     
      
            {User?.displayName ? (
  <div className="app__upload">
   <Imageupload username={User.displayName}/>
  </div>
) : (
  <center>
    <h3>Login to upload</h3>
  </center>
)}
</div>
  );
}

export default App;

