import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
        <div>
            <p>読み込み中...</p>
        </div>
    );
  }

  if (!user) {
    router.push("/");
  }

  return (
    <div>
      ダッシュボード
    </div>
  );
};

export default Dashboard;