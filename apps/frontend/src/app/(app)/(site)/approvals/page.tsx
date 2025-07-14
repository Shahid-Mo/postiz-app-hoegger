export const dynamic = 'force-dynamic';
import { ApprovalsComponent } from '@gitroom/frontend/components/approvals/approvals.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';

export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Postiz Approvals' : 'Gitroom Approvals'}`,
  description: 'Manage and approve draft posts',
};

export default async function Index() {
  return <ApprovalsComponent />;
}