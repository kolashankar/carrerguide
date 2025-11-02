'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Scholarship } from '@/types';
import { MapPin, GraduationCap, Calendar, DollarSign, Award } from 'lucide-react';
import { formatDate, formatSalary } from '@/lib/utils';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const isExpiringSoon = () => {
    const deadline = new Date(scholarship.deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  };

  return (
    <Link href={`/scholarships/${scholarship.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3 flex-1">
              {scholarship.provider_logo ? (
                <img
                  src={scholarship.provider_logo}
                  alt={scholarship.provider}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {scholarship.title}
                </h3>
                <p className="text-sm text-gray-600">{scholarship.provider}</p>
              </div>
            </div>
            {isExpiringSoon() && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                Expiring Soon
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              {scholarship.country}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Award className="w-3.5 h-3.5 mr-1.5" />
              {scholarship.education_level} • {scholarship.field_of_study}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-3.5 h-3.5 mr-1.5" />
              {formatSalary(scholarship.amount_min, scholarship.amount_max, scholarship.amount_currency)}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Deadline: {formatDate(scholarship.deadline)}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {scholarship.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
              {scholarship.scholarship_type}
            </span>
            {scholarship.benefits && scholarship.benefits.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                {scholarship.benefits.length} Benefits
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Posted {formatDate(scholarship.created_at)}
            </span>
            <span className="text-sm font-semibold text-purple-600 group-hover:text-purple-700">
              View Details →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
