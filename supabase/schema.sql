CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    analysis JSONB NOT NULL,
    photo_quality_score FLOAT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own" ON analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own" ON analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own" ON analyses FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Service full access" ON analyses FOR ALL USING (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
