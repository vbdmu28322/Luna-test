import { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, where } from 'firebase/firestore';
import styles from "@/styles/Post.module.css"
import PostItem from './PostItem';

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: any;
}

interface PostListProps {
  userId: string; 
}

const MyPosts: React.FC<PostListProps> = ({userId}) => {
  const [posts, setPosts] = useState<Post[]>([]);
console.log(userId);
useEffect(() => {
  const q = query(
    collection(db, 'posts'),
    where("authorId", "==", userId),
    orderBy('createdAt', 'desc')
  );
  onSnapshot(q, (snapshot) => {
    const postsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
    setPosts(postsData);
  });

}, [userId]);

return (
  <div className={styles.articlePanel}>
    {posts.map((post) => (
      <PostItem key={post.id} post={post} />
    ))}
  </div>
);
};

export default MyPosts;
