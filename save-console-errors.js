// Add this script to capture console errors and save to file
// Instructions: Copy and paste this into your browser console

(function() {
    const errors = [];
    
    // Capture console errors
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = function(...args) {
        const error = `[${new Date().toISOString()}] ERROR: ${args.join(' ')}`;
        errors.push(error);
        originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
        const warning = `[${new Date().toISOString()}] WARNING: ${args.join(' ')}`;
        errors.push(warning);
        originalWarn.apply(console, args);
    };
    
    // Capture window errors
    window.addEventListener('error', function(e) {
        const error = `[${new Date().toISOString()}] SCRIPT ERROR: ${e.message} at ${e.filename}:${e.lineno}:${e.colno}`;
        errors.push(error);
    });
    
    // Capture promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        const error = `[${new Date().toISOString()}] PROMISE REJECTION: ${e.reason}`;
        errors.push(error);
    });
    
    // Function to download errors
    window.downloadErrors = function() {
        const errorText = errors.join('\n');
        const blob = new Blob([errorText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'console-errors.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('Errors downloaded! Check your downloads folder for console-errors.txt');
    };
    
    // Function to show errors in console
    window.showErrors = function() {
        console.log('=== ALL CAPTURED ERRORS ===');
        errors.forEach(error => console.log(error));
        console.log('=== END OF ERRORS ===');
        console.log(`Total errors captured: ${errors.length}`);
    };
    
    console.log('🔍 Console error capturer installed!');
    console.log('Use downloadErrors() to save errors to file');
    console.log('Use showErrors() to display all errors');
    
    // Auto-show errors every 10 seconds if there are any
    setInterval(() => {
        if (errors.length > 0) {
            console.log(`📊 ${errors.length} errors captured so far. Use showErrors() to see them.`);
        }
    }, 10000);
})();