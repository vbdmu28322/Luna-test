import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostItem from '../components/Post/PostItem'; 

jest.mock('../firebase/firebase', () => ({
  auth: {},
}));
describe('PostItem', () => {
  const post = {
        id: '1',
        content: 'This is a test post',
        authorId: 'user1',
        authorName: 'John Doe',
        createdAt: new Date(),
  };

  test('投稿記事が正確に表示されるか？', () => {
    render(<PostItem post={post} />);

    expect(screen.getByText('@John Doe')).toBeInTheDocument();
    expect(screen.getByText('This is a test post')).toBeInTheDocument();
  });
});
