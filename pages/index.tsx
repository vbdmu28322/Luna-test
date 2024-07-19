import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (!user) {
    router.push("/login");
  }else{
    router.push("/dashboard");
  }
};

export default Home;
