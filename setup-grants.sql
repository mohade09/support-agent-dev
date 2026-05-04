-- Grant the support-agent-deb app's service principal SELECT access on the
-- schemas the agent reads. Run once after `databricks bundle deploy` (and any
-- time the app SP rotates).
--
-- App SP: app-65e2ao support-agent-deb (applicationId from `databricks
-- service-principals list`). Replace <APP_SP_APPLICATION_ID> with the
-- applicationId UUID before running.
--
-- Run via:
--   Databricks SQL editor (paste this file), OR
--   databricks workspace api do post /api/2.0/sql/statements ... (advanced)

GRANT USE CATALOG ON CATALOG debadm
  TO `<APP_SP_APPLICATION_ID>`;

GRANT USE SCHEMA ON SCHEMA debadm.shopflow_demo
  TO `<APP_SP_APPLICATION_ID>`;
GRANT SELECT ON SCHEMA debadm.shopflow_demo
  TO `<APP_SP_APPLICATION_ID>`;

GRANT USE SCHEMA ON SCHEMA debadm.ecom_gold
  TO `<APP_SP_APPLICATION_ID>`;
GRANT SELECT ON SCHEMA debadm.ecom_gold
  TO `<APP_SP_APPLICATION_ID>`;
