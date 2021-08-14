import { gql, useQuery, useReactiveVar } from "@apollo/client";

import { isLoggedInVar } from "../apollo";
import { isMe } from "../__generated__/isMe";

const IS_ME_QUERY = gql`
  query isMe {
    isMe {
      id
      username
      avatar
      bio
      rank
      exp
      maxExp
      todayTime
      sunday
      monday
      tuesday
      wednesday
      thursday
      friday
      saturday
      weekTime
      monthTime
      totalTime
    }
  }
`;

function useUser() {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { error, data, refetch } = useQuery<isMe>(IS_ME_QUERY, {
    skip: !hasToken,
  });

  return { data, refetch };
}

export default useUser;
