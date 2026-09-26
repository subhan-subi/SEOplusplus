/**
 * Computes category scores, overall SEO score, summary counts, and ranked recommendations.
 */
function calculateScore(checks) {
  const categoryMap = {
    'Technical SEO': { key: 'technical', label: 'Technical SEO', weight: 0.30, checks: [] },
    'On-Page SEO': { key: 'onPage', label: 'On-Page SEO', weight: 0.35, checks: [] },
    'Content': { key: 'content', label: 'Content', weight: 0.20, checks: [] },
    'Performance': { key: 'performance', label: 'Performance', weight: 0.15, checks: [] }
  };

  let totalPassed = 0;
  let totalWarnings = 0;
  let totalFailed = 0;
  let totalInfo = 0;

  checks.forEach(check => {
    if (check.status === 'passed') totalPassed++;
    else if (check.status === 'warning') totalWarnings++;
    else if (check.status === 'failed') totalFailed++;
    else if (check.status === 'info') totalInfo++;

    if (categoryMap[check.category]) {
      categoryMap[check.category].checks.push(check);
    }
  });

  const severityWeights = {
    high: 3,
    medium: 2,
    low: 1,
    info: 0
  };

  const categories = {};
  let weightedOverallScore = 0;
  let totalWeightApplied = 0;

  for (const [catName, catData] of Object.entries(categoryMap)) {
    const list = catData.checks;
    let maxPoints = 0;
    let earnedPoints = 0;
    let catPassed = 0;
    let catWarnings = 0;
    let catFailed = 0;

    list.forEach(c => {
      const weight = severityWeights[c.severity] || 1;
      if (c.status === 'info') return;

      maxPoints += weight;
      if (c.status === 'passed') {
        earnedPoints += weight;
        catPassed++;
      } else if (c.status === 'warning') {
        earnedPoints += weight * 0.5; // partial credit for warnings
        catWarnings++;
      } else {
        catFailed++;
      }
    });

    const catScore = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 100;
    const catGrade = getGrade(catScore);

    categories[catData.key] = {
      label: catData.label,
      score: catScore,
      grade: catGrade,
      passed: catPassed,
      warnings: catWarnings,
      failed: catFailed,
      total: list.length
    };

    weightedOverallScore += catScore * catData.weight;
    totalWeightApplied += catData.weight;
  }

  const finalScore = Math.round(weightedOverallScore / totalWeightApplied);

  // Recommendations: extract issues (failed and warning) sorted by severity
  const severityRank = { high: 1, medium: 2, low: 3, info: 4 };
  const recommendations = checks
    .filter(c => c.status === 'failed' || c.status === 'warning')
    .sort((a, b) => (severityRank[a.severity] || 5) - (severityRank[b.severity] || 5))
    .map(c => ({
      id: c.id,
      title: c.title,
      category: c.category,
      severity: c.severity,
      status: c.status,
      recommendation: c.recommendation,
      whyItMatters: c.description
    }));

  return {
    score: finalScore,
    grade: getGrade(finalScore),
    summary: {
      passed: totalPassed,
      warnings: totalWarnings,
      failed: totalFailed,
      info: totalInfo,
      total: checks.length
    },
    categories,
    recommendations
  };
}

function getGrade(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 65) return 'Needs Improvement';
  return 'Poor';
}

module.exports = {
  calculateScore,
  getGrade
};
