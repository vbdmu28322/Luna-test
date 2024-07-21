import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import styles from "@/styles/Post.module.css"
import { Post } from './PostList';

interface PostItemProps {
    post: Post;
  }

const PostItem: React.FC<PostItemProps> = ({post}) => {
    
  const { user } = useAuth();
  console.log(post);
    const handleDelete = async (id: string) => {
        if (!user) return;
    
        try {
          const postDoc = doc(db, 'posts', id);
          await deleteDoc(postDoc);
        } catch (error) {
          console.log("Error deleting post: ", error);
        }
      };
        return (
            <div className={styles.article} key={post.id}>
                {user?.uid === post.authorId && <button className={styles.deletePost} onClick={() => handleDelete(post.id)}>削除</button>}
                <p className={styles.author}>@{post?.authorName}</p>
                <p className={styles.content}>{post?.content}</p>
            </div>
        );
    }

    export default PostItem;