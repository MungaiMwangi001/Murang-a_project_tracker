import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "What is the Murang’a County Projects Tracker?",
    answer:
      "It is a platform to monitor, manage, and view public development projects across Murang’a County. Citizens and staff can track progress, budgets, and ward-level activities.",
  },
  {
    question: "Who can register as a user?",
    answer:
      "Only approved staff members can register to manage projects. Citizens can view public data without logging in.",
  },
  {
    question: "How do I register as a staff member?",
    answer:
      "Use the Staff Registration form. Once submitted, your account will be reviewed and approved by an admin before you can access the dashboard.",
  },
  {
    question: "I forgot my password. What should I do?",
    answer:
      "Use the 'Forgot Password' link on the login page. You'll be guided through resetting your credentials via email.",
  },
  {
    question: "How can I see projects in my ward?",
    answer:
      "Go to the homepage, use the filter or search bar to select your ward or project category, and view the latest updates.",
  },
  {
    question: "How can I contact the admin?",
    answer:
      "Please email support@muranga.gov.ke or use the contact form available on the Contact Us page.",
  },
];

const FaqPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-800 mb-10 text-center">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group border border-gray-200 bg-white rounded-xl p-6 shadow-md transition">
              <summary className="flex justify-between items-center cursor-pointer list-none text-lg font-medium text-gray-800 group-open:text-green-700">
                {faq.question}
                <ChevronDownIcon className="w-5 h-5 transform group-open:rotate-180 transition" />
              </summary>
              <p className="mt-4 text-gray-600 text-base">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;