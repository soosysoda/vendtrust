// backend/scoreService.js

// utility scoring functions ported from Python
function paymentHistoryScore(total, late) {
  total = Number(total) || 0;
  late = Number(late) || 0;
  if (total <= 0) return 0.5;
  const ph = 1 - (late / total) * 1.5;
  return Math.max(0, Math.min(1, ph));
}

function creditUtilisationScore(used, limit) {
  used = Number(used) || 0;
  limit = Number(limit) || 0;
  if (limit <= 0) return 1.0;
  const u = used / limit;
  if (u <= 0.30) return 1.0;
  if (u <= 0.50) return 0.7;
  if (u <= 0.75) return 0.4;
  return 0.1;
}

function creditAgeScore(years) {
  years = Number(years) || 0;
  if (years >= 8) return 1.0;
  if (years >= 5) return 0.8;
  if (years >= 3) return 0.6;
  if (years >= 1) return 0.4;
  return 0.2;
}

function creditMixScore(sec, unsec) {
  sec = Number(sec) || 0;
  unsec = Number(unsec) || 0;
  const total = sec + unsec;
  if (total === 0) return 0.5;
  const r = sec / total;
  if (r >= 0.3 && r <= 0.7) return 1.0;
  if (r === 0 || r === 1) return 0.5;
  return 0.7;
}

function inquiryScore(count) {
  count = Number(count) || 0;
  if (count <= 0) return 1.0;
  if (count === 1) return 0.8;
  if (count === 2) return 0.6;
  if (count === 3) return 0.3;
  return 0.1;
}

function baseTrustScore(PH, CU, CD, CM, NCI) {
  const weighted = 0.35 * PH + 0.30 * CU + 0.20 * CD + 0.10 * CM + 0.05 * NCI;
  const score = 300 + 300 * weighted;
  return Math.round(Math.max(300, Math.min(900, score)));
}

// PD models
function pdRuleModel(features) {
  let pd = 0.10;
  if (features.CU > 0.75) pd += 0.20;
  if (features.PH < 0.7) pd += 0.25;
  if (features.NCI <= 0.1) pd += 0.10;
  return Math.min(pd, 1.0);
}

function pdStatisticalModel(features) {
  const pd = 0.4 * (1 - features.PH) + 0.3 * (1 - features.CU) + 0.3 * (1 - features.CD);
  return Math.max(0, Math.min(1, pd));
}

function ensemblePD(features) {
  const pd1 = pdRuleModel(features);
  const pd2 = pdStatisticalModel(features);
  return (pd1 + pd2) / 2;
}

function fraudCheck(applicant) {
  const flags = [];
  if (applicant.suspicious_ip) flags.push('SUSPICIOUS_IP');
  if (applicant.device_changed) flags.push('DEVICE_MISMATCH');
  if (applicant.id_mismatch) flags.push('ID_VERIFICATION_FAILED');
  return { fraud: flags.length > 0, flags };
}

function ruleEngine(trust_score, PD, dti) {
  if (trust_score < 550) return { decision: 'REJECT_LOW_SCORE', reason: 'Score below threshold' };
  if (PD > 0.35) return { decision: 'REJECT_HIGH_PD', reason: 'Probability of default too high' };
  if (dti > 0.45) return { decision: 'REJECT_DTI', reason: 'Applicant has high EMI burden' };
  if (trust_score >= 550 && trust_score <= 650) return { decision: 'MANUAL_REVIEW', reason: 'Medium risk applicant' };
  return { decision: 'APPROVE', reason: 'All checks passed' };
}


// main compute function — returns object with details
function computeScore(applicant) {
  // sanitize numeric fields
  const total_payments = Math.max(0, Math.floor(applicant.total_payments || 0));
  const late_payments = Math.max(0, Math.floor(applicant.late_payments || 0));
  const credit_used = Math.max(0, Number(applicant.credit_used || 0));
  const credit_limit = Math.max(0, Number(applicant.credit_limit || 0));
  const credit_age_years = Math.max(0, Number(applicant.credit_age_years || 0));
  const secured_loans = Math.max(0, Math.floor(applicant.secured_loans || 0));
  const unsecured_loans = Math.max(0, Math.floor(applicant.unsecured_loans || 0));
  const inquiries_last_year = Math.max(0, Math.floor(applicant.inquiries_last_year || 0));
  const income = Math.max(0, Number(applicant.income || 0));
  const emi_obligations = Math.max(0, Number(applicant.emi_obligations || 0));

  // feature scores
  const PH = paymentHistoryScore(total_payments, late_payments);
  const CU = creditUtilisationScore(credit_used, credit_limit);
  const CD = creditAgeScore(credit_age_years);
  const CM = creditMixScore(secured_loans, unsecured_loans);
  const NCI = inquiryScore(inquiries_last_year);

  const base_score = baseTrustScore(PH, CU, CD, CM, NCI);

  const features = { PH, CU, CD, CM, NCI };
  const PD = ensemblePD(features);

  const dti = emi_obligations / Math.max(income, 1.0);

  const { fraud, flags } = fraudCheck(applicant);

  if (fraud) {
    return {
      decision: 'REJECT_FRAUD',
      reason: flags,
      trust_score: base_score,
      pd: Number(PD.toFixed(4)),
      dti: Number(dti.toFixed(4)),
      features
    };
  }

  const { decision, reason } = ruleEngine(base_score, PD, dti);

  return {
    decision,
    reason,
    trust_score: base_score,
    pd: Number(PD.toFixed(4)),
    dti: Number(dti.toFixed(4)),
    features
  };
}

module.exports = { computeScore };
