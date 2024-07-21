import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/firebase';
import { addDoc, collection } from 'firebase/firestore';
import styles from "@/styles/Post.module.css"

const PostForm: React.FC = () => {
  const [content, setContent] = useState('');
  const { user, additionalUserData } = useAuth();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (content.length > 140) {
      alert("投稿は140文字以内にしてください。");
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        content,
        authorId: user?.uid,
        authorName: user?.displayName,
        addUserInfo : additionalUserData,
        createdAt: new Date(),
      });
      setContent('');
      alert("正確に投稿しました。");
    } catch (error) {
      console.log("Error adding post: ", error);
    }
  };

  return (
    <div>
        <form className={styles.postForm} onSubmit={handleSubmit}>
          <textarea
            className={styles.postField}
            value={content}
            rows={6}
            onChange={(e) => setContent(e.target.value)}
            placeholder="投稿内容を入力してください（140文字以内）"
            required
          />
          <div className="row">
            <button className={styles.postBtn} type="submit">投稿</button>
          </div>
        </form>
    </div>
    
  );
};

export default PostForm;
