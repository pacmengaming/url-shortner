'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
        console.log(signInError)
        if (signInError.message.includes('Invalid login credentials')) {
            const { error: signUpError } = await supabase.auth.signUp({ email, password });

            if (signUpError) {
                console.log(signUpError)
                if (signUpError.message.includes('already registered')) {
                    return { error: 'This email is already registered. Please log in or reset your password.' };
                } else {
                    return { error: signUpError.message };
                }
            } else {
                return { success: 'Account created successfully! You can now log in.' };
            }
        } else {
            return { error: 'Incorrect password. Please try again.' };
        }
    }

    redirect('/dashboard');
    return null;
}


export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

