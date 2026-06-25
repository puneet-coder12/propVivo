import { gql } from '@apollo/client';

export const GET_RECOGNITIONS = gql`
  query GetRecognitions($request: GetAllRecognitionsRequestInput!) {
    recognitions(request: $request) {
      items {
        id
        giverId
        receiverId
        message
        category
        createdOn
      }
      totalCount
      pageNumber
      pageSize
    }
  }
`;
