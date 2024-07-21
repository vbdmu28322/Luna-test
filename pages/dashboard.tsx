import { useAuth } from '../contexts/AuthContext';
import PostForm from '../components/Post/PostForm';
import PostList from '../components/Post/PostList';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import { useRouter } from 'next/router';

const Dashboard: React.FC = () => {
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
      <PostList />
    </div>
  );
};

export default Dashboard;