# Supabase Integration Documentation

## Overview

This document outlines the Supabase integration within our webapp template, covering authentication, database operations, and security best practices.

## Setup and Configuration

### Environment Variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These should be added to your `.env` file (use `env.example` as a template). Never commit actual keys to your repository.

### Local Development Setup

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Start local Supabase:
   ```bash
   npm run supabase:start
   ```

3. Run migrations:
   ```bash
   npm run supabase:migrate
   ```

4. Generate TypeScript types:
   ```bash
   npm run supabase:gen-types
   ```

## Authentication Implementation

Our template uses Supabase Auth for user management with the following features:

### Auth UI Components

For quick implementation, we use `@supabase/auth-ui-react`:

```tsx
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'

const AuthComponent = () => {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={['google', 'github']}
    />
  )
}
```

### Custom Auth Flows

For custom authentication flows, we've implemented helper functions in `src/lib/supabase.ts`:

```typescript
// Sign up
const { data, error } = await auth.signUp(email, password)

// Sign in
const { data, error } = await auth.signIn(email, password)

// Sign out
await auth.signOut()

// Get current user
const user = await auth.getCurrentUser()
```

### Auth State Management

Listen to auth state changes:

```typescript
const unsubscribe = auth.onAuthStateChange((user) => {
  // Update your app state with user information
})

// Clean up when component unmounts
return () => unsubscribe()
```

## Database Operations

### Table Structure

Our recommended basic schema:

```sql
-- users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- RLS policies for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);
create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### Querying Data

```typescript
// Select data
const { data, error } = await supabase
  .from('table_name')
  .select('column1, column2')
  .eq('column_name', 'value')
  .order('created_at', { ascending: false })
  .limit(10)

// Insert data
const { data, error } = await supabase
  .from('table_name')
  .insert([{ column1: 'value1', column2: 'value2' }])
  .select()

// Update data
const { data, error } = await supabase
  .from('table_name')
  .update({ column1: 'updated_value' })
  .eq('id', record_id)
  .select()

// Delete data
const { error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', record_id)
```

### Using React Query with Supabase

For optimal data fetching and caching:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// Fetch data
const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })
}

// Create data
const useCreateItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newItem) => {
      const { data, error } = await supabase
        .from('items')
        .insert([newItem])
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    }
  })
}
```

## Row Level Security (RLS)

Implement Row Level Security for all tables:

```sql
-- Enable RLS
alter table public.your_table enable row level security;

-- Create policies
create policy "Users can view their own data"
  on public.your_table for select
  using (auth.uid() = user_id);

create policy "Users can insert their own data"
  on public.your_table for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own data"
  on public.your_table for update
  using (auth.uid() = user_id);

create policy "Users can delete their own data"
  on public.your_table for delete
  using (auth.uid() = user_id);
```

## Storage Implementation

For file uploads:

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('bucket_name')
  .upload('file_path', file)

// Get public URL
const { data } = supabase.storage
  .from('bucket_name')
  .getPublicUrl('file_path')

// Download file
const { data, error } = await supabase.storage
  .from('bucket_name')
  .download('file_path')
```

## Edge Functions

For server-side functionality:

1. Create your function in `/supabase/functions/`:

```typescript
// supabase/functions/hello-world/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // Get data from request
    const body = await req.json()
    
    // Your function logic here
    
    return new Response(
      JSON.stringify({ message: 'Success', data: result }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

2. Deploy the function:
```bash
supabase functions deploy hello-world
```

3. Call from frontend:
```typescript
const { data, error } = await supabase.functions.invoke('hello-world', {
  body: { some: 'data' }
})
```

## Best Practices

1. **Type Safety**: Always use the generated TypeScript types from `supabase:gen-types`

2. **Error Handling**: Always check for errors in Supabase responses:
   ```typescript
   const { data, error } = await supabase.from('table').select()
   if (error) {
     // Handle error
     console.error('Error fetching data:', error)
     return
   }
   // Process data
   ```

3. **Authentication Flow**: Implement proper auth flow with protected routes:
   ```tsx
   // Example protected route component
   const ProtectedRoute = ({ children }) => {
     const [user, setUser] = useState(null)
     const [loading, setLoading] = useState(true)
     
     useEffect(() => {
       const checkAuth = async () => {
         const { data: { user } } = await supabase.auth.getUser()
         setUser(user)
         setLoading(false)
       }
       checkAuth()
     }, [])
     
     if (loading) return <div>Loading...</div>
     if (!user) return <Navigate to="/login" />
     
     return children
   }
   ```

4. **Security**: Never expose sensitive operations to the client. Use Edge Functions for sensitive operations.

5. **Performance**: Use React Query for optimal data fetching, caching, and state management with Supabase.

6. **Session Management**: Handle session refreshing and expiration gracefully.

## Troubleshooting

1. **Auth Issues**:
   - Check environment variables
   - Verify email confirmation settings in Supabase dashboard
   - Check browser console for CORS errors

2. **Database Query Issues**:
   - Verify RLS policies
   - Check for typos in table/column names
   - Validate data types match schema

3. **Common Errors**:
   - `JWT expired`: Handle token refresh
   - `No permission to perform this action`: Check RLS policies
   - `Foreign key violation`: Check referential integrity
