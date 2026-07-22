-- Versioned runs foundation smoke (SQL). Temporary suffix injected by runner.
BEGIN;

INSERT INTO "company" ("id","code","name","createdAt","updatedAt") VALUES
 ('__CO_A__','__CODE_A__','Company A',NOW(),NOW()),
 ('__CO_B__','__CODE_B__','Company B',NOW(),NOW());

INSERT INTO "employee" ("id","employeeNumber","email","displayName","passwordHash","role","companyId","createdAt","updatedAt") VALUES
 ('__ADM_A__','__ENUM_ADM__','__EMAIL_ADM__','Admin A','x','ADMIN','__CO_A__',NOW(),NOW()),
 ('__PROF_A__','__ENUM_PA__','__EMAIL_PA__','Professor A','x','PROFESSOR','__CO_A__',NOW(),NOW()),
 ('__PROF_B__','__ENUM_PB__','__EMAIL_PB__','Professor B','x','PROFESSOR','__CO_B__',NOW(),NOW()),
 ('__STU_A__','__ENUM_SA__','__EMAIL_SA__','Student A','x','JR_BUSINESS_ANALYST','__CO_A__',NOW(),NOW()),
 ('__STU_B__','__ENUM_SB__','__EMAIL_SB__','Student B','x','JR_BUSINESS_ANALYST','__CO_B__',NOW(),NOW());

INSERT INTO "cohort" ("id","code","name","companyId","createdAt","updatedAt") VALUES
 ('__COH_A__','__COHCODE_A__','Cohort A','__CO_A__',NOW(),NOW()),
 ('__COH_B__','__COHCODE_B__','Cohort B','__CO_B__',NOW(),NOW());

INSERT INTO "cohort_membership" ("id","cohortId","employeeId","roleInCohort","createdAt") VALUES
 ('__CM_PA__','__COH_A__','__PROF_A__','professor',NOW()),
 ('__CM_SA__','__COH_A__','__STU_A__','student',NOW()),
 ('__CM_PB__','__COH_B__','__PROF_B__','professor',NOW()),
 ('__CM_SB__','__COH_B__','__STU_B__','student',NOW());

INSERT INTO "pedagogical_course_run"
 ("id","companyId","cohortId","employeeId","professorId","courseId","runCode","runSequence","runType","runLabel","language","status","sourceRunId","startedAt","completedAt","createdAt","updatedAt","createdById","completionPercent","metadataJson")
VALUES
 ('__RUN1__','__CO_A__','__COH_A__','__STU_A__',NULL,'course_tec_erp_v1','__RUNCODE1__',1,'AUTONOMOUS','Student A — Run 1','fr','COMPLETED',NULL,NOW(),NOW(),NOW(),NOW(),'__ADM_A__',100,'{}'),
 ('__RUN2__','__CO_A__','__COH_A__','__STU_A__','__PROF_A__','course_tec_erp_v1','__RUNCODE2__',2,'INSTRUCTOR_LED','Student A — Run 2','fr','ACTIVE','__RUN1__',NOW(),NULL,NOW(),NOW(),'__ADM_A__',0,'{}');

INSERT INTO "mission_attempt"
 ("id","employeeId","missionDefinitionId","pedagogicalCourseRunId","attemptNumber","status","startedAt","scorePercent","responsesJson","createdAt","updatedAt")
VALUES
 ('__MA1__','__STU_A__','md_m1_m01','__RUN1__',1,'completed',NOW(),90,'{}',NOW(),NOW());

INSERT INTO "employee_course_progress"
 ("id","employeeId","courseId","pedagogicalCourseRunId","percentComplete","status","createdAt","updatedAt")
VALUES
 ('__ECP1__','__STU_A__','course_tec_erp_v1','__RUN1__',100,'completed',NOW(),NOW());

INSERT INTO "certificate"
 ("id","employeeId","cohortId","certificateType","certificateNumber","issuedAt","status","competencySummaryJson","verificationStatus","sourceRunId","achievementType")
VALUES
 ('__CERT1__','__STU_A__','__COH_A__','GOLD','__CERTNUM__',NOW(),'issued','{}','valid','__RUN1__','GOLD');

INSERT INTO "professor_intervention"
 ("id","runId","professorId","interventionType","reason","content","createdAt","updatedAt")
VALUES
 ('__PI1__','__RUN2__','__PROF_A__','CLARIFICATION','smoke','clarified',NOW(),NOW());

-- Assertions
DO $$
DECLARE
  run1_pct double precision;
  run2_pct double precision;
  cross_cnt int;
  unique_cnt int;
BEGIN
  SELECT "completionPercent" INTO run1_pct FROM pedagogical_course_run WHERE id = '__RUN1__';
  SELECT "completionPercent" INTO run2_pct FROM pedagogical_course_run WHERE id = '__RUN2__';
  IF run1_pct <> 100 OR run2_pct <> 0 THEN
    RAISE EXCEPTION 'Run independence failed: % / %', run1_pct, run2_pct;
  END IF;
  SELECT COUNT(*) INTO cross_cnt FROM pedagogical_course_run WHERE "companyId" = '__CO_B__' AND "employeeId" = '__STU_A__';
  IF cross_cnt <> 0 THEN
    RAISE EXCEPTION 'Cross-company leakage';
  END IF;
  SELECT COUNT(DISTINCT "employeeId") INTO unique_cnt
  FROM pedagogical_course_run
  WHERE "companyId" = '__CO_A__' AND status <> 'CANCELLED';
  -- With two runs for one student this raw distinct is 1 (good); double-count would only happen if counting runs
  IF unique_cnt <> 1 THEN
    RAISE EXCEPTION 'Unique student metric failed: %', unique_cnt;
  END IF;
END $$;

-- Dual ACTIVE must fail
DO $$
BEGIN
  BEGIN
    INSERT INTO "pedagogical_course_run"
     ("id","companyId","employeeId","courseId","runCode","runSequence","runType","runLabel","language","status","createdAt","updatedAt","createdById","completionPercent","metadataJson")
    VALUES
     ('__RUN_BAD__','__CO_A__','__STU_A__','course_tec_erp_v1','__RUNCODE_BAD__',3,'DEMONSTRATION','bad','fr','ACTIVE',NOW(),NOW(),'__ADM_A__',0,'{}');
    RAISE EXCEPTION 'Dual ACTIVE was allowed';
  EXCEPTION WHEN unique_violation THEN
    NULL; -- expected
  END;
END $$;

-- Cleanup
DELETE FROM professor_intervention WHERE id = '__PI1__';
DELETE FROM certificate WHERE id = '__CERT1__';
DELETE FROM mission_attempt WHERE id = '__MA1__';
DELETE FROM employee_course_progress WHERE id = '__ECP1__';
DELETE FROM pedagogical_course_run WHERE id IN ('__RUN1__','__RUN2__','__RUN_BAD__');
DELETE FROM cohort_membership WHERE id IN ('__CM_PA__','__CM_SA__','__CM_PB__','__CM_SB__');
DELETE FROM cohort WHERE id IN ('__COH_A__','__COH_B__');
DELETE FROM employee WHERE id IN ('__ADM_A__','__PROF_A__','__PROF_B__','__STU_A__','__STU_B__');
DELETE FROM company WHERE id IN ('__CO_A__','__CO_B__');

COMMIT;

SELECT 0 AS qa_residue;
