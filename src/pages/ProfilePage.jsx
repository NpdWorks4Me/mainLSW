import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/Button';

export default function ProfilePage(){
	const { user, profile, signOut } = useAuth();

	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="My Profile" />
			<ContentSection title="My Profile">
				{!user ? (
					<p className="text-gray-300">You are not logged in. Please sign in to view your profile.</p>
				) : (
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<img src={profile?.avatar_url || '/favicon.svg'} alt={profile?.nickname || user.email} className="w-16 h-16 rounded-full border" />
							<div>
								<div className="text-white font-semibold">{profile?.nickname || user.email}</div>
								<div className="text-sm text-gray-400">{user.email}</div>
							</div>
						</div>

						<div className="flex gap-2">
							<Button onClick={() => signOut()} variant="outline">Sign Out</Button>
						</div>
					</div>
				)}
			</ContentSection>
		</main>
	);
}
