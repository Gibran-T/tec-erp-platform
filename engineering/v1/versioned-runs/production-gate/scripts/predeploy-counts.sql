-- Read-only pre-deploy counts (pre-migration production schema)
SELECT 'company' AS entity, count(*)::int AS n FROM company
UNION ALL SELECT 'employee', count(*)::int FROM employee
UNION ALL SELECT 'cohort', count(*)::int FROM cohort
UNION ALL SELECT 'cohort_membership', count(*)::int FROM cohort_membership
UNION ALL SELECT 'employee_course_progress', count(*)::int FROM employee_course_progress
UNION ALL SELECT 'employee_module_progress', count(*)::int FROM employee_module_progress
UNION ALL SELECT 'mission_attempt', count(*)::int FROM mission_attempt
UNION ALL SELECT 'assessment_definition', count(*)::int FROM assessment_definition
UNION ALL SELECT 'assessment_attempt', count(*)::int FROM assessment_attempt
UNION ALL SELECT 'capstone_submission', count(*)::int FROM capstone_submission
UNION ALL SELECT 'certificate', count(*)::int FROM certificate
UNION ALL SELECT 'ai_interaction', count(*)::int FROM ai_interaction
UNION ALL SELECT 'qa_employee_prefix', count(*)::int FROM employee
  WHERE "employeeNumber" LIKE '__QA_%' OR "employeeNumber" ILIKE 'qa_%' OR email ILIKE '%@qa.%'
UNION ALL SELECT 'pedagogical_course_run_table', CASE WHEN to_regclass('public.pedagogical_course_run') IS NULL THEN 0 ELSE 1 END
ORDER BY 1;

-- Employees that will receive Run 1 backfill
SELECT count(DISTINCT e.id)::int AS employees_with_learning
FROM employee e
WHERE EXISTS (SELECT 1 FROM employee_course_progress p WHERE p."employeeId" = e.id)
   OR EXISTS (SELECT 1 FROM employee_module_progress p WHERE p."employeeId" = e.id)
   OR EXISTS (SELECT 1 FROM mission_attempt a WHERE a."employeeId" = e.id)
   OR EXISTS (SELECT 1 FROM assessment_attempt a WHERE a."employeeId" = e.id)
   OR EXISTS (SELECT 1 FROM unlock_state u WHERE u."employeeId" = e.id)
   OR EXISTS (SELECT 1 FROM capstone_submission c WHERE c."employeeId" = e.id)
   OR EXISTS (SELECT 1 FROM certificate c WHERE c."employeeId" = e.id)
   OR EXISTS (SELECT 1 FROM ai_interaction a WHERE a."employeeId" = e.id);

SELECT migration_name, finished_at IS NOT NULL AS finished
FROM _prisma_migrations
ORDER BY finished_at NULLS LAST, migration_name;
