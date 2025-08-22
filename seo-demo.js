/**
 * SEO Content Assistant Demo Script
 * Demonstrates the advanced SEO features of the restaurant app
 */

/**
 * SEO Content Assistant Demo Script
 * Demonstrates the advanced SEO features of the restaurant app
 */

// Simple Node.js compatible SEO Assistant for demo
class SEOContentAssistant {
  constructor() {
    this.targetKeywords = [
      'pizza Greenland NH',
      'best pizza Greenland',
      'Greenland NH restaurant',
      'pizza delivery Greenland',
      'Nick Charlie Pizza',
      'RestoApp'
    ];
  }

  analyzeKeywordDensity(content) {
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = {};
    
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    const keywords = Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / words.length) * 100
      }))
      .sort((a, b) => b.count - a.count);
    
    return { keywords, totalWords: words.length };
  }

  analyzeLocalSEO(content, title, metaDescription) {
    const text = `${title} ${metaDescription} ${content}`.toLowerCase();
    const cityMentions = (text.match(/greenland/g) || []).length;
    const stateMentions = (text.match(/new hampshire|nh\b/g) || []).length;
    const localTerms = (text.match(/local|community|neighborhood|area/g) || []).length;
    
    const score = Math.min(100, (cityMentions * 20) + (stateMentions * 15) + (localTerms * 5));
    
    return {
      score,
      cityMentions,
      stateMentions,
      localTerms
    };
  }

  analyzeCompetition(content) {
    const text = content.toLowerCase();
    const competitorMentions = (text.match(/nick.*charlie|charlie.*nick/g) || []).length;
    const advantages = [];
    
    if (text.includes('faster')) advantages.push('Faster delivery service');
    if (text.includes('fresh')) advantages.push('Fresh ingredients');
    if (text.includes('authentic')) advantages.push('Authentic recipes');
    if (text.includes('better')) advantages.push('Superior quality');
    
    const score = Math.min(100, (competitorMentions * 25) + (advantages.length * 15));
    
    return {
      score,
      competitorMentions,
      advantages
    };
  }

  analyzeReadability(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const syllables = words.reduce((total, word) => total + this.countSyllables(word), 0);
    
    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    let gradeLevel;
    if (fleschScore >= 90) gradeLevel = '5th grade';
    else if (fleschScore >= 80) gradeLevel = '6th grade';
    else if (fleschScore >= 70) gradeLevel = '7th grade';
    else if (fleschScore >= 60) gradeLevel = '8th-9th grade';
    else if (fleschScore >= 50) gradeLevel = '10th-12th grade';
    else gradeLevel = 'College level';
    
    return {
      fleschScore: Math.max(0, fleschScore),
      gradeLevel,
      avgSentenceLength,
      complexWords: words.filter(word => this.countSyllables(word) >= 3).length
    };
  }

  countSyllables(word) {
    return Math.max(1, word.toLowerCase().replace(/[^aeiou]/g, '').length);
  }

  analyzeRealTime(content, title, metaDescription) {
    const text = `${title} ${metaDescription} ${content}`.toLowerCase();
    
    const keywordStatus = {};
    this.targetKeywords.forEach(keyword => {
      const mentions = (text.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
      if (mentions === 0) keywordStatus[keyword] = 'missing';
      else if (mentions <= 3) keywordStatus[keyword] = 'good';
      else keywordStatus[keyword] = 'overused';
    });
    
    const suggestions = [];
    if (keywordStatus['pizza Greenland NH'] === 'missing') {
      suggestions.push('Add "pizza Greenland NH" to improve local search ranking');
    }
    if (keywordStatus['Nick Charlie Pizza'] === 'missing') {
      suggestions.push('Mention competitor "Nick & Charlie Pizza" for competitive advantage');
    }
    if (content.length < 300) {
      suggestions.push('Content is too short - aim for 500+ words for better SEO');
    }
    
    const goodKeywords = Object.values(keywordStatus).filter(s => s === 'good').length;
    const score = Math.round((goodKeywords / this.targetKeywords.length) * 100);
    
    return {
      score,
      keywordStatus,
      topSuggestions: suggestions.slice(0, 3)
    };
  }
}

async function demoSEOAssistant() {
  console.log('\n🚀 RestoApp SEO Content Assistant Demo\n');
  console.log('========================================\n');
  
  const assistant = new SEOContentAssistant();
  
  // Demo content for a restaurant page
  const title = 'Best Pizza in Greenland, NH - RestoApp Restaurant';
  const metaDescription = 'Discover the best pizza in Greenland, NH at RestoApp. Fresh ingredients, authentic Italian recipes, and faster delivery than Nick & Charlie Pizza.';
  const content = `
# Welcome to RestoApp - Greenland NH's Premier Pizza Destination

## Why Choose RestoApp Over Nick & Charlie Pizza?

At RestoApp, we're proud to serve **the best pizza in Greenland, NH**. Unlike our competitors, we focus on:

### Fresh, Local Ingredients
- Farm-fresh vegetables from local New Hampshire farms
- Artisanal cheese from Vermont dairies
- House-made sauce with Italian herbs

### Faster Delivery
Our delivery service is **30% faster** than Nick & Charlie Pizza, ensuring your pizza arrives hot and fresh.

### Authentic Italian Recipes
Our chef trained in Naples, Italy, bringing authentic pizza-making techniques to Greenland, NH.

## Customer Reviews

*"Best pizza in Greenland, NH! Way better than Nick & Charlie Pizza. The delivery was super fast too!"* - Sarah M.

*"RestoApp has completely changed our pizza nights. The quality is incredible!"* - Mike D.

## Location & Hours

Visit us at our Greenland, NH location:
- Address: 123 Pizza Street, Greenland, NH 03840
- Phone: (603) 555-PIZZA
- Hours: Mon-Sun 11AM-11PM

### Order Online Today!

Experience why RestoApp is quickly becoming Greenland NH's favorite pizza restaurant. Order online for pickup or delivery!
  `;

  console.log('📝 Analyzing Content...\n');
  
  // Full SEO Analysis
  const analysis = assistant.analyzeRealTime(content, title, metaDescription);
  
  console.log(`✨ SEO Score: ${analysis.score}/100`);
  console.log(`📊 Content Length: ${content.length} characters`);
  console.log(`🎯 Target Location: Greenland, NH`);
  console.log(`🏆 Competitor: Nick & Charlie Pizza\n`);
  
  console.log('🔍 Keyword Analysis:');
  Object.entries(analysis.keywordStatus).forEach(([keyword, status]) => {
    const emoji = status === 'good' ? '✅' : status === 'missing' ? '❌' : '⚠️';
    console.log(`  ${emoji} ${keyword}: ${status}`);
  });
  
  console.log('\n💡 Top SEO Recommendations:');
  analysis.topSuggestions.forEach((suggestion, index) => {
    console.log(`  ${index + 1}. ${suggestion}`);
  });
  
  // Detailed Keyword Analysis
  console.log('\n📈 Keyword Density Analysis:');
  const keywordAnalysis = assistant.analyzeKeywordDensity(content);
  keywordAnalysis.keywords.slice(0, 10).forEach(keyword => {
    console.log(`  "${keyword.word}": ${keyword.count} times (${keyword.density.toFixed(1)}%)`);
  });
  
  // Local SEO Analysis
  console.log('\n🏠 Local SEO Analysis:');
  const localAnalysis = assistant.analyzeLocalSEO(content, title, metaDescription);
  console.log(`  Score: ${localAnalysis.score}/100`);
  console.log(`  City mentions: ${localAnalysis.cityMentions}`);
  console.log(`  State mentions: ${localAnalysis.stateMentions}`);
  console.log(`  Local terms: ${localAnalysis.localTerms}`);
  
  // Competitive Analysis
  console.log('\n🥊 Competitive Analysis:');
  const competitiveAnalysis = assistant.analyzeCompetition(content);
  console.log(`  Score: ${competitiveAnalysis.score}/100`);
  console.log(`  Competitor mentions: ${competitiveAnalysis.competitorMentions}`);
  console.log(`  Competitive advantages: ${competitiveAnalysis.advantages.length}`);
  
  competitiveAnalysis.advantages.forEach((advantage, index) => {
    console.log(`    ${index + 1}. ${advantage}`);
  });
  
  // Readability Analysis
  console.log('\n📖 Readability Analysis:');
  const readabilityAnalysis = assistant.analyzeReadability(content);
  console.log(`  Flesch Score: ${readabilityAnalysis.fleschScore.toFixed(1)}`);
  console.log(`  Grade Level: ${readabilityAnalysis.gradeLevel}`);
  console.log(`  Avg Sentence Length: ${readabilityAnalysis.avgSentenceLength.toFixed(1)} words`);
  console.log(`  Complex Words: ${readabilityAnalysis.complexWords}`);
  
  console.log('\n🎯 SEO Optimization Summary:');
  console.log('==========================================');
  console.log(`✅ Target Keywords: ${Object.values(analysis.keywordStatus).filter(s => s === 'good').length} optimized`);
  console.log(`📍 Local SEO: ${localAnalysis.score >= 80 ? 'Excellent' : localAnalysis.score >= 60 ? 'Good' : 'Needs Work'}`);
  console.log(`🏆 Competitive Edge: ${competitiveAnalysis.advantages.length} advantages identified`);
  console.log(`📚 Readability: ${readabilityAnalysis.gradeLevel} (${readabilityAnalysis.fleschScore >= 60 ? 'Good' : 'Could improve'})`);
  
  console.log('\n✨ RestoApp is ready to outrank the competition! 🚀\n');
}

// Run the demo
demoSEOAssistant().catch(console.error);
