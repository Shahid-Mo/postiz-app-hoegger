'use client';

import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { Button } from '@gitroom/react/form/button';
import { FC, useCallback, useMemo, useState } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { ClientInfoModal } from './client-info-modal';
import { useClientInfo } from '@gitroom/frontend/hooks/use-client-info';
export const RenderComponents: FC<{
  postId: string;
  initialComments?: any[];
}> = (props) => {
  const { postId, initialComments } = props;
  const fetch = useFetch();
  const { clientInfo, hasClientInfo, saveClientInfo, isLoading: isClientInfoLoading } = useClientInfo();
  const [showClientModal, setShowClientModal] = useState(false);
  const [pendingComment, setPendingComment] = useState<string>('');
  
  const comments = useCallback(async () => {
    return (await fetch(`/public/posts/${postId}/comments`)).json();
  }, [postId]);
  
  const { data, mutate, isLoading } = useSWR(`comments-${postId}`, comments, {
    fallbackData: initialComments ? { comments: initialComments } : undefined,
  });
  
  const mapUsers = useMemo(() => {
    return (data?.comments || []).reduce(
      (all: any, current: any) => {
        all.users[current.userId] = all.users[current.userId] || all.counter++;
        return all;
      },
      {
        users: {},
        counter: 1,
      }
    ).users;
  }, [data]);
  
  const { handleSubmit, register, setValue } = useForm();
  
  const submitComment = useCallback(async (commentText: string, clientName?: string, clientEmail?: string) => {
    await fetch(`/public/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: commentText,
        clientName,
        clientEmail,
      }),
    });
    mutate();
  }, [postId, mutate, fetch]);
  
  const submit: SubmitHandler<FieldValues> = useCallback(
    async (e) => {
      const commentText = e.comment;
      setValue('comment', '');
      
      if (!hasClientInfo && !isClientInfoLoading) {
        // Show modal to collect client info
        setPendingComment(commentText);
        setShowClientModal(true);
      } else {
        // Submit comment with existing client info
        await submitComment(commentText, clientInfo?.name, clientInfo?.email);
      }
    },
    [hasClientInfo, isClientInfoLoading, clientInfo, submitComment, setValue]
  );
  
  const handleClientInfoSubmit = useCallback(
    async (info: { name: string; email: string }) => {
      saveClientInfo(info);
      setShowClientModal(false);
      
      // Submit the pending comment with the new client info
      if (pendingComment) {
        await submitComment(pendingComment, info.name, info.email);
        setPendingComment('');
      }
    },
    [saveClientInfo, submitComment, pendingComment]
  );
  
  const handleModalClose = useCallback(() => {
    setShowClientModal(false);
    setPendingComment('');
  }, []);

  const t = useT();

  if (isLoading) {
    return <></>;
  }
  return (
    <>
      <div className="mb-6 flex space-x-3">
        <form className="flex-1 space-y-2" onSubmit={handleSubmit(submit)}>
          <textarea
            {...register('comment', {
              required: true,
            })}
            className="flex w-full px-3 py-2 h-[98px] text-sm ring-offset-background placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none text-white bg-third border border-tableBorder placeholder-gray-500 focus:ring-0"
            placeholder={hasClientInfo ? `Add a comment as ${clientInfo?.name}...` : "Add a comment..."}
            defaultValue={''}
          />
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {hasClientInfo ? (
                <span>
                  {t('commenting_as', 'Commenting as:')} <span className="text-white">{clientInfo?.name}</span>
                </span>
              ) : (
                <span>{t('first_comment_info', 'You\'ll be asked for your name and email on first comment')}</span>
              )}
            </div>
            <Button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-send me-2 h-4 w-4"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
              {t('post', 'Post')}
            </Button>
          </div>
        </form>
      </div>
      <div className="space-y-4">
        {!!data.comments.length && (
          <h3 className="text-lg font-semibold">{t('comments', 'Comments')}</h3>
        )}
        {data.comments.map((comment: any) => (
          <div
            key={comment.id}
            className="flex space-x-3 border-t border-tableBorder py-3"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold">
                  {comment.isAnonymous && comment.clientName
                    ? comment.clientName
                    : comment.isAnonymous
                    ? t('anonymous_user', 'Anonymous User')
                    : `${t('user', 'User')} ${mapUsers[comment.userId]}`}
                </h3>
                {comment.isAnonymous && (
                  <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                    {t('guest', 'Guest')}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-300">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <ClientInfoModal
        isOpen={showClientModal}
        onSubmit={handleClientInfoSubmit}
        onClose={handleModalClose}
      />
    </>
  );
};
export const CommentsComponents: FC<{
  postId: string;
  initialComments?: any[];
}> = (props) => {
  const { postId, initialComments } = props;
  
  // Always show comments - no login required for anonymous commenting
  return <RenderComponents postId={postId} initialComments={initialComments} />;
};
