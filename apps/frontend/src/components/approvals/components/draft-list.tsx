'use client';

import { FC } from 'react';
import { Button } from '@gitroom/react/form/button';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { format } from 'date-fns';
import clsx from 'clsx';

interface Post {
  id: string;
  state: string;
  content: any; // Can be array or object
  publishDate: string;
  createdAt: string;
  integration: {
    id: string;
    name: string;
    picture: string;
    customer?: {
      id: string;
      name: string;
    };
  };
}

interface DraftsListProps {
  drafts: Post[];
  selectedPosts: string[];
  onToggleSelection: (postId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

const PostCheckbox: FC<{
  checked: boolean;
  onChange: () => void;
}> = ({ checked, onChange }) => {
  return (
    <div
      onClick={onChange}
      className={clsx(
        'cursor-pointer rounded-[4px] select-none w-[20px] h-[20px] justify-center items-center flex border-2',
        checked 
          ? 'bg-primary border-primary text-white' 
          : 'border-tableBorder bg-sixth hover:border-primary'
      )}
    >
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </div>
  );
};

const StatusBadge: FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' };
      case 'QUEUE':
        return { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' };
      case 'PUBLISHED':
        return { color: 'bg-green-100 text-green-800', label: 'Published' };
      case 'ERROR':
        return { color: 'bg-red-100 text-red-800', label: 'Error' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={clsx('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', config.color)}>
      {config.label}
    </span>
  );
};

const PostPreview: FC<{ content: any }> = ({ content }) => {
  // Debug log content structure
  console.log('🔍 Content structure:', content, 'Type:', typeof content);
  
  // Handle different content formats
  const contentArray = Array.isArray(content) ? content : (content ? [content] : []);
  
  const firstTextContent = contentArray.find(item => item?.text)?.text || '';
  const hasMedia = contentArray.some(item => item?.media?.length > 0);

  return (
    <div className="flex items-start gap-3">
      {hasMedia && (
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-textColor line-clamp-3">
          {firstTextContent || (contentArray.length > 0 ? 'Media content only' : 'No content')}
        </p>
        {contentArray.length === 0 && (
          <p className="text-xs text-gray-400 mt-1">
            Content: {JSON.stringify(content).substring(0, 100)}...
          </p>
        )}
      </div>
    </div>
  );
};

export const DraftsList: FC<DraftsListProps> = ({
  drafts,
  selectedPosts,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
}) => {
  const t = useT();

  const allSelected = drafts.length > 0 && selectedPosts.length === drafts.length;
  const someSelected = selectedPosts.length > 0 && selectedPosts.length < drafts.length;

  return (
    <div className="space-y-4">
      {/* Header with select all */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PostCheckbox
            checked={allSelected}
            onChange={allSelected ? onClearSelection : onSelectAll}
          />
          <span className="text-sm text-textColor">
            {allSelected 
              ? t('list.select_none', 'Select None')
              : someSelected
              ? t('list.select_all', `Select All (${drafts.length})`)
              : t('list.select_all', `Select All (${drafts.length})`)
            }
          </span>
        </div>
        
        <span className="text-sm text-gray-500">
          {t('list.total_posts', `${drafts.length} posts`)}
        </span>
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {drafts.map((post) => {
          // Debug log each post
          console.log('📝 Post data:', post);
          
          const isSelected = selectedPosts.includes(post.id);
          const publishDate = post.publishDate ? new Date(post.publishDate) : null;
          const createdDate = post.createdAt ? new Date(post.createdAt) : null;
          
          // Validate dates
          const isValidCreatedDate = createdDate && !isNaN(createdDate.getTime());
          const isValidPublishDate = publishDate && !isNaN(publishDate.getTime());

          return (
            <div
              key={post.id}
              className={clsx(
                'bg-sixth border rounded-lg p-4 transition-all',
                isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-tableBorder hover:border-primary/50'
              )}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <PostCheckbox
                  checked={isSelected}
                  onChange={() => onToggleSelection(post.id)}
                />

                {/* Platform icon */}
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={post.integration.picture}
                    alt={post.integration.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-textColor">
                          {post.integration.name}
                        </span>
                        {post.integration.customer && (
                          <span className="text-sm text-gray-500">
                            • {post.integration.customer.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>
                          {t('list.created', 'Created:')} {
                            isValidCreatedDate 
                              ? format(createdDate, 'MMM d, yyyy HH:mm')
                              : 'Invalid date'
                          }
                        </span>
                        {isValidPublishDate && (
                          <span>
                            {t('list.scheduled', 'Scheduled:')} {format(publishDate, 'MMM d, yyyy HH:mm')}
                          </span>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={post.state} />
                  </div>

                  <PostPreview content={post.content} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};