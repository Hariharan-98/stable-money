import ReactGA from 'react-ga4';

// Initialize GA4 - Should be called in entry file
export const initGA = () => {
    ReactGA.initialize("G-YHV48PZCQS");
};

// Track Slider Interaction
export const trackSliderInteraction = (calculatorName: string) => {
    ReactGA.event("calculator_used", {
        calculator_name: calculatorName
    });
};
