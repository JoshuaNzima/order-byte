import { Organization } from '@/types/menu';

interface MenuHeaderProps {
  organization: Organization;
}

export default function MenuHeader({ organization }: MenuHeaderProps) {
  return (
    <div className="bg-white shadow-lg border-b border-gray-200 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ backgroundColor: organization.theme.primaryColor }}
      ></div>
      <div className="relative px-4 py-8 text-center">
        <div className="mb-4">
          <h1 
            className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent"
            style={{ 
              backgroundImage: `linear-gradient(135deg, ${organization.theme.primaryColor}, ${organization.theme.accentColor})` 
            }}
          >
            {organization.name}
          </h1>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: organization.theme.accentColor }}></div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
          {organization.contact.phone && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{organization.contact.phone}</span>
            </div>
          )}
          
          {organization.contact.website && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
              <span>{organization.contact.website}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}