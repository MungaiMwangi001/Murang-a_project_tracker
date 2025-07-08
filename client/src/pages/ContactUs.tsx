import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">Contact Murang'a County</h1>
        <p className="mb-6 text-gray-700 text-center">
          We value your feedback and inquiries. Please use the information below to reach out to us for support, questions, or suggestions.
        </p>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-green-700 mb-2">County Headquarters</h2>
          <p className="text-gray-800">Murang'a County Government<br />
            P.O. Box 52-10200,<br />
            Murang'a Town, Kenya<br />
            <span className="font-semibold">Location:</span> Along Kenol-Murang'a Road, Opposite Murang'a University
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Email</h2>
          <p className="text-gray-800">info@muranga.go.ke (demo)</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Phone</h2>
          <p className="text-gray-800">+254 712 345 678 (demo)</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Public User Support</h2>
          <p className="text-gray-800">
            For public user support, please email <span className="font-mono">support@muranga.go.ke</span> (demo) or call our helpdesk at <span className="font-mono">+254 700 111 222</span> (demo).<br />
            Our support team is available Monday to Friday, 8:00am - 5:00pm.
          </p>
        </div>
        <div className="text-center mt-8">
          <span className="text-sm text-gray-500">This is a demo contact page for Murang'a County Project Tracker.</span>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 