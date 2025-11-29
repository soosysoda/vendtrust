// backend/routes/score.js
const express = require('express');
const router = express.Router();
const { computeScore } = require('../scoreService');
const db = require('../db');

router.post('/', async (req, res) => {
  try {
    const applicant = req.body;

    // compute score & decision
    const result = computeScore(applicant);

    // store audit: store minimal input + outputs for training & audit
    try {
      const insertSQL = `
        INSERT INTO score_audit (user_id, payload, result, created_at)
        VALUES ($1, $2, $3, now())
        RETURNING id
      `;
      const userId = applicant.user_id || null;
      await db.query(insertSQL, [userId, JSON.stringify(applicant), JSON.stringify(result)]);
    } catch (e) {
      console.warn('audit write failed', e.message);
    }

    // also upsert latest trust_score into a table for quick access
    if (applicant.user_id) {
      const upsertSQL = `
        INSERT INTO user_trust (user_id, trust_score, pd, dti, updated_at)
        VALUES ($1, $2, $3, $4, now())
        ON CONFLICT (user_id)
        DO UPDATE SET trust_score = EXCLUDED.trust_score, pd = EXCLUDED.pd, dti = EXCLUDED.dti, updated_at = now()
      `;
      await db.query(upsertSQL, [applicant.user_id, result.trust_score, result.pd, result.dti]);
    }

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal_error' });
  }
});

router.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = router;
