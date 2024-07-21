import { useAuth } from '../contexts/AuthContext';
import PostForm from '../components/Post/PostForm';
import PostList from '../components/Post/PostList';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import { useRouter } from 'next/router';
import MyPosts from '@/components/Post/MyPosts';

const Mypage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
        <div>
            <Navbar/>
            <p>読み込み中...</p>
        </div>
    );
  }

  if (!user) {
    router.push("/");
  }

  return (
    <div>
        <Navbar/>
        <PostForm />
        {user?.uid && <MyPosts userId={user.uid} />}
    </div>
  );
};

export default Mypage;