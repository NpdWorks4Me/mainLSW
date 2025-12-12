import React, { useState } from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/Button';

export default function SignUpPage(){
	const { signUp } = useAuth();
	const { toast } = useToast();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSignUp = async (e) => {
		e.preventDefault();
		const { data, error } = await signUp(email, password);
		if (error) {
			toast({ variant: 'destructive', title: 'Sign up failed', description: error.message });
		} else {
			toast({ title: 'Account created', description: 'Please check your email for confirmation.' });
		}
	};

	return (
		<main className="max-w-md mx-auto px-4 py-12">
			<PageHelmet title="Sign Up" />
			<ContentSection title="Create an Account">
				<form onSubmit={handleSignUp} className="space-y-4">
					<div>
						<label className="block text-sm text-gray-300">Email</label>
						<input className="w-full bg-[#08131f] border border-white/6 p-2 rounded mt-1 text-white" value={email} onChange={e => setEmail(e.target.value)} />
					</div>
					<div>
						<label className="block text-sm text-gray-300">Password</label>
						<input type="password" className="w-full bg-[#08131f] border border-white/6 p-2 rounded mt-1 text-white" value={password} onChange={e => setPassword(e.target.value)} />
					</div>
					<div className="text-right">
						<Button primary type="submit">Create Account</Button>
					</div>
				</form>
			</ContentSection>
		</main>
	);
}
