import { Profile, useExploreProfiles, useFollow, useUnfollow } from '@lens-protocol/react-web';

import { UnauthenticatedFallback, WhenLoggedIn, WhenLoggedOut } from '../components/auth';
import { ErrorMessage } from '../components/error/ErrorMessage';
import { Loading } from '../components/loading/Loading';
import { ProfileCard } from './components/ProfileCard';

type FollowButtonProps = {
  followee: Profile;
};

function FollowButton({ followee }: FollowButtonProps) {
  const { execute: follow, error: followError, loading: isFollowLoading } = useFollow();

  const { execute: unfollow, error: unfollowError, loading: isUnfollowLoading } = useUnfollow();

  if (followee.operations.isFollowedByMe.value) {
    // or followee.operations.canFollow === TriStateValue.Yes
    return (
      <>
        <button onClick={() => unfollow({ profile: followee })} disabled={isUnfollowLoading}>
          Unfollow
        </button>
        {unfollowError && <p>{unfollowError.message}</p>}
      </>
    );
  }

  return (
    <>
      <button onClick={() => follow({ profile: followee })} disabled={isFollowLoading}>
        Follow
      </button>
      {followError && <p>{followError.message}</p>}
    </>
  );
}

function UseFollowInner() {
  const { data, error, loading } = useExploreProfiles();

  if (loading) return <Loading />;

  if (error) return <ErrorMessage error={error} />;

  return (
    <>
      {data.map((p) => (
        <section key={p.id}>
          <ProfileCard profile={p} />

          <FollowButton followee={p} />
        </section>
      ))}
    </>
  );
}

export function UseFollowAndUnfollow() {
  return (
    <>
      <h1>
        <code>useFollow / useUnfollow</code>
      </h1>
      <WhenLoggedIn>
        <UseFollowInner />
      </WhenLoggedIn>
      <WhenLoggedOut>
        <UnauthenticatedFallback />
      </WhenLoggedOut>
    </>
  );
}
