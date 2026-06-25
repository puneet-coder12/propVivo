import { gql } from '@apollo/client';

export const CREATE_JOB_POSTING = gql`
  mutation CreateJobPosting($request: CreateJobPostingRequestInput!) {
    createJobPosting(request: $request) {
      id
      title
      description
      department
      location
      status
    }
  }
`;
