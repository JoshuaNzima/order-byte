import { OrganizationRepository } from '@/backend/repositories/superadminRepository';
import OrganizationLandingPage from '@/frontend/components/OrganizationLandingPage';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ orgId: string }>;
}

export default async function OrganizationLanding({ params }: PageProps) {
  const { orgId } = await params;
  const organization = OrganizationRepository.getById(orgId);

  if (!organization) {
    notFound();
  }

  return <OrganizationLandingPage organization={organization} />;
}
