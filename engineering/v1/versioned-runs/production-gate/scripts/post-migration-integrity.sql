SELECT migration_name, finished_at
FROM _prisma_migrations
WHERE migration_name LIKE '%pedagogical%' OR migration_name LIKE '%reflection%'
ORDER BY finished_at;

SELECT count(*) AS runs FROM pedagogical_course_run;

SELECT r."runCode", r."runSequence", r."runType", r.status, r."completionPercent", r."reflectionsEnabled", r."professorId"
FROM pedagogical_course_run r
JOIN employee e ON e.id = r."employeeId"
WHERE e."employeeNumber" = 'TECERP-2026-PILOT-001';

SELECT count(*) AS null_mission_fk FROM mission_attempt WHERE "pedagogicalCourseRunId" IS NULL;
SELECT count(*) AS null_course_fk FROM employee_course_progress WHERE "pedagogicalCourseRunId" IS NULL;
SELECT count(*) AS null_assess_fk FROM assessment_attempt WHERE "pedagogicalCourseRunId" IS NULL;
SELECT count(*) AS null_capstone_fk FROM capstone_submission WHERE "pedagogicalCourseRunId" IS NULL;
SELECT count(*) AS seq_ge_2 FROM pedagogical_course_run WHERE "runSequence" >= 2;
SELECT count(*) AS active_runs FROM pedagogical_course_run WHERE status = 'ACTIVE';
SELECT count(*) AS employees FROM employee;
SELECT count(*) AS professors FROM employee WHERE role = 'PROFESSOR';
SELECT count(*) AS certs, count(*) FILTER (WHERE status='issued') AS issued, count(*) FILTER (WHERE status='revoked') AS revoked FROM certificate;
SELECT status, "reviewStatus" FROM capstone_submission;
SELECT count(*) AS ai FROM ai_interaction;
SELECT count(*) AS mission_attempts FROM mission_attempt;
SELECT count(*) AS qa_employees FROM employee WHERE "employeeNumber" LIKE '__QA_%';
