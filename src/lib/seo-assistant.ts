// SEO Content Assistant - Real-time SEO optimization for WYSIWYG editor
// Provides keyword analysis, competitor insights, and content scoring

export interface SEOAnalysis {
  score: number;
  suggestions: string[];
  keywordDensity: Record<string, number>;
  readability: {
    score: number;
    level: string;
    suggestions: string[];
  };
  meta: {
    title: {
      length: number;
      isOptimal: boolean;
      suggestions: string[];
    };
    description: {
      length: number;
      isOptimal: boolean;
      suggestions: string[];
    };
  };
  localSEO: {
    score: number;
    mentions: string[];
    suggestions: string[];
  };
  competition: {
    targetKeywords: string[];
    competitorGaps: string[];
    opportunities: string[];
  };
}

export class SEOContentAssistant {
  private targetKeywords: string[] = [
    'pizza Greenland NH',
    'pizza Portsmouth NH',
    'pizza delivery Greenland',
    'best pizza Seacoast NH',
    'Italian restaurant Greenland NH',
    'pizza near me',
    'family restaurant Portsmouth',
    'pizza catering Greenland'
  ];

  private localTerms: string[] = [
    'Greenland',
    'Portsmouth',
    'Seacoast',
    'New Hampshire',
    'NH',
    'Rye',
    'Stratham',
    'Newington'
  ];

  private competitors: string[] = [
    'Nick & Charlie Pizza',
    'local pizza places',
    'Portsmouth pizza restaurants'
  ];

  // Main SEO analysis function
  analyzeSEO(content: string, title: string, metaDescription: string): SEOAnalysis {
    const wordCount = this.getWordCount(content);
    const keywordDensity = this.analyzeKeywordDensity(content);
    const readability = this.analyzeReadability(content);
    const metaAnalysis = this.analyzeMetadata(title, metaDescription);
    const localSEOAnalysis = this.analyzeLocalSEO(content);
    const competitionAnalysis = this.analyzeCompetition(content, title);

    const score = this.calculateOverallScore({
      keywordDensity,
      readability,
      metaAnalysis,
      localSEOAnalysis,
      competitionAnalysis,
      wordCount
    });

    const suggestions = this.generateSuggestions({
      keywordDensity,
      readability,
      metaAnalysis,
      localSEOAnalysis,
      competitionAnalysis,
      wordCount
    });

    return {
      score,
      suggestions,
      keywordDensity,
      readability,
      meta: metaAnalysis,
      localSEO: localSEOAnalysis,
      competition: competitionAnalysis
    };
  }

  // Keyword density analysis
  private analyzeKeywordDensity(content: string): Record<string, number> {
    const text = content.toLowerCase();
    const words = text.split(/\s+/).length;
    const density: Record<string, number> = {};

    this.targetKeywords.forEach(keyword => {
      const regex = new RegExp(keyword.toLowerCase(), 'gi');
      const matches = (text.match(regex) || []).length;
      density[keyword] = (matches / words) * 100;
    });

    return density;
  }

  // Readability analysis using simplified Flesch-Kincaid
  private analyzeReadability(content: string): SEOAnalysis['readability'] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = content.split(/\s+/).length;
    const syllables = this.countSyllables(content);

    const fleschScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    
    let level = 'Graduate';
    let suggestions: string[] = [];

    if (fleschScore >= 90) {
      level = 'Very Easy';
    } else if (fleschScore >= 80) {
      level = 'Easy';
    } else if (fleschScore >= 70) {
      level = 'Fairly Easy';
      suggestions.push('Consider using shorter sentences for better readability');
    } else if (fleschScore >= 60) {
      level = 'Standard';
      suggestions.push('Try to simplify some complex sentences');
    } else if (fleschScore >= 50) {
      level = 'Fairly Difficult';
      suggestions.push('Break up long paragraphs and use simpler words');
    } else {
      level = 'Difficult';
      suggestions.push('Content is too complex - simplify language and sentence structure');
    }

    return {
      score: Math.max(0, Math.min(100, fleschScore)),
      level,
      suggestions
    };
  }

  // Local SEO analysis
  private analyzeLocalSEO(content: string): SEOAnalysis['localSEO'] {
    const text = content.toLowerCase();
    const mentions: string[] = [];
    let score = 0;

    this.localTerms.forEach(term => {
      if (text.includes(term.toLowerCase())) {
        mentions.push(term);
        score += 10;
      }
    });

    const suggestions: string[] = [];
    
    if (!mentions.includes('Greenland')) {
      suggestions.push('Add "Greenland" to improve local SEO relevance');
    }
    if (!mentions.includes('Portsmouth')) {
      suggestions.push('Consider mentioning "Portsmouth" to expand local reach');
    }
    if (!text.includes('near me') && !text.includes('local')) {
      suggestions.push('Include phrases like "near me" or "local" for voice search optimization');
    }

    return {
      score: Math.min(100, score),
      mentions,
      suggestions
    };
  }

  // Competition analysis
  private analyzeCompetition(content: string, title: string): SEOAnalysis['competition'] {
    const text = content.toLowerCase();
    const titleLower = title.toLowerCase();
    
    const targetKeywords = this.targetKeywords.filter(keyword => 
      text.includes(keyword.toLowerCase()) || titleLower.includes(keyword.toLowerCase())
    );

    const competitorGaps: string[] = [];
    const opportunities: string[] = [];

    // Identify missing competitive keywords
    if (!text.includes('better than') && !text.includes('superior')) {
      competitorGaps.push('No competitive positioning statements found');
      opportunities.push('Add competitive advantages over Nick & Charlie Pizza');
    }

    if (!text.includes('award') && !text.includes('best') && !text.includes('#1')) {
      opportunities.push('Include awards or recognition to build authority');
    }

    if (!text.includes('review') && !text.includes('rating') && !text.includes('customer')) {
      opportunities.push('Add customer testimonials or review mentions');
    }

    return {
      targetKeywords,
      competitorGaps,
      opportunities
    };
  }

  // Metadata analysis
  private analyzeMetadata(title: string, metaDescription: string): SEOAnalysis['meta'] {
    const titleAnalysis = {
      length: title.length,
      isOptimal: title.length >= 30 && title.length <= 60,
      suggestions: [] as string[]
    };

    const descriptionAnalysis = {
      length: metaDescription.length,
      isOptimal: metaDescription.length >= 120 && metaDescription.length <= 160,
      suggestions: [] as string[]
    };

    // Title suggestions
    if (title.length < 30) {
      titleAnalysis.suggestions.push('Title is too short - add more descriptive keywords');
    } else if (title.length > 60) {
      titleAnalysis.suggestions.push('Title may be truncated in search results - consider shortening');
    }

    if (!title.toLowerCase().includes('greenland')) {
      titleAnalysis.suggestions.push('Include "Greenland" in title for local SEO');
    }

    // Meta description suggestions
    if (metaDescription.length < 120) {
      descriptionAnalysis.suggestions.push('Meta description is too short - add more compelling details');
    } else if (metaDescription.length > 160) {
      descriptionAnalysis.suggestions.push('Meta description may be truncated - consider shortening');
    }

    if (!metaDescription.toLowerCase().includes('pizza')) {
      descriptionAnalysis.suggestions.push('Include primary keyword "pizza" in meta description');
    }

    return {
      title: titleAnalysis,
      description: descriptionAnalysis
    };
  }

  // Overall SEO score calculation
  private calculateOverallScore(analysis: any): number {
    let score = 0;
    let factors = 0;

    // Keyword density scoring (0-25 points)
    const primaryKeywordDensity = analysis.keywordDensity['pizza Greenland NH'] || 0;
    if (primaryKeywordDensity > 0.5 && primaryKeywordDensity < 3) {
      score += 25;
    } else if (primaryKeywordDensity > 0) {
      score += 15;
    }
    factors++;

    // Readability scoring (0-20 points)
    score += (analysis.readability.score / 100) * 20;
    factors++;

    // Meta optimization (0-25 points)
    if (analysis.metaAnalysis.title.isOptimal) score += 15;
    if (analysis.metaAnalysis.description.isOptimal) score += 10;
    factors++;

    // Local SEO (0-20 points)
    score += (analysis.localSEOAnalysis.score / 100) * 20;
    factors++;

    // Content length (0-10 points)
    if (analysis.wordCount > 300 && analysis.wordCount < 2000) {
      score += 10;
    } else if (analysis.wordCount > 150) {
      score += 5;
    }
    factors++;

    return Math.round(score);
  }

  // Generate actionable suggestions
  private generateSuggestions(analysis: any): string[] {
    const suggestions: string[] = [];

    // Keyword suggestions
    const primaryDensity = analysis.keywordDensity['pizza Greenland NH'] || 0;
    if (primaryDensity === 0) {
      suggestions.push('🎯 Add your primary keyword "pizza Greenland NH" to the content');
    } else if (primaryDensity > 3) {
      suggestions.push('⚠️ Primary keyword density is too high - reduce repetition');
    }

    // Content length suggestions
    if (analysis.wordCount < 300) {
      suggestions.push('📝 Content is too short - aim for 300-800 words for better SEO');
    } else if (analysis.wordCount > 2000) {
      suggestions.push('✂️ Content is very long - consider breaking into multiple pages');
    }

    // Local SEO suggestions
    if (analysis.localSEOAnalysis.score < 50) {
      suggestions.push('📍 Add more local references (Greenland, Portsmouth, Seacoast NH)');
    }

    // Competitive suggestions
    if (analysis.competitionAnalysis.competitorGaps.length > 0) {
      suggestions.push('🏆 Add competitive advantages over Nick & Charlie Pizza');
    }

    // Meta suggestions
    if (!analysis.metaAnalysis.title.isOptimal) {
      suggestions.push('📋 Optimize title length (30-60 characters)');
    }

    if (!analysis.metaAnalysis.description.isOptimal) {
      suggestions.push('📝 Optimize meta description length (120-160 characters)');
    }

    return suggestions;
  }

  // Helper functions
  private getWordCount(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let syllableCount = 0;

    words.forEach(word => {
      word = word.replace(/[^a-z]/g, '');
      if (word.length <= 3) {
        syllableCount += 1;
      } else {
        const vowels = word.match(/[aeiouy]+/g);
        syllableCount += vowels ? vowels.length : 1;
      }
    });

    return syllableCount;
  }

  // Real-time analysis for live editing
  analyzeRealTime(content: string, title: string, metaDescription: string): {
    score: number;
    topSuggestions: string[];
    keywordStatus: Record<string, 'missing' | 'good' | 'overused'>;
  } {
    const analysis = this.analyzeSEO(content, title, metaDescription);
    
    const keywordStatus: Record<string, 'missing' | 'good' | 'overused'> = {};
    Object.entries(analysis.keywordDensity).forEach(([keyword, density]) => {
      if (density === 0) {
        keywordStatus[keyword] = 'missing';
      } else if (density > 3) {
        keywordStatus[keyword] = 'overused';
      } else {
        keywordStatus[keyword] = 'good';
      }
    });

    return {
      score: analysis.score,
      topSuggestions: analysis.suggestions.slice(0, 3),
      keywordStatus
    };
  }
}
