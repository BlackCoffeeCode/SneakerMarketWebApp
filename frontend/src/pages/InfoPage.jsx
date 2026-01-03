import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

const InfoPage = () => {
    const location = useLocation();

    // Determine content based on path
    const getPageContent = () => {
        const path = location.pathname;

        switch (path) {
            case '/help':
                return {
                    title: "Help Center",
                    content: "How can we assist you? Browse our FAQs or contact support."
                };
            case '/returns':
                return {
                    title: "Returns & Exchanges",
                    content: "We offer a 30-day return policy for all unworn items. Initiate a return here."
                };
            case '/contact':
                return {
                    title: "Contact Us",
                    content: "Reach out to us at support@brandname.com or call +1 234 567 890."
                };
            case '/privacy':
                return {
                    title: "Privacy Policy",
                    content: "Your privacy is important to us. We protect your data securely."
                };
            case '/terms':
                return {
                    title: "Terms of Service",
                    content: "By using our site, you agree to our Terms and Conditions."
                };
            default:
                return {
                    title: "Information",
                    content: "Welcome to our information page."
                };
        }
    };

    const { title, content } = getPageContent();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        {title}
                    </h1>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            {content}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mt-4">
                            (This is a placeholder page for demonstration purposes.)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPage;
