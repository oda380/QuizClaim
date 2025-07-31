import React from 'react';

export const QuizGamePlaceholder = () => (
  <div className="space-y-6 animate-pulse">
    {/* Placeholder for the question */}
    <div className="h-12 bg-gray-300 rounded-lg"></div>

    {/* Placeholder for the answer options */}
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded-lg"></div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>

    {/* Placeholder for the submit button */}
    <div className="h-12 w-48 mx-auto bg-gray-400 rounded-full"></div>
  </div>
);

export default QuizGamePlaceholder;