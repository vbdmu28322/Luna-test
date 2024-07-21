import { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import styles from "@/styles/Post.module.css"
import PostItem from './PostItem';

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: any;

}
const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))  as Post[];
      setPosts(postsData);
    });

  }, []);

  

  return (
    <div className={styles.articlePanel}>
      <h1>Articles</h1>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
          
      ))}
    </div>
  );
};

export default PostList;
