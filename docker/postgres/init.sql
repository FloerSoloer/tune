CREATE TABLE
  public.artist_cluster (
    "id" serial PRIMARY KEY,
    -- 22-char Query ID (don't expose serial id)
    "qid" text UNIQUE NOT NULL,
    -- <=64-char
    "name" text NOT NULL,
    "review_pending" boolean DEFAULT false
  );

CREATE TABLE
  public.band_member (
    "band" int NOT NULL,
    "member" int NOT NULL,
    PRIMARY KEY ("band", "member"),
    FOREIGN KEY ("band") REFERENCES public.artist_cluster ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("member") REFERENCES public.artist_cluster ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE
  public.track_cluster (
    "id" serial PRIMARY KEY,
    -- 22-char Query ID (don't expose serial id)
    "qid" text UNIQUE NOT NULL,
    -- <=64-char
    "name" text NOT NULL,
    "len" smallint NOT NULL,
    "review_pending" boolean DEFAULT false,
    -- Overall
    -- 0=bad; 1=interesting; 2=shareable; 3=performable; 4=best
    "review_oa" smallint NULL,
    -- Composition
    "review_comp" smallint NULL,
    -- how well title<=>music | lore | lyrical meaning
    "review_meaning" smallint NULL
  );

CREATE TABLE
  public.track_part (
    "id" serial PRIMARY KEY,
    -- 22-char Query ID (don't expose serial id)
    "qid" text UNIQUE NOT NULL,
    "track" int NOT NULL,
    -- Timestamps
    ts_created timestamp DEFAULT NOW(),
    ts_updated timestamp DEFAULT NOW(),
    -- "start" <= "end" AND VALUE BETWEEN 0 AND track.len
    "start" smallint DEFAULT 0,
    "end" smallint DEFAULT 0,
    "review_pending" boolean DEFAULT false,
    -- <=512-char
    "review" text DEFAULT '',
    FOREIGN KEY ("track") REFERENCES public.track_cluster ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE
  public.track_remake (
    "track" int NOT NULL,
    "remake" int NOT NULL,
    "review_pending" boolean DEFAULT false,
    -- relative to track
    -- -2=butchered; -1=worsened; 0=same; 1=improved; 2=restored
    "review_oa" smallint NULL,
    "review_comp" smallint NULL,
    "review_meaning" smallint NULL,
    PRIMARY KEY ("track", "remake"),
    FOREIGN KEY ("track") REFERENCES public.track_cluster ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("remake") REFERENCES public.track_cluster ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE
  public.tag (
    -- <=32-char
    "name" text PRIMARY KEY,
    "category" text DEFAULT 'Others'
  );

CREATE TABLE
  public.tag_super (
    "tag" text NOT NULL,
    "super" text NOT NULL,
    PRIMARY KEY ("tag", "super"),
    FOREIGN KEY ("tag") REFERENCES public.tag ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("super") REFERENCES public.tag ("name") ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE
  public.artist (
    -- <=30-char External ID (YT, Spotify, SoundCloud)
    -- [sc|sp|yt]:<id>
    "id" text PRIMARY KEY,
    "cluster" int NOT NULL,
    FOREIGN KEY ("cluster") REFERENCES public.artist_cluster ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE
  public.track (
    -- <=40-char External ID (YT, Spotify, SoundCloud)
    -- [sc|sp|yt]:<id>:<start>-<end>
    "id" text PRIMARY KEY,
    "cluster" int NOT NULL,
    FOREIGN KEY ("cluster") REFERENCES public.track_cluster ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE
  public.track_artist (
    "track" int NOT NULL,
    "artist" int NOT NULL,
    PRIMARY KEY ("track", "artist"),  
    FOREIGN KEY ("artist") REFERENCES public.artist_cluster ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("track") REFERENCES public.track_cluster ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE
  public.part_tag (
    "part" int NOT NULL,
    "tag" text NOT NULL,
    PRIMARY KEY ("part", "tag"),
    FOREIGN KEY ("tag") REFERENCES public.tag ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("part") REFERENCES public.track_part ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );
