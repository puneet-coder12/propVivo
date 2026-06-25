import { gql } from '@apollo/client';

export const GET_ANALYTICS_REPORTS = gql`
  query GetAnalyticsReports($request: GetAllReportsRequestInput!) {
    analyticsReports(request: $request) {
      items {
        id
        title
        category
        dataJson
        generatedDate
      }
      totalCount
      pageNumber
      pageSize
    }
  }
`;
