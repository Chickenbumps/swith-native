import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";

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
      weekTime
      monthTime
      totalTime
      totalNumberOfTime
      timePerNumber
      numberPerTime
      time {
        id
        timeValue
        updatedAt
        dayName
      }
    }
  }
`;

function useUser() {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { error, data, refetch } = useQuery<isMe>(IS_ME_QUERY, {
    skip: !hasToken,
  });

  useEffect(() => {
    refetch();
    return () => {};
  }, [data]);
  return { data, refetch };
}

export default useUser;
