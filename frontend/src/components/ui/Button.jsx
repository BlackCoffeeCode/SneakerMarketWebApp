import React from 'react';

const Button = ({ children, onClick, className = '', ...props }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-primary-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
