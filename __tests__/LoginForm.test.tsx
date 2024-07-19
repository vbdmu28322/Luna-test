// __tests__/LoginForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import LoginForm from '@/components/Auth/LoginForm';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { mocked } from 'jest-mock';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../firebase/firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

describe('LoginForm', () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push,
    });
  });

  it('ログインフォムが正確にレンダリングされるかを確認する', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('パスワード')).toBeInTheDocument();
    expect(screen.getByText('ログイン')).toBeInTheDocument();
  });

  it('メールとパースワードを入力する時ログインボタンが活性化されるか？', () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('パスワード'), {
      target: { value: 'password123' },
    });

    expect(screen.getByText('ログイン')).not.toBeDisabled();
  });

  it('メールとパースワードが入力しない時ログインボタンが活性化されないか？', () => {
    render(<LoginForm />);

    expect(screen.getByText('ログイン')).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });

    expect(screen.getByText('ログイン')).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('メールアドレス'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText('パスワード'), {
      target: { value: 'password123' },
    });

    expect(screen.getByText('ログイン')).toBeDisabled();
  });

  it('ログインに成功した時ダッシュボードに移動するのか？', async () => {
    mocked(signInWithEmailAndPassword).mockResolvedValueOnce({
      user: { uid: '12345' },
    } as any);

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('パスワード'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('ログイン'));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
    expect(await screen.findByText('ログイン')).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith('/');
  });

  it('ログインで失敗した時正確にログを残るのか？', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    mocked(signInWithEmailAndPassword).mockRejectedValueOnce({
      code: 'auth/wrong-password',
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('メールアドレス'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('パスワード'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByText('ログイン'));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'wrongpassword');
    await screen.findByText('ログイン');
    expect(consoleSpy).toHaveBeenCalledWith('auth/wrong-password');
  });
});
