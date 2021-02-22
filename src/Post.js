import React, { useEffect, useState } from 'react'
import "./Post.css";
import {db} from "./Firebase";
import firebase from "firebase";
import Avatar from '@material-ui/core/Avatar';
function Post({postId,userName,caption,imageUrl,user}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    useEffect(() => {
        let unsubscribe;
        if (postId) {
          unsubscribe = db
            .collection("insta")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp","desc")
            .onSnapshot((snapshot) => {
              setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
  
        return () => {
          unsubscribe();
        };
      }, [postId]);

      const postComment=(event)=>{

        event.preventDefault();

        db.collection("insta").doc(postId).collection("comments").add({
          text: comment,
          userName: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment("");
      };
  

      
    return (
        <div className="post">
            <div className="post_header">
           <Avatar className="post_avatar" alt="priya" src="/static/images/avatar/1.jpg" />
           <h3>{userName}</h3>
           </div>
            <img className="post_image" src={imageUrl}></img>
             <h4 className="post_text"><strong>{userName}</strong>  {caption}</h4>
             <div className="post__comments">
          {comments.map((comment) => (
            <p>
              <b><strong>{comment.userName}</strong></b> {comment.text}
            </p>
          ))}
        </div>
        {user && (
          <form className="post__commentBox">
            <input
              className="post__input"
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              disabled={!comment}
              className="post__button"
              type="submit"
              onClick={postComment}
            >
              Post
            </button>
          </form>
        )}
        </div>
    )
}

export default Post
