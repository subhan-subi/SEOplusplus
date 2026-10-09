'use strict';

const { findKeywords } = require('../services/keywordService');

/**
 * Controller to handle POST /api/keywords/find
 * Analyzes seed keyword and returns generated keyword ideas with types and search intents.
 */
async function getKeywordIdeas(req, res, next) {
  try {
    const rawKeyword = req.body?.keyword || req.body?.seed || req.body?.query;
    const country = req.body?.country;
    const language = req.body?.language;

    const result = await findKeywords(rawKeyword, { country, language });
    return res.json(result);
  } catch (err) {
    const statusCode = err.statusCode || err.status || 500;
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'Failed to generate keyword ideas. Please try again.'
    });
  }
}

module.exports = {
  getKeywordIdeas
};
