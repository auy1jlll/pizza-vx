const { chromium } = require('playwright');

async function simpleVisualTest() {
    console.log('🎭 Simple Playwright visual test...');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        console.log('📸 Loading production site with extended timeout...');
        
        // Set longer timeout and try to load
        page.setDefaultTimeout(60000);
        
        await page.goto('http://91.99.194.255:3000', { 
            waitUntil: 'domcontentloaded',
            timeout: 60000 
        });
        
        console.log('✅ Page loaded successfully!');
        
        // Wait a bit for any dynamic content
        await page.waitForTimeout(5000);
        
        // Take screenshot
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = `production-screenshot-${timestamp}.png`;
        await page.screenshot({ 
            path: screenshotPath, 
            fullPage: false // Just visible area 
        });
        
        console.log(`✅ Screenshot saved: ${screenshotPath}`);
        
        // Basic visual analysis
        const pageAnalysis = await page.evaluate(() => {
            const body = document.body;
            const style = window.getComputedStyle(body);
            
            // Check if body has background styling
            const hasBackground = style.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                                 style.backgroundColor !== 'transparent' && 
                                 style.backgroundColor !== '';
            
            const hasGradient = style.backgroundImage && style.backgroundImage.includes('gradient');
            
            // Count elements with Tailwind-like classes
            const tailwindElements = document.querySelectorAll('[class*="bg-"], [class*="text-"], [class*="hover:"]').length;
            
            // Check for specific content
            const title = document.title;
            const hasMainContent = document.querySelector('main, section, .container') !== null;
            const bodyClasses = body.className;
            
            return {
                hasBackground,
                hasGradient,
                backgroundColor: style.backgroundColor,
                backgroundImage: style.backgroundImage.substring(0, 100),
                tailwindElements,
                title,
                hasMainContent,
                bodyClasses,
                bodyText: body.innerText.substring(0, 300)
            };
        });
        
        console.log('\n📊 Visual Analysis Results:');
        console.log('=' * 40);
        console.log('Background Color:', pageAnalysis.backgroundColor);
        console.log('Has Background Styling:', pageAnalysis.hasBackground);
        console.log('Has Gradient:', pageAnalysis.hasGradient);
        console.log('Background Image:', pageAnalysis.backgroundImage);
        console.log('Tailwind Elements Found:', pageAnalysis.tailwindElements);
        console.log('Page Title:', pageAnalysis.title);
        console.log('Has Main Content:', pageAnalysis.hasMainContent);
        console.log('Body Classes:', pageAnalysis.bodyClasses);
        console.log('\nBody Text Preview:');
        console.log(pageAnalysis.bodyText);
        
        if (pageAnalysis.tailwindElements === 0) {
            console.log('\n❌ NO TAILWIND STYLING DETECTED!');
            console.log('This suggests CSS is not loading properly.');
        } else {
            console.log('\n✅ Tailwind styling detected!');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

simpleVisualTest();
