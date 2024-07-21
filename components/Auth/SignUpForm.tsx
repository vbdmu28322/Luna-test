import { useState } from 'react';
import { auth, db } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { deleteObject, getDownloadURL as getStorageDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase/firebase';
import { format } from 'date-fns';
import styles from "@/styles/Auth.module.css"
import logoImage from "@/public/assets/luna_logo_color.png"
import Image from 'next/image';

interface AdditionalData {
  "birthdate" : String;
  "gender" : String;
}

const SignUpForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [profileIcon, setProfileIcon] = useState<File | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const router = useRouter();

  
  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    const addtionalData = {
      "birthdate" : birthdate,
      "gender" : gender,
    };

      createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: username,
        });
        await saveAdditionalUserData(user.uid, addtionalData);
        router.push('/');
      }).catch((error) => {
        console.log(error.code)
      })
  };

  const saveAdditionalUserData = async (userId: string, additionalData: AdditionalData) => {
    try {
      const profileImage = await uploadImage(userId, profileIcon );
      
      await setDoc(doc(db, "users", userId), {...additionalData, "profileIcon":profileImage });
      console.log("ユーザーの追加データを正確に保存しました。");
    } catch (error) {
      console.log("ユーザーの追加データ保存中エラーが発生しました。: ", error);
    }
  }

  const uploadImage = async (uid: string, profileIcon:File|null) => {
    if(profileIcon == null){
      return;
    }
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const bucket = `${process.env.NEXT_PUBLIC_STORAGEBUCKET_URL}/${uid}/${formattedDate}.jpg`;
    try {
      await uploadBytes(ref(storage, bucket), profileIcon);
      console.log("プロフィールアイコンが正確にアップロードされました。");
      return bucket;
    } catch (error) {
      console.error("プロフィールアイコンアップロード中エラーが発生しました。: ", error);
    }
}

  return (
    <>
        <div className={styles.background_panel}>
        <div className='row'>
            <div className={styles.logo}>
              <Image className={styles.logoimage} src={logoImage} alt="ここにはロゴイメージ表示されます。" />
            </div>
          </div>
          <div className='row'>
          <div className="col-s-12 col-6">
              <div className={styles.text_panel}>
                <p>メースアドレスを使って</p>
                <p>サインアップしてください。</p>
              </div>
            </div>
            <div className="col-s-12 col-6">
                <div className={styles.auth_panel}>
                  <form className={styles.authform} onSubmit={handleSignUp}>
                    <input
                      type="text"
                      placeholder="ユーザー名"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <input
                      type="email"
                      placeholder="メールアドレス"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="パスワード"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <input
                      type="date"
                      value={birthdate}
                      onChange={(e) => setBirthdate(e.target.value)}
                      required
                      data-testid="birthdate-input"
                    />
                    <select value={gender} onChange={(e) => setGender(e.target.value)} required data-testid="gender-select">
                      <option value="" disabled>性別</option>
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                      <option value="other">その他</option>
                    </select>
                    <input
                      type="file"
                      onChange={(e) => setProfileIcon(e.target.files ? e.target.files[0] : null)}
                    />
                    <label>
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        required
                      />
                      <Link className='linkText' href="https://www.notion.so/a714620bbd8740d1ac98f2326fbd0bbc?pvs=21">
                        利用規約
                      </Link>に同意する
                    </label>
                    <div className='row'>
                      <div className="col-6 col-s-12">
                        <Link href="/login">ログイン</Link>はこちら
                      </div>
                      <div className="col-6 col-s-12">
                        <button className={styles.authBtn} type="submit">登録</button>
                      </div>
                    </div>
                  </form>
                </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default SignUpForm;
