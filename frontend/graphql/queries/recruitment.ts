import { gql } from '@apollo/client';

export const GET_JOB_POSTINGS = gql`
  query GetJobPostings($request: GetAllJobPostingsRequestInput!) {
    jobPostings(request: $request) {
      items {
        id
        title
        description
        department
        location
        status
      }
      totalCount
      pageNumber
      pageSize
    }
  }
`;
