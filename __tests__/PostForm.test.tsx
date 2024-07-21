// PostForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostForm from '@/components/Post/PostForm';


jest.mock('../firebase/firebase', () => ({
  auth: {},
}));

describe('PostForm', () => {

  test('should render the form correctly', () => {
    render(<PostForm />);
    expect(screen.getByPlaceholderText('投稿内容を入力してください（140文字以内）')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '投稿' })).toBeInTheDocument();
  });

});
