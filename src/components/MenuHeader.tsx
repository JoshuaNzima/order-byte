import { Organization } from '@/types/menu';

interface MenuHeaderProps {
  organization: Organization;
}

export default function MenuHeader({ organization }: MenuHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100">
      <div className="px-4 py-6 text-center">
        <h1 
          className="text-2xl font-bold mb-2"
          style={{ color: organization.theme.primaryColor }}
        >
          {organization.name}
        </h1>
        {organization.contact.phone && (
          <p className="text-sm text-gray-600 mb-1">
            {organization.contact.phone}
          </p>
        )}
        {organization.contact.website && (
          <p className="text-xs text-gray-500">
            {organization.contact.website}
          </p>
        )}
      </div>
    </div>
  );
}