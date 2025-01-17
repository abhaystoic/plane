import { FC } from "react";
import useSWR from "swr";
import { observer } from "mobx-react-lite";
// components
import { IssueReaction } from "../reactions";
// hooks
import { useMobxStore } from "lib/mobx/store-provider";
// types
import { RootStore } from "store/root";

interface IIssueCommentReaction {
  workspaceSlug: any;
  projectId: any;
  user: any;

  comment: any;
  issueCommentReactionCreate: (commentId: string, reaction: string) => void;
  issueCommentReactionRemove: (commentId: string, reaction: string) => void;
}

export const IssueCommentReaction: FC<IIssueCommentReaction> = observer((props) => {
  const { workspaceSlug, projectId, user, comment, issueCommentReactionCreate, issueCommentReactionRemove } = props;

  const { issueDetail: issueDetailStore }: RootStore = useMobxStore();

  const handleCommentReactionCreate = (reaction: string) => {
    if (issueCommentReactionCreate && comment?.id) issueCommentReactionCreate(comment?.id, reaction);
  };

  const handleCommentReactionRemove = (reaction: string) => {
    if (issueCommentReactionRemove && comment?.id) issueCommentReactionRemove(comment?.id, reaction);
  };

  useSWR(
    workspaceSlug && projectId && comment && comment?.id ? `ISSUE+PEEK_OVERVIEW_COMMENT_${comment?.id}` : null,
    () => {
      if (workspaceSlug && projectId && comment && comment.id) {
        issueDetailStore.fetchIssueCommentReactions(workspaceSlug, projectId, comment?.id);
      }
    }
  );

  const issueReactions = issueDetailStore?.getIssueCommentReactionsByCommentId(comment.id) || [];

  return (
    <div>
      <IssueReaction
        issueReactions={issueReactions}
        user={user}
        issueReactionCreate={handleCommentReactionCreate}
        issueReactionRemove={handleCommentReactionRemove}
        position="top"
      />
    </div>
  );
});
