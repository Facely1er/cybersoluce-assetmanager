import React from 'react';
import { Server, AlertTriangle, Tag, Calendar } from 'lucide-react';
import { AssetStats } from '../types/asset';

interface AssetStatsOverviewProps {
  stats: AssetStats;
}

export const AssetStatsOverview: React.FC<AssetStatsOverviewProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Assets',
      value: stats.total,
      icon: Server,
      color: 'text-command-blue-600 bg-command-blue-50',
      border: 'border-command-blue-200',
    },
    {
      title: 'Critical Assets',
      value: stats.critical,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50',
      border: 'border-red-200',
    },
    {
      title: 'Untagged Assets',
      value: stats.untagged,
      icon: Tag,
      color: 'text-yellow-600 bg-yellow-50',
      border: 'border-yellow-200',
    },
    {
      title: 'Recently Added',
      value: stats.recentlyAdded,
      icon: Calendar,
      color: 'text-action-cyan-600 bg-action-cyan-50',
      border: 'border-action-cyan-200',
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className={`bg-white p-6 rounded-lg border-2 ${card.border} hover:shadow-md transition-all duration-300 animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-outfit font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};