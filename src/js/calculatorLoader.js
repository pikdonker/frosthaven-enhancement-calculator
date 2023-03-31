import React from 'react';
import ReactDOM from 'react-dom/client';
import EnhancementCalculator from './calculator';

document.addEventListener('DOMContentLoaded', function () {
    var calculator_container = document.getElementById('calculator');
    var react_root = ReactDOM.createRoot(calculator_container);

    react_root.render(<EnhancementCalculator/>);
});