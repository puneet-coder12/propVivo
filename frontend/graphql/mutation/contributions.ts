import { gql } from '@apollo/client';

export const CREATE_CONTRIBUTION = gql`
  mutation CreateContribution($request: CreateContributionRequestInput!) {
    createContribution(request: $request) {
      id
      userId
      title
      description
      category
      points
      status
    }
  }
`;
