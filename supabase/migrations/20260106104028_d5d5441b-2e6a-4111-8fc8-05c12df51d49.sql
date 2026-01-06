-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'community_member', 'driver');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  region TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'community_member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create regions table for pilot cities
CREATE TABLE public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT NOT NULL DEFAULT 'planned',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create driver scores table
CREATE TABLE public.driver_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  safety_score DECIMAL(5, 2) NOT NULL DEFAULT 50.00,
  empathy_score DECIMAL(5, 2) NOT NULL DEFAULT 50.00,
  harmony_score DECIMAL(5, 2) NOT NULL DEFAULT 50.00,
  total_trips INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create community proposals table
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  region_id UUID REFERENCES public.regions(id),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  votes_for INTEGER NOT NULL DEFAULT 0,
  votes_against INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closes_at TIMESTAMPTZ
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('for', 'against')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (proposal_id, user_id)
);

-- Create wildlife events table for map
CREATE TABLE public.wildlife_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID REFERENCES public.regions(id),
  event_type TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  description TEXT,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wildlife_events ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- User roles policies (only admins can modify)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Regions policies (public read)
CREATE POLICY "Regions are viewable by everyone"
  ON public.regions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage regions"
  ON public.regions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Driver scores policies
CREATE POLICY "Driver scores are viewable by everyone"
  ON public.driver_scores FOR SELECT
  USING (true);

CREATE POLICY "Drivers can view their own scores"
  ON public.driver_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can update driver scores"
  ON public.driver_scores FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Drivers can insert their initial score"
  ON public.driver_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Proposals policies
CREATE POLICY "Proposals are viewable by everyone"
  ON public.proposals FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create proposals"
  ON public.proposals FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their proposals"
  ON public.proposals FOR UPDATE
  USING (auth.uid() = author_id);

-- Votes policies
CREATE POLICY "Votes are viewable by everyone"
  ON public.votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change their vote"
  ON public.votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their vote"
  ON public.votes FOR DELETE
  USING (auth.uid() = user_id);

-- Wildlife events policies (public read)
CREATE POLICY "Wildlife events are viewable by everyone"
  ON public.wildlife_events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage wildlife events"
  ON public.wildlife_events FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'community_member');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update vote counts
CREATE OR REPLACE FUNCTION public.update_vote_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'for' THEN
      UPDATE public.proposals SET votes_for = votes_for + 1 WHERE id = NEW.proposal_id;
    ELSE
      UPDATE public.proposals SET votes_against = votes_against + 1 WHERE id = NEW.proposal_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'for' THEN
      UPDATE public.proposals SET votes_for = votes_for - 1 WHERE id = OLD.proposal_id;
    ELSE
      UPDATE public.proposals SET votes_against = votes_against - 1 WHERE id = OLD.proposal_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_vote_change
  AFTER INSERT OR DELETE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.update_vote_counts();

-- Insert seed data for regions
INSERT INTO public.regions (name, country, latitude, longitude, status, description) VALUES
  ('Kampala', 'Uganda', -0.3476, 32.5825, 'active', 'Urban pilot hub with B-DOS equipped buses'),
  ('Nairobi', 'Kenya', -1.2921, 36.8219, 'active', 'Smart road infrastructure deployment'),
  ('Accra', 'Ghana', 5.6037, -0.1870, 'active', 'Community governance pilot'),
  ('Cape Town', 'South Africa', -33.9249, 18.4241, 'planned', 'Wildlife corridor integration'),
  ('Kigali', 'Rwanda', -1.9403, 29.8739, 'planned', 'Clean mobility initiative');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_driver_scores_updated_at
  BEFORE UPDATE ON public.driver_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();