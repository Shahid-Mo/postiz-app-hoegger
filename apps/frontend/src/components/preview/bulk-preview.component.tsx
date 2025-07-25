'use client';

import { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { VideoOrImage } from '@gitroom/react/helpers/video.or.image';
import { CopyClient } from '@gitroom/frontend/components/preview/copy.client';
import { CommentsComponents } from '@gitroom/frontend/components/preview/comments.components';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';

dayjs.extend(utc);

interface Post {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  publishDate?: string;
  integration: {
    id: string;
    name: string;
    picture: string;
    providerIdentifier: string;
    profile: string;
  };
}

interface BulkPreviewComponentProps {
  posts: Post[];
  postIds: string[];
  showShare?: boolean;
  title?: string;
}

export const BulkPreviewComponent: FC<BulkPreviewComponentProps> = ({
  posts,
  postIds,
  showShare = false,
  title,
}) => {
  const t = useT();
  const fetch = useFetch();
  const [comments, setComments] = useState<Record<string, any>>({});
  const [loadingComments, setLoadingComments] = useState(true);

  // Load comments for all posts
  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoadingComments(true);
        const response = await fetch(`/public/posts/bulk/comments?posts=${postIds.join(',')}`);
        const data = await response.json();
        setComments(data.comments || {});
      } catch (error) {
        console.error('Failed to load comments:', error);
        setComments({});
      } finally {
        setLoadingComments(false);
      }
    };

    if (postIds.length > 0) {
      loadComments();
    }
  }, [postIds, fetch]);

  // Group posts by their original post ID (since getPostsRecursively can return multiple posts)
  const groupedPosts = posts.reduce((groups: Record<string, Post[]>, post) => {
    const postId = post.id;
    if (!groups[postId]) {
      groups[postId] = [];
    }
    groups[postId].push(post);
    return groups;
  }, {});

  return (
    <div>
      <div className="mx-auto w-full max-w-[1346px] py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="min-w-[55px]">
                <Link
                  href="/"
                  className="text-2xl flex items-center justify-center gap-[10px] text-textColor order-1"
                >
                  <div className="max-w-[55px]">
                    <Image
                      src={'/postiz.svg'}
                      width={55}
                      height={55}
                      alt="Logo"
                    />
                  </div>
                  <div>
                    <svg
                      width="80"
                      height="75"
                      viewBox="0 0 366 167"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M24.9659 30.4263V43.3825C26.9237 41.3095 29.3998 39.582 32.3941 38.2C35.3885 36.7028 39.0162 35.9543 43.2774 35.9543C47.1931 35.9543 50.8784 36.7028 54.3334 38.2C57.9036 39.6972 61.0131 42.1157 63.6619 45.4555C66.4259 48.6802 68.6141 52.9989 70.2264 58.4118C71.8387 63.8246 72.6449 70.3891 72.6449 78.1053C72.6449 83.6333 72.1266 89.1613 71.0902 94.6893C70.1688 100.217 68.4989 105.169 66.0804 109.546C63.6619 113.922 60.3796 117.492 56.2336 120.256C52.2028 122.905 47.1355 124.23 41.0316 124.23C36.6553 124.23 33.2003 123.654 30.6666 122.502C28.1329 121.235 26.2327 119.796 24.9659 118.183V160.162L0.0898438 166.381V30.4263H24.9659ZM32.7396 109.2C35.734 109.2 38.2676 108.221 40.3406 106.264C42.4136 104.191 44.026 101.542 45.1776 98.3171C46.4445 95.0924 47.3082 91.5222 47.7689 87.6066C48.3447 83.5757 48.6326 79.6025 48.6326 75.6868C48.6326 69.3526 48.0568 64.3429 46.9051 60.6575C45.8686 56.9722 44.6018 54.2658 43.1046 52.5383C41.6075 50.6956 40.1103 49.5439 38.6131 49.0833C37.2311 48.6226 36.137 48.3923 35.3309 48.3923C33.2579 48.3923 31.2425 49.1409 29.2846 50.638C27.3268 52.02 25.8872 54.1506 24.9659 57.0298V105.227C25.5417 106.148 26.463 107.07 27.7299 107.991C28.9967 108.797 30.6666 109.2 32.7396 109.2Z"
                        fill="currentColor"
                      />
                      <path
                        d="M188.176 31.4627C191.055 42.5188 193.588 51.5593 195.777 58.5845C197.965 65.4945 199.807 71.3105 201.305 76.0323C202.917 80.7541 204.126 84.9001 204.932 88.4703C205.854 92.0405 206.314 96.0137 206.314 100.39C208.272 99.1232 210.172 97.7988 212.015 96.4168C213.858 94.9196 215.413 93.5376 216.679 92.2708H223.935C220.825 96.9926 217.543 100.908 214.088 104.018C210.633 107.012 207.293 109.661 204.069 111.964C201.996 116.456 198.829 119.623 194.567 121.466C190.306 123.308 185.872 124.23 181.266 124.23C176.083 124.23 171.649 123.539 167.964 122.157C164.279 120.659 161.227 118.702 158.808 116.283C156.505 113.749 154.777 110.87 153.626 107.646C152.474 104.421 151.898 101.023 151.898 97.4533C151.898 93.5376 152.819 90.4857 154.662 88.2975C156.62 85.9942 158.866 84.8426 161.399 84.8426C168.424 84.8426 171.937 87.6641 171.937 93.3073C171.937 95.15 171.304 96.7047 170.037 97.9716C168.77 99.2384 167.158 99.8718 165.2 99.8718C164.278 99.8718 163.3 99.7566 162.263 99.5263C161.342 99.1808 160.593 98.5474 160.017 97.6261C160.939 101.657 162.436 104.824 164.509 107.127C166.697 109.431 169.461 110.582 172.801 110.582C175.68 110.582 177.811 109.891 179.193 108.509C180.575 107.012 181.266 104.478 181.266 100.908C181.266 97.1078 180.92 93.7104 180.229 90.7161C179.653 87.6066 178.732 84.2091 177.465 80.5238C176.198 76.8385 174.644 72.4621 172.801 67.3948C170.958 62.2123 168.885 55.5326 166.582 47.3558C160.823 59.6786 153.222 67.5675 143.779 71.0225C143.779 71.9439 143.779 72.8652 143.779 73.7865C143.894 74.5927 143.952 75.4565 143.952 76.3778C143.952 83.0575 143.376 89.334 142.224 95.2076C141.072 100.966 139.115 106.033 136.351 110.41C133.702 114.671 130.247 118.068 125.986 120.602C121.724 123.02 116.484 124.23 110.265 124.23C106.004 124.23 101.916 123.596 98 122.329C94.1995 120.947 90.8021 118.759 87.8078 115.765C84.8134 112.655 82.3949 108.624 80.5523 103.672C78.8248 98.605 77.961 92.4436 77.961 85.188C77.961 80.2359 78.4793 74.9382 79.5158 69.295C80.5523 63.5367 82.4525 58.1814 85.2165 53.2293C87.9805 48.2771 91.7234 44.1887 96.4453 40.964C101.282 37.6242 107.444 35.9543 114.93 35.9543C122.646 35.9543 128.807 38.0273 133.414 42.1733C138.136 46.3193 141.303 52.9989 142.915 62.2123C146.946 61.2909 150.574 58.5269 153.798 53.9203C157.138 49.1984 160.305 42.8643 163.3 34.9177L188.176 31.4627ZM115.102 107.991C117.521 107.991 119.594 107.185 121.321 105.573C123.164 103.845 124.661 101.542 125.813 98.6626C126.964 95.6682 127.771 92.1556 128.231 88.1248C128.807 84.094 129.095 79.7176 129.095 74.9958V72.75C124.488 71.7135 122.185 68.3161 122.185 62.5578C122.185 58.8724 123.682 56.4539 126.677 55.3023C125.41 51.6169 123.855 49.1984 122.012 48.0468C120.285 46.8951 118.788 46.3193 117.521 46.3193C114.987 46.3193 112.799 47.5285 110.956 49.947C109.229 52.2504 107.789 55.2447 106.638 58.93C105.486 62.5002 104.622 66.4734 104.046 70.8498C103.586 75.2261 103.355 79.4297 103.355 83.4605C103.355 88.6431 103.701 92.8466 104.392 96.0713C105.198 99.296 106.177 101.772 107.329 103.5C108.48 105.227 109.747 106.436 111.129 107.127C112.511 107.703 113.835 107.991 115.102 107.991Z"
                        fill="currentColor"
                      />
                      <path
                        d="M239.554 9.52348V36.818H250.092V43.728H239.554V95.5531C239.554 100.39 240.187 103.615 241.454 105.227C242.836 106.724 245.197 107.473 248.537 107.473C251.877 107.473 254.641 106.033 256.829 103.154C259.132 100.275 260.457 96.6471 260.802 92.2708H268.058C267.136 99.296 265.524 104.939 263.221 109.2C260.917 113.346 258.326 116.571 255.447 118.874C252.568 121.062 249.631 122.502 246.637 123.193C243.642 123.884 240.993 124.23 238.69 124.23C229.822 124.23 223.603 121.811 220.033 116.974C216.463 112.022 214.678 105.515 214.678 97.4533V43.728H209.15V36.818H214.678V12.9785L239.554 9.52348Z"
                        fill="currentColor"
                      />
                      <path
                        d="M258.833 13.8422C258.833 10.0417 260.158 6.81706 262.806 4.16823C265.455 1.40422 268.68 0.0222168 272.48 0.0222168C276.281 0.0222168 279.506 1.40422 282.154 4.16823C284.918 6.81706 286.3 10.0417 286.3 13.8422C286.3 17.6427 284.918 20.8674 282.154 23.5162C279.506 26.1651 276.281 27.4895 272.48 27.4895C268.68 27.4895 265.455 26.1651 262.806 23.5162C260.158 20.8674 258.833 17.6427 258.833 13.8422ZM285.609 36.818V95.5531C285.609 100.39 286.243 103.615 287.51 105.227C288.892 106.724 291.253 107.473 294.592 107.473C296.09 107.473 297.184 107.358 297.875 107.127C298.681 106.897 299.372 106.667 299.948 106.436C300.063 107.012 300.12 107.588 300.12 108.164C300.12 108.74 300.12 109.315 300.12 109.891C300.12 112.77 299.602 115.131 298.566 116.974C297.644 118.817 296.377 120.314 294.765 121.466C293.268 122.502 291.598 123.193 289.755 123.539C288.028 123.999 286.358 124.23 284.746 124.23C275.878 124.23 269.659 121.811 266.089 116.974C262.518 112.022 260.733 105.515 260.733 97.4533V36.818H285.609ZM351.773 107.473C350.391 107.358 349.354 106.897 348.663 106.091C347.972 105.169 347.627 104.133 347.627 102.981C347.627 101.484 348.26 100.045 349.527 98.6626C350.794 97.1654 352.867 96.4168 355.746 96.4168C358.971 96.4168 361.389 97.5109 363.001 99.6991C364.614 101.772 365.42 104.248 365.42 107.127C365.42 108.97 365.074 110.87 364.383 112.828C363.692 114.671 362.598 116.398 361.101 118.011C359.604 119.508 357.761 120.775 355.573 121.811C353.385 122.732 350.851 123.193 347.972 123.193H300.293L334.152 46.1465H321.369C318.835 46.1465 316.704 46.3193 314.977 46.6648C313.365 46.8951 312.558 47.5285 312.558 48.565C312.558 49.0257 312.674 49.256 312.904 49.256C313.249 49.256 313.595 49.3712 313.94 49.6015C314.401 49.8318 314.747 50.2925 314.977 50.9835C315.322 51.6745 315.495 52.8838 315.495 54.6113C315.495 57.1449 314.689 58.9876 313.077 60.1393C311.579 61.2909 309.852 61.8668 307.894 61.8668C305.591 61.8668 303.345 61.1182 301.157 59.621C299.084 58.0087 298.047 55.5902 298.047 52.3655C298.047 50.638 298.393 48.9105 299.084 47.183C299.775 45.3403 300.811 43.6704 302.193 42.1733C303.575 40.5609 305.303 39.2941 307.376 38.3728C309.449 37.3363 311.867 36.818 314.631 36.818H362.138L329.142 109.891C329.833 109.891 330.812 109.949 332.079 110.064C333.346 110.179 334.67 110.294 336.052 110.41C337.55 110.525 338.989 110.64 340.371 110.755C341.868 110.87 343.193 110.928 344.344 110.928C346.417 110.928 348.145 110.697 349.527 110.237C351.024 109.776 351.773 108.855 351.773 107.473Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-[20px]">
            {showShare && (
              <div>
                <CopyClient />
              </div>
            )}
            <div className="flex-1">
              {title ? (
                <span>{title}</span>
              ) : (
                <span>
                  {t('bulk_preview', 'Campaign Preview:')} {posts.length} {t('posts', 'posts')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row text-white w-full max-w-[1346px] mx-auto">
        <div className="flex-1">
          <div className="gap-[40px] flex flex-col">
            {Object.entries(groupedPosts).map(([postId, postGroup]) => (
              <div key={postId} className="border-b border-tableBorder pb-8">
                {/* Post Section */}
                <div className="mb-6">
                  <div className="gap-[20px] flex flex-col">
                    {postGroup.map((post, index) => (
                      <div
                        key={`${post.id}-${index}`}
                        className="relative px-4 py-4 bg-third border border-tableBorder"
                      >
                        <div className="flex space-x-3">
                          <div>
                            <div className="flex shrink-0 rounded-full h-30 w-30 relative">
                              <div className="w-[50px] h-[50px] z-[20]">
                                <img
                                  className="w-full h-full relative z-[20] bg-black aspect-square rounded-full border-tableBorder"
                                  alt={post.integration.name}
                                  src={post.integration.picture}
                                />
                              </div>
                              <div className="absolute -end-[5px] -bottom-[5px] w-[30px] h-[30px] z-[20]">
                                <img
                                  className="w-full h-full bg-black aspect-square rounded-full border-tableBorder"
                                  alt={post.integration.providerIdentifier}
                                  src={`/icons/platforms/${post.integration.providerIdentifier}.png`}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <h2 className="text-sm font-semibold">
                                {post.integration.name}
                              </h2>
                              <span className="text-sm text-gray-500">
                                @{post.integration.profile}
                              </span>
                            </div>
                            <div className="flex flex-col gap-[20px]">
                              <div
                                className="text-sm whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{
                                  __html: post.content,
                                }}
                              />
                              <div className="flex w-full gap-[10px]">
                                {JSON.parse(post?.image || '[]').map((img: any) => (
                                  <div
                                    key={img.name}
                                    className="flex-1 rounded-[10px] max-h-[500px] overflow-hidden"
                                  >
                                    <VideoOrImage
                                      isContain={true}
                                      src={img.path}
                                      autoplay={true}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              {t('publication_date', 'Publication Date:')} {' '}
                              {dayjs
                                .utc(post.createdAt)
                                .local()
                                .format('MMMM D, YYYY h:mm A')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments Section for this post */}
                <div className="bg-sixth border border-tableBorder rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-4 text-textColor">
                    {t('comments_for_post', 'Comments for this post')}
                  </h3>
                  {loadingComments ? (
                    <div className="text-center py-4">
                      <div className="text-sm text-gray-500">
                        {t('loading_comments', 'Loading comments...')}
                      </div>
                    </div>
                  ) : (
                    <CommentsComponents 
                      postId={postId} 
                      initialComments={comments[postId] || []}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};