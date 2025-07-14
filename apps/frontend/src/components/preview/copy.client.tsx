'use client';

import { Button } from '@gitroom/react/form/button';
import copy from 'copy-to-clipboard';
import { useCallback } from 'react';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
export const CopyClient = () => {
  const toast = useToaster();
  const t = useT();
  const copyToClipboard = useCallback(() => {
    toast.show(
      t('link_copied_to_clipboard', 'Link copied to clipboard'),
      'success'
    );
    
    const currentUrl = window.location.href;
    let urlToCopy = currentUrl;
    
    // For bulk preview, preserve query parameters but ensure share=true
    if (currentUrl.includes('/bulk-preview')) {
      const url = new URL(currentUrl);
      url.searchParams.set('share', 'true'); // Ensure share=true is set
      urlToCopy = url.toString();
    } else {
      // For single posts, use original behavior (remove query params)
      urlToCopy = currentUrl.split?.('?')?.shift()!;
    }
    
    copy(urlToCopy);
  }, []);
  return (
    <Button onClick={copyToClipboard}>
      {t('share_with_a_client', 'Share with a client')}
    </Button>
  );
};
