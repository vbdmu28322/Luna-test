// // __tests__/SignUpForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import SignUpForm from '@/components/Auth/SignUpForm';
import { auth, storage } from '../firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import '@testing-library/jest-dom';
import { mocked } from 'jest-mock';
import { format } from 'date-fns';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../firebase/firebase', () => ({
  auth: {},
  storage: {},
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));


jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
}));

jest.mock('date-fns', () => ({
  format: jest.fn(),
}));
describe('SignUpForm', () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push,
    });
  });


  it('サインアップフォムが正確にレンダリングされるか？', () => {
    render(<SignUpForm />);

    expect(screen.getByPlaceholderText('ユーザー名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('パスワード')).toBeInTheDocument();
    expect(screen.getByText('登録')).toBeInTheDocument();
  });
  it('すべてのフィルドが満ちている時サインアップボタンが活性化されるか？', () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText('ユーザー名'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('パスワード'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('birthdate-input'), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByTestId('gender-select'), {
      target: { value: 'male' },
    });
    fireEvent.change(screen.getByLabelText(/利用規約に同意する/), {
      target: { checked: true },
    });

    expect(screen.getByText('登録')).not.toBeDisabled();
  });

  it('サインアップに成功した時ダッシュボードに移動するのか？', async () => {
    const mockUser = { uid: '12345' };

    mocked(createUserWithEmailAndPassword).mockResolvedValueOnce({
      user:  mockUser,
    } as any);
    mocked(format).mockReturnValueOnce('2024-07-18T00:00:00Z');

    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText('ユーザー名'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('パスワード'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('birthdate-input'), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByTestId('gender-select'), {
      target: { value: 'male' },
    });
    fireEvent.change(screen.getByLabelText(/利用規約に同意する/), {
      target: { checked: true },
    });

    fireEvent.click(screen.getByText('登録'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(push).toHaveBeenCalledWith('/');
    });
  });

  it('サインアップで失敗した時正確にログを残るのか？', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({
      code: 'auth/email-already-in-use',
    });

    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText('ユーザー名'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('パスワード'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('birthdate-input'), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByTestId('gender-select'), {
      target: { value: 'male' },
    });
    fireEvent.change(screen.getByLabelText(/利用規約に同意する/), {
      target: { checked: true },
    });

    fireEvent.click(screen.getByText('登録'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(consoleSpy).toHaveBeenCalledWith('auth/email-already-in-use');
    });
  });

});

