CREATE TABLE IF NOT EXISTS gfs_lead_nurture (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id text NOT NULL,
  email text NOT NULL,
  phone text,
  sequence_key text NOT NULL,
  step integer NOT NULL CHECK (step IN (1, 2)),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'cancelled', 'skipped')),
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  cancelled_at timestamptz,
  cancel_reason text,
  skip_reason text,
  resend_message_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gfs_lead_nurture_due_idx
  ON gfs_lead_nurture (status, scheduled_for);

CREATE INDEX IF NOT EXISTS gfs_lead_nurture_lead_idx
  ON gfs_lead_nurture (lead_id);

CREATE INDEX IF NOT EXISTS gfs_lead_nurture_sequence_idx
  ON gfs_lead_nurture (sequence_key, created_at DESC);

ALTER TABLE gfs_lead_nurture ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE gfs_lead_nurture FROM PUBLIC;
REVOKE ALL ON TABLE gfs_lead_nurture FROM anon;
REVOKE ALL ON TABLE gfs_lead_nurture FROM authenticated;
GRANT ALL ON TABLE gfs_lead_nurture TO service_role;
GRANT ALL ON TABLE gfs_lead_nurture TO postgres;
