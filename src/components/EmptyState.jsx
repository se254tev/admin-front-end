import { FaExclamationTriangle, FaInbox } from 'react-icons/fa';

const EmptyState = ({
  icon: Icon = FaInbox,
  title = 'No data available',
  description = 'There are no items to display at the moment.',
  action
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="rounded-full bg-slate-100 p-4 mb-4">
      <Icon className="h-8 w-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 mb-6 max-w-sm">{description}</p>
    {action && (
      <div className="flex gap-3">
        {action}
      </div>
    )}
  </div>
);

const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an error while loading this content.',
  action
}) => (
  <EmptyState
    icon={FaExclamationTriangle}
    title={title}
    description={description}
    action={action}
  />
);

export { EmptyState, ErrorState };