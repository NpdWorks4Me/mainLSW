import React, { useState } from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage(){
	const supabase = useSupabaseClient();
	const { toast } = useToast();
	const [email, setEmail] = useState('');
	const [sent, setSent] = useState(false);

	const handleReset = async (e) => {
		e.preventDefault();
		if (!supabase) {
			toast({ variant: 'destructive', title: 'Not configured', description: 'Password reset is not available in this environment.' });
			return;
		}
		try {
			const { data, error } = await supabase.auth.resetPasswordForEmail(email);
			if (error) {
				toast({ variant: 'destructive', title: 'Error', description: error.message });
			} else {
				setSent(true);
				toast({ title: 'Reset email sent', description: 'Check your inbox for instructions.' });
			}
		} catch (err) {
			toast({ variant: 'destructive', title: 'Error', description: err.message || 'Unexpected error' });
		}
	};

	return (
		<main className="max-w-md mx-auto px-4 py-12">
			<PageHelmet title="Forgot Password" />
			<ContentSection title="Forgot Password">
				{!sent ? (
					<form onSubmit={handleReset} className="space-y-4">
						<p className="text-gray-300">Enter your account email and we'll send password reset instructions.</p>
						<div>
							<label className="block text-sm text-gray-300">Email</label>
							<input className="w-full bg-[#08131f] border border-white/6 p-2 rounded mt-1 text-white" value={email} onChange={e => setEmail(e.target.value)} />
						</div>
						<div className="text-right">
							<Button primary type="submit">Send Reset Email</Button>
						</div>
					</form>
				) : (
					<div className="text-gray-300">A password reset email has been sent if that account exists. Check your inbox and follow the instructions.</div>
				)}
			</ContentSection>
		</main>
	);
}
