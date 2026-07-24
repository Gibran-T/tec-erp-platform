SELECT r."runCode", r."runSequence", r."runType", r.status, r."completionPercent", r."reflectionsEnabled",
       (SELECT count(*) FROM mission_attempt ma WHERE ma."pedagogicalCourseRunId"=r.id) AS attempts,
       (SELECT count(*) FROM mission_attempt ma WHERE ma."pedagogicalCourseRunId"=r.id AND ma.status='completed') AS completed,
       (SELECT count(*) FROM certificate c WHERE c."sourceRunId"=r.id) AS certs_linked,
       (SELECT count(*) FROM ai_interaction a WHERE a."pedagogicalCourseRunId"=r.id) AS ai_linked
FROM pedagogical_course_run r
JOIN employee e ON e.id=r."employeeId"
WHERE e."employeeNumber"='TECERP-2026-PILOT-001';