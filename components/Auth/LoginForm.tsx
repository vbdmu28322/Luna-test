import { useState } from 'react';
import { auth } from '../../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from "@/styles/Auth.module.css"
import logoImage from "@/public/assets/luna_logo_color.png"
import Image from 'next/image';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const isDisabled = () => !email || !password;
  
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(()=>{
        router.push('/');
      }).catch ((error)=>{
        console.log(error.code);
      })
  };

  return (
    <>
      <>
        <div className={styles.background_panel}>
          <div className='row'>
            <div className={styles.logo}>
              <Image className={styles.logoimage} priority src={logoImage} alt="ここにはロゴイメージ表示されます。" />
            </div>
          </div>
          <div className='row'>
            <div className="col-s-12 col-6">
              <div className={styles.text_panel}>
                <p>メースアドレスを使って</p>
                <p>ログインしてください。</p>
              </div>
            </div>
            <div className="col-s-12 col-6">
              <div className={styles.auth_panel}>
                <form className={styles.authform} onSubmit={handleLogin}>
                  <label htmlFor="email" >メールアドレス</label>
                  <input
                    type="email"
                    id='email'
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="password">パスワード</label>
                  <input
                    type="password"
                    id='password'
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className='row'>
                    <div className="col-6 col-s-12">
                      <Link href="/signup">新規登録</Link>はこちら
                    </div>
                    <div className="col-6 col-s-12">
                      <button className={styles.authBtn} disabled={isDisabled()} type="submit">ログイン</button>
                    </div>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </>
      
    </>
    
  );
};

export default LoginForm;
