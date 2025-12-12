import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { Link } from 'react-router-dom';

export default function ResetPasswordPage(){
	return (
		<main className="max-w-md mx-auto px-4 py-12">
			<PageHelmet title="Reset Password" />
			<ContentSection title="Reset Password">
				<p className="text-gray-300">If you've followed a password reset link, you will be able to set a new password on the page that you were redirected to. If you didn't receive an email, check your spam folder or try resending the password reset from the Forgot Password page.</p>
			</ContentSection>
			<section className="py-8">
				<Link to="/forgot-password" className="btn btn-primary">Request Password Reset</Link>
			</section>
		</main>
	);
}
