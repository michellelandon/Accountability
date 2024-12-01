import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, User } from 'lucide-react';

const CommunityBoard: React.FC = () => {
  const [posts, setPosts] = useState([
    { id: 1, author: 'Alice', content: 'Just had a great productivity session!', likes: 5, comments: 2 },
    { id: 2, author: 'Bob', content: 'Any tips for staying focused during long sessions?', likes: 3, comments: 1 },
    { id: 3, author: 'Carol', content: 'Looking for an accountability partner for daily coding sessions.', likes: 7, comments: 4 },
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      setPosts([
        { id: posts.length + 1, author: 'You', content: newPost, likes: 0, comments: 0 },
        ...posts,
      ]);
      setNewPost('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">Community Board</h2>
      <form onSubmit={handlePostSubmit} className="mb-8">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thoughts or ask for advice..."
          className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Post
        </button>
      </form>
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <User className="mr-2" size={18} />
              <span className="font-semibold">{post.author}</span>
            </div>
            <p className="mb-3">{post.content}</p>
            <div className="flex items-center text-gray-600">
              <button className="flex items-center mr-4 hover:text-blue-500">
                <ThumbsUp className="mr-1" size={16} />
                {post.likes}
              </button>
              <button className="flex items-center hover:text-blue-500">
                <MessageSquare className="mr-1" size={16} />
                {post.comments}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityBoard;