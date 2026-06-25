import { gql } from '@apollo/client';

export const CREATE_RECOGNITION = gql`
  mutation CreateRecognition($request: CreateRecognitionRequestInput!) {
    createRecognition(request: $request) {
      id
      giverId
      receiverId
      message
      category
      createdOn
    }
  }
`;
