'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Scholarship } from '@/types';
import { ArrowLeft, MapPin, GraduationCap, Calendar, DollarSign, Award, ExternalLink, CheckCircle2 } from 'lucide-react';
import { formatDate, formatSalary } from '@/lib/utils';

export default function ScholarshipDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const { data, isLoading, error } = useQuery({
    queryKey: ['scholarship', id],
    queryFn: async () => {
      const response = await apiClient.getScholarshipById(id);
      return response;
    },
  });

  const scholarship: Scholarship = data?.data;

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Skeleton className="h-96" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !scholarship) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Scholarship Not Found</h2>
            <Button onClick={() => router.push('/scholarships')}>Back to Scholarships</Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Scholarships
          </button>

          {/* Scholarship Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-start space-x-4 mb-6">
              {scholarship.provider_logo ? (
                <img
                  src={scholarship.provider_logo}
                  alt={scholarship.provider}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-purple-100 flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-purple-600" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {scholarship.title}
                </h1>
                <p className="text-xl text-gray-600 mb-4">{scholarship.provider}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {scholarship.scholarship_type}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {scholarship.education_level}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Country</div>
                  <div className="font-medium">{scholarship.country}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Award className="w-5 h-5 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Field</div>
                  <div className="font-medium">{scholarship.field_of_study}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-5 h-5 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Amount</div>
                  <div className="font-medium">
                    {formatSalary(scholarship.amount_min, scholarship.amount_max, scholarship.amount_currency)}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Deadline</div>
                  <div className="font-medium">{formatDate(scholarship.deadline)}</div>
                </div>
              </div>
            </div>

            <a
              href={scholarship.application_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                Apply Now
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Scholarship</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {scholarship.description}
            </p>
          </div>

          {/* Eligibility Criteria */}
          {scholarship.eligibility_criteria && scholarship.eligibility_criteria.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
              <ul className="space-y-3">
                {scholarship.eligibility_criteria.map((criteria, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {scholarship.benefits && scholarship.benefits.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
              <ul className="space-y-3">
                {scholarship.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Process */}
          {scholarship.application_process && scholarship.application_process.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Process</h2>
              <ol className="space-y-3">
                {scholarship.application_process.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Apply Button */}
          <a
            href={scholarship.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
              Apply for This Scholarship
              <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}
