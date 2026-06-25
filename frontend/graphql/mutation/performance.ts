import { gql } from '@apollo/client';

export const CREATE_GOAL = gql`
  mutation CreateGoal($request: CreateGoalRequestInput!) {
    createGoal(request: $request) {
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
  }
`;
