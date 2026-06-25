import { gql } from '@apollo/client';

export const CREATE_ONBOARDING_TASK = gql`
  mutation CreateOnboardingTask($request: CreateOnboardingTaskRequestInput!) {
    createOnboardingTask(request: $request) {
      id
      userId
      phase
      title
      isCompleted
    }
  }
`;
