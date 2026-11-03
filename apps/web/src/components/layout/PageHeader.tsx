import React from 'react';
import { cn } from '../../lib/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; path?: string }[];
  className?: string;
}

/**
 * Consistent page header used inside the dashboard content area.
 * Renders as a card-like section without the visual weight of a full Card.
 */
export default function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 animate-fade-up', className)}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-2 flex items-center gap-1.5 text-xs text-muted" aria-label="Breadcrumb">
          {breadcrumb.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span aria-hidden>/</span>}
              {item.path ? (
                <a
                  href={item.path}
                  className="hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-headline text-foreground tracking-tight break-words">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center flex-wrap gap-2 shrink-0 w-full sm:w-auto">{actions}</div>
        )}
      </div>
    </div>
  );
}