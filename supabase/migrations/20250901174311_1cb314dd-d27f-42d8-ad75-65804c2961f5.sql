-- Create a table for monthly planning
CREATE TABLE public.monthly_planning (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month_year, type, category, description)
);

-- Enable Row Level Security
ALTER TABLE public.monthly_planning ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own planning" 
ON public.monthly_planning 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own planning" 
ON public.monthly_planning 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own planning" 
ON public.monthly_planning 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own planning" 
ON public.monthly_planning 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_monthly_planning_updated_at
BEFORE UPDATE ON public.monthly_planning
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();