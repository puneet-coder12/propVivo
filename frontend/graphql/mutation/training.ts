import { gql } from '@apollo/client';

export const CREATE_TRAINING_MODULE = gql`
  mutation CreateTrainingModule($request: CreateTrainingModuleRequestInput!) {
    createTrainingModule(request: $request) {
      id
      title
      description
      category
      contentUrl
      isMandatory
    }
  }
`;
