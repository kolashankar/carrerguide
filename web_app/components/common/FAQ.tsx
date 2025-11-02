'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items?: FAQItem[]
}

const defaultFAQs: FAQItem[] = [
  {
    question: 'How do I apply for jobs on CareerGuide?',
    answer: 'Browse through our extensive job listings, click on any job that interests you, and follow the application instructions. Most jobs have direct application links to company career pages.'
  },
  {
    question: 'Is CareerGuide free to use?',
    answer: 'Yes! CareerGuide is completely free for job seekers. You can browse jobs, practice DSA problems, access career tools, and more without any cost.'
  },
  {
    question: 'How often are new jobs posted?',
    answer: 'We update our job listings daily with fresh opportunities from top companies across India. Enable notifications to get alerts for new postings.'
  },
  {
    question: 'Can I track my job applications?',
    answer: 'Absolutely! Use your profile dashboard to track all your applications, save interesting jobs for later, and monitor your progress.'
  },
  {
    question: 'What career tools are available?',
    answer: 'We offer AI-powered resume review, cover letter generation, ATS optimization tools, and cold email templates to help you stand out in your job search.'
  },
  {
    question: 'How can I prepare for technical interviews?',
    answer: 'Our DSA Corner has 3000+ coding problems, company-specific questions, topic-wise practice, and curated sheets to help you ace technical interviews.'
  },
]

export function FAQ({ items = defaultFAQs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 bg-gray-50" data-testid="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="space-y-4">
          {items.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md"
                data-testid={`faq-item-${index}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                  data-testid={`faq-question-${index}`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div
                    className="px-6 pb-6 text-gray-600 leading-relaxed"
                    data-testid={`faq-answer-${index}`}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
