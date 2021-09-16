import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";

import { isLoggedInVar } from "../apollo";
import { isMe } from "../__generated__/isMe";

const IS_ME_QUERY = gql`
  query isMe {
    isMe {
      id
      name
      username
      email
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
      observers {
        id
        username
        avatar
      }
      subjects {
        id
        username
        avatar
      }
      totalFollowers
      totalFollowing
    }
  }
`;

function useUser() {
  const hasToken = useReactiveVar(isLoggedInVar);
  const { error, data, refetch, loading } = useQuery<isMe>(IS_ME_QUERY, {
    skip: !hasToken,
  });

  useEffect(() => {
    refetch();
    return () => {};
  }, [data]);
  return { data, refetch, loading };
}

export default useUser;
