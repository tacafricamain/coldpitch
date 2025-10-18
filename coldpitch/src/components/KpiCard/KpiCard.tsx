import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  link?: string;
  linkText?: string;
}

export default function KpiCard({
  title,
  value,
  change,
  icon: Icon,
  link,
  linkText = 'See details',
}: KpiCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-3xl font-semibold text-gray-900 mt-2">{value}</h3>
          
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? '+' : ''}
                {change}%
              </span>
            </div>
          )}
        </div>

        {Icon && (
          <div className="bg-primary-50 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
        )}
      </div>

      {link && (
        <Link
          to={link}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-4 inline-flex items-center gap-1 group"
        >
          {linkText}
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      )}
    </div>
  );
}
