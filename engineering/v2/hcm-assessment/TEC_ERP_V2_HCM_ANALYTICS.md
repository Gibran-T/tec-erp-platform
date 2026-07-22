# TEC.ERP V2 — HCM Analytics

Dimensions: curriculumVersion, assessment code, run, module, mission, competency, question type, difficulty, quantitative flag, privacy/governance tag, attempt number, pass/fail.

Outputs: average, success rate, median, question success rate, competency breakdown, M8-M01/M02/M03 breakdown, most-missed, quantitative error rate, privacy/governance error rate.

Official cohort metrics use one official run per learner (no double-count).
Professor endpoint: `GET /api/v1/professor/analytics/hcm-assessment`.
