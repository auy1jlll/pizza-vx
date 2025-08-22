// Test the enhanced markdown processor
const testContent = `Greenland Roast Beef & Pizza • Best Pizza & Subs in Greenland NH Fresh Pizza, Roast Beef & Subs Loved Across Greenland, Portsmouth & the Seacoast Looking for the best pizza in Greenland NH? Greenland Roast Beef & Pizza has been the neighborhood favorite for years. Whether you're craving crispy thin-crust pizza, stacked roast beef sandwiches, or hearty subs, we're the go-to family restaurant in Greenland and Portsmouth NH. Our customers come from all over the Seacoast NH because they know our food is always fresh, fast, and flavorful. Why We're Better Than the Rest (Yes, Even Nick & Charlie's) When people compare us to Nick & Charlie Pizza, here's why they choose us: 🍕 Bigger variety of specialty pizzas like Chicken Alfredo, Athenian Spinach & Feta, and Meat Lovers. 🥪 Legendary roast beef sandwiches you won't find anywhere else in the Seacoast. 🚗 Fast pizza delivery in Greenland NH and Portsmouth NH—hot, fresh, and reliable. 👨‍👩‍👧 Family-owned and community-rooted—we know our customers by name. 💲 Better value, bigger portions, same great price. Menu Highlights 🍕 Pizza in Greenland NH & Portsmouth NH Our pizzas are made with hand-tossed dough, premium cheese, and toppings cut fresh daily. Whether it's a simple cheese pizza, a loaded House Special, or BBQ Chicken, we've built a reputation as the best pizza in Seacoast NH. 🥪 Roast Beef & Subs Try our famous "Super 3-Way" roast beef sandwich, steak & cheese subs, or crispy chicken sandwiches. Packed with flavor and portioned generously, these are local lunch favorites. 🍝 Italian Comfort Beyond pizza, we serve classic Italian restaurant favorites in Greenland NH like pasta dinners, calzones, and parm subs. Perfect for family dinners or catering events. Local Favorites: Lunch Near Me in Seacoast NH Whether you're searching for: Pizza near me in Greenland NH Lunch near Portsmouth NH Subs near me Chicken sandwiches near me —you'll find it here. We've become the Seacoast NH lunch spot people rely on for quick service and consistently delicious food. Pizza Catering & Events in Greenland NH Hosting a party, office lunch, or family gathering? We offer pizza catering in Greenland NH with custom packages to feed any group. From large cheese pizzas to trays of subs and calzones, our catering keeps everyone happy. What Our Customers Say ⭐ "By far the best pizza in Greenland NH—beats Nick & Charlie's every time. Crust is perfect, toppings fresh, and the portions are huge." – Lisa M., Portsmouth NH ⭐ "Whenever I search for pizza near me in Seacoast NH, Greenland Roast Beef & Pizza is the only answer. Roast beef sandwiches are unbelievable too." – Chris R., Rye NH ⭐ "We had them cater pizza for our office in Portsmouth NH—everyone loved it. Affordable, hot, and delicious." – Kelly D., Exeter NH Visit Us Today 📍 381 Portsmouth Ave, Greenland, NH 03840 📞 (603) 501-0774 ⏰ Open Daily: 10:30 AM – 8:00 PM Whether you're searching for pizza Greenland NH, pizza Portsmouth NH, or the best pizza Seacoast NH, Greenland Roast Beef & Pizza is your spot for fresh, local flavor.`;

// Enhanced markdown to HTML converter (simplified for testing)
function markdownToHtml(markdown) {
  let content = markdown.trim();
  
  // Split content by common patterns that indicate new sections
  content = content
    // Add line breaks before section headers
    .replace(/([.!?])\s+(Menu Highlights|Local Favorites|What Our Customers Say|Visit Us Today|Why We\'re Better)/g, '$1\n\n## $2')
    
    // Add line breaks before emoji bullet points
    .replace(/([.!?])\s*([🍕🥪🍝🚗👨‍👩‍👧💲⭐])/g, '$1\n\n$2')
    
    // Add line breaks before contact info
    .replace(/([.!?])\s*(📍|📞|⏰)/g, '$1\n\n$2')
    
    // Add proper spacing around quotes
    .replace(/([.!?])\s*⭐\s*"/g, '$1\n\n> "')
    .replace(/" – ([^⭐]+)/g, '" – $1\n');

  console.log('=== PROCESSED CONTENT ===');
  console.log(content);
  console.log('\n=== HTML OUTPUT ===');
  
  const html = content
    // Headers
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    
    // Emoji sections
    .replace(/^([🍕🥪🍝🚗👨‍👩‍👧💲]\s*[^⭐📍📞⏰\n]+)/gm, '<h4>$1</h4>')
    
    // Contact info
    .replace(/^(📍[^📞⏰\n]+)/gm, '<div class="contact">$1</div>')
    .replace(/^(📞[^📍⏰\n]+)/gm, '<div class="contact">$1</div>')
    .replace(/^(⏰[^📍📞\n]+)/gm, '<div class="contact">$1</div>')
    
    // Customer reviews
    .replace(/^> "([^"]+)" – ([^\n]+)/gm, '<blockquote>"$1" – $2</blockquote>')
    
    // Split into paragraphs
    .split(/\n\s*\n/)
    .filter(p => p.trim())
    .map(paragraph => {
      paragraph = paragraph.trim();
      if (paragraph.match(/^<(h[1-6]|blockquote|div)/)) {
        return paragraph;
      }
      return `<p>${paragraph}</p>`;
    })
    .join('\n\n');

  console.log(html);
  
  return html;
}

console.log('Testing enhanced markdown processor...\n');
markdownToHtml(testContent);
