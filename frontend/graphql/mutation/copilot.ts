import { gql } from '@apollo/client';

export const SEND_COPILOT_MESSAGE = gql`
  mutation SendCopilotMessage($request: ChatRequestInput!) {
    chat(request: $request) {
      id
      role
      content
    }
  }
`;
