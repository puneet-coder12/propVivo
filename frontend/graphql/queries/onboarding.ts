import { gql } from '@apollo/client';

export const GET_ONBOARDING_TASKS = gql`
  query GetOnboardingTasks($request: GetAllOnboardingTasksRequestInput!) {
    onboardingTasks(request: $request) {
      items {
        id
        userId
        phase
        title
        isCompleted
      }
      totalCount
      pageNumber
      pageSize
    }
  }
`;
