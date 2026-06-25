import { gql } from '@apollo/client';

export const GET_CONTRIBUTIONS = gql`
  query GetContributions($request: GetAllContributionsRequestInput!) {
    contributions(request: $request) {
      items {
        id
        userId
        title
        description
        category
        points
        status
      }
      totalCount
      pageNumber
      pageSize
    }
  }
`;
