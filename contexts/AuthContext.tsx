import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signOut as firebaseSignout, User } from 'firebase/auth';
import { MouseEventHandler } from 'react'; 
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextProps {
  user: User | null;
  additionalUserData: object | null;
  loading: boolean;
  Logout: MouseEventHandler<HTMLButtonElement>;
}

interface AuthProviderProps {
    children: ReactNode;
  }

const AuthContext = createContext<AuthContextProps>({ 
  user: null, 
  additionalUserData: {},
  loading: true, 
  Logout: async ()=>{} 
});


export const AuthProvider: React.FC<AuthProviderProps> = ({ children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [additionalUserData, setAdditionalUserData] = useState<object>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if(user){
        const docRef = doc(db,"users", user.uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          setAdditionalUserData(docSnap.data());
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const Logout: MouseEventHandler<HTMLButtonElement> = (event)  =>{
      firebaseSignout(auth)
      .then(()=>{
        setUser(null);
        setLoading(false);
      });
      
  }
  return (
    <AuthContext.Provider value={{ user, additionalUserData, loading, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
