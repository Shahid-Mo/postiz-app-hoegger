import { internalFetch } from '@gitroom/helpers/utils/internal.fetch';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
import { BulkPreviewComponent } from '@gitroom/frontend/components/preview/bulk-preview.component';
import { getT } from '@gitroom/react/translation/get.translation.service.backend';

export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Postiz' : 'Gitroom'} Bulk Preview`,
  description: 'Preview multiple posts',
};

export default async function BulkPreview({
  searchParams,
}: {
  searchParams?: {
    posts?: string;
    share?: string;
    title?: string;
  };
}) {
  const t = await getT();
  
  const postIds = searchParams?.posts?.split(',').filter(Boolean) || [];
  
  if (postIds.length === 0) {
    return (
      <div className="text-white fixed start-0 top-0 w-full h-full flex justify-center items-center text-[20px]">
        {t('no_posts_specified', 'No posts specified')}
      </div>
    );
  }

  if (postIds.length > 10) {
    return (
      <div className="text-white fixed start-0 top-0 w-full h-full flex justify-center items-center text-[20px]">
        {t('too_many_posts', 'Too many posts specified (maximum 10)')}
      </div>
    );
  }

  let posts = [];
  try {
    const response = await internalFetch(`/public/posts/bulk?posts=${postIds.join(',')}`);
    posts = await response.json();
  } catch (error) {
    console.error('Failed to fetch bulk posts:', error);
    return (
      <div className="text-white fixed start-0 top-0 w-full h-full flex justify-center items-center text-[20px]">
        {t('posts_not_found', 'Failed to load posts')}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-white fixed start-0 top-0 w-full h-full flex justify-center items-center text-[20px]">
        {t('posts_not_found', 'Posts not found')}
      </div>
    );
  }

  return (
    <BulkPreviewComponent
      posts={posts}
      postIds={postIds}
      showShare={!!searchParams?.share}
      title={searchParams?.title}
    />
  );
}