import api from './api';
import { Comment, CommentResponse } from '../types';

export const getComments = async (productId: number): Promise<CommentResponse> => {
  const response = await api.get<CommentResponse>(`/comments/product/${productId}`);
  return response.data;
};

export const addComment = async (productId: number, content: string): Promise<Comment> => {
  console.log('Adding comment:', { productId, content });
  const response = await api.post<Comment>(`/comments/product/${productId}/user/${localStorage.getItem('userId')}`, { content });
  console.log('Comment response:', response.data);
  return response.data;
}; 