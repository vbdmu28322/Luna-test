import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth } from '@/contexts/AuthContext';
import PostItem from '@/components/Post/PostItem';

jest.mock('../firebase/firebase', () => ({
    auth: {},
    db: jest.fn()
}));

jest.mock('../contexts/AuthContext');

describe('PostItem Component', () => {
    const post = {
        id: '1',
        content: 'This is a test post',
        authorId: 'user1',
        authorName: 'John Doe',
        createdAt: new Date(),
    };

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ user: { uid: 'user1' } });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('投稿内容が表示されるか？', () => {
        render(<PostItem post={post} />);
        expect(screen.getByText('@John Doe')).toBeInTheDocument();
        expect(screen.getByText('This is a test post')).toBeInTheDocument();
    });

    it('ユーザが作成者である投稿に削除ボタンが表示されるか？', () => {
        render(<PostItem post={post} />);
        expect(screen.getByText('削除')).toBeInTheDocument();
    });

    it('does not show delete button if user is not the author', () => {
        (useAuth as jest.Mock).mockReturnValue({ user: { uid: 'user2' } });
        render(<PostItem post={post} />);
        expect(screen.queryByText('削除')).not.toBeInTheDocument();
    });

});
