import { gql } from '@apollo/client';

export const GET_TRAINING_MODULES = gql`
  query GetTrainingModules($request: GetAllTrainingModulesRequestInput!) {
    trainingModules(request: $request) {
      items {
        id
        title
        description
        category
        contentUrl
        isMandatory
      }
      totalCount
      pageNumber
      pageSize
    }
  }
`;
