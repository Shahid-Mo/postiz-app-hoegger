'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';
import { useUser } from '../layout/user.context';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { ApprovalsFilters } from './components/filters';
import { DraftsList } from './components/draft-list';
import { Post } from '@prisma/client';

interface ApprovalsState {
  customer: string;
  status: string;
  dateRange: any;
  search: string;
}

export const ApprovalsComponent: FC = () => {
  const user = useUser();
  const fetch = useFetch();
  const toaster = useToaster();
  const t = useT();

  const [filters, setFilters] = useState<ApprovalsState>({
    customer: '',
    status: 'DRAFT',
    dateRange: null,
    search: '',
  });

  // Test query to fetch ALL posts (to see if any posts exist)
  const testLoadData = useCallback(async () => {
    const currentDate = new Date();
    const testParams = new URLSearchParams({
      display: 'month',
      day: '0',
      week: '1',
      month: (currentDate.getMonth() + 1).toString(),
      year: currentDate.getFullYear().toString(),
    });
    const url = `/posts?${testParams.toString()}`;
    console.log('🧪 Test API call (all posts):', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('🧪 Test API response:', data);
    return data;
  }, [fetch]);

  const { data: testData } = useSWR('test-all-posts', testLoadData);

  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | null>(null);

  // Build query string for SWR - need to include required time parameters
  const currentDate = new Date();
  const queryParams = new URLSearchParams({
    display: 'month', // Use month to get a broader range
    day: '0', // Monday
    week: '1', // Current week
    month: (currentDate.getMonth() + 1).toString(),
    year: currentDate.getFullYear().toString(),
    state: filters.status,
  });
  
  if (filters.customer) queryParams.append('customer', filters.customer);
  // Note: search is not implemented in the backend yet

  const loadData = useCallback(async () => {
    const url = `/posts?${queryParams.toString()}`;
    console.log('🌐 Fetching data from:', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('📥 API Response:', data);
    return data;
  }, [queryParams.toString(), fetch]);

  const {
    data: draftsData,
    error,
    mutate: refetchDrafts,
  } = useSWR(`posts-approvals-${queryParams.toString()}`, loadData);

  const drafts = draftsData?.posts || [];
  const isLoading = !draftsData && !error;

  // Debug logging
  console.log('🔍 Approvals Debug:', {
    queryUrl: `/posts?${queryParams.toString()}`,
    draftsData,
    error,
    isLoading,
    draftsCount: drafts.length,
    filters
  });

  // Handle filter changes
  const updateFilters = useCallback((newFilters: Partial<ApprovalsState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setSelectedPosts([]); // Clear selection when filters change
  }, []);

  // Handle post selection
  const togglePostSelection = useCallback((postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  }, []);

  const selectAllPosts = useCallback(() => {
    setSelectedPosts(drafts.map((post: Post) => post.id));
  }, [drafts]);

  const clearSelection = useCallback(() => {
    setSelectedPosts([]);
  }, []);

  // Handle bulk share
  const handleBulkShare = useCallback(() => {
    if (selectedPosts.length === 0) return;

    const url = `/bulk-preview?posts=${selectedPosts.join(',')}&share=true`;
    window.open(url, '_blank');
    
    toaster.show(`Generated share URL for ${selectedPosts.length} posts`, 'success');
  }, [selectedPosts, toaster]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('approvals', 'Approvals')}</h1>
          <p className="text-gray-600 mt-1">
            {t('approvals.description', 'Manage and approve draft posts')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <ApprovalsFilters
        filters={filters}
        onFiltersChange={updateFilters}
        selectedPosts={selectedPosts}
        onShare={handleBulkShare}
      />

      {/* Content */}
      <div className="flex-1 mt-6">
        {/* Debug Info */}
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
          <h3 className="font-bold">Debug Info:</h3>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Error: {error ? JSON.stringify(error) : 'None'}</p>
          <p>Drafts Data: {JSON.stringify(draftsData)}</p>
          <p>Test Data: {JSON.stringify(testData)}</p>
          <p>Drafts Count: {drafts.length}</p>
          <p>API URL: /posts?{queryParams.toString()}</p>
        </div>

        {error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{t('error.loading', 'Failed to load posts')}</p>
          </div>
        ) : drafts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {t('approvals.no_drafts', 'No draft posts found')}
            </p>
          </div>
        ) : (
          <DraftsList
            drafts={drafts}
            selectedPosts={selectedPosts}
            onToggleSelection={togglePostSelection}
            onSelectAll={selectAllPosts}
            onClearSelection={clearSelection}
          />
        )}
      </div>
    </div>
  );
};