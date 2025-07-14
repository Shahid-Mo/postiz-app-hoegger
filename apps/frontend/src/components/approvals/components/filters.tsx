'use client';

import { FC, useMemo } from 'react';
import { Select } from '@gitroom/react/form/select';
import { Button } from '@gitroom/react/form/button';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { SelectCustomer } from '@gitroom/frontend/components/launches/select.customer';

interface ApprovalsFiltersProps {
  filters: {
    customer: string;
    status: string;
    dateRange: any;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  selectedPosts: string[];
  onShare: () => void;
}

export const ApprovalsFilters: FC<ApprovalsFiltersProps> = ({
  filters,
  onFiltersChange,
  selectedPosts,
  onShare,
}) => {
  const t = useT();
  const fetch = useFetch();

  // Fetch integrations for customer selection
  const { data: integrationsData } = useSWR('/integrations', async (url) => {
    const response = await fetch(url);
    return response.json();
  });
  const integrations = integrationsData?.integrations || [];

  const statusOptions = [
    { value: 'DRAFT', label: t('status.draft', 'Draft') },
    { value: 'QUEUE', label: t('status.scheduled', 'Scheduled') },
    { value: 'PUBLISHED', label: t('status.published', 'Published') },
    { value: 'ERROR', label: t('status.error', 'Error') },
  ];

  const handleCustomerChange = (customerId: string) => {
    onFiltersChange({ customer: customerId });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ status });
  };


  const clearFilters = () => {
    onFiltersChange({
      customer: '',
      status: 'DRAFT',
      dateRange: null,
      search: '',
    });
  };

  return (
    <div className="bg-sixth border border-tableBorder rounded-lg p-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Customer Filter */}
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium text-textColor mb-1">
            {t('filter.customer', 'Customer')}
          </label>
          <SelectCustomer
            onChange={handleCustomerChange}
            integrations={integrations}
            customer={filters.customer}
          />
        </div>

        {/* Status Filter */}
        <div className="min-w-[150px]">
          <Select
            hideErrors={true}
            label={t('filter.status', 'Status')}
            name="status"
            value={filters.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disableForm={true}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>


        {/* Share Selected */}
        {selectedPosts.length > 0 && (
          <div>
            <Button
              type="button"
              onClick={onShare}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t('filter.share_selected', `Share Selected (${selectedPosts.length})`)}
            </Button>
          </div>
        )}

        {/* Clear Filters */}
        <div>
          <Button
            type="button"
            onClick={clearFilters}
            className="bg-transparent border border-tableBorder text-textColor hover:bg-tableBorder"
          >
            {t('filter.clear', 'Clear Filters')}
          </Button>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="mt-3 flex flex-wrap gap-2">
        {filters.customer && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
            Customer: {integrations.find((i: any) => i.customer?.id === filters.customer)?.customer?.name}
          </span>
        )}
        {filters.status !== 'DRAFT' && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
            Status: {statusOptions.find(s => s.value === filters.status)?.label}
          </span>
        )}
      </div>
    </div>
  );
};