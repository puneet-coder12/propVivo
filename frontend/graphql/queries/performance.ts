import { gql } from '@apollo/client';

export const GET_GOALS = gql`
  query GetGoals($request: GetAllGoalsRequestInput!) {
    goals(request: $request) {
      items {
        id
        userId
        title
        description
        category
        weight
        targetValue
        currentValue
        status
        startDate
        endDate
      }
      totalCount
      pageNumber
      pageSize
    }
  }
`;
