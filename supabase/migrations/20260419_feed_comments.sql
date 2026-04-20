-- Feed comments — inline replies on news, threads, bounties, reviews
CREATE TABLE IF NOT EXISTS feed_comments (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id    uuid        NOT NULL,
  item_type  text        NOT NULL CHECK (item_type IN ('news','thread','bounty','review')),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username   text        NOT NULL,
  content    text        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS feed_comments_item_idx
  ON feed_comments (item_id, item_type, created_at);

ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "Public read feed_comments"
  ON feed_comments FOR SELECT USING (true);

-- Only member/pro users can insert (enforced app-side + here via profiles join)
CREATE POLICY "Members can insert feed_comments"
  ON feed_comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND subscription_tier IN ('member','pro')
    )
  );

-- Authors can delete their own comments
CREATE POLICY "Authors can delete own feed_comments"
  ON feed_comments FOR DELETE USING (auth.uid() = user_id);
