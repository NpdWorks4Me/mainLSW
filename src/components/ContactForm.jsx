import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function ContactForm(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Placeholder: in production this would call API/Email service
    console.log('ContactForm', { name, email, message });
  };

  if(submitted){
    return <div className="text-gray-200">Thank you! We’ve received your message and will get back to you shortly.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-300">Your Name</label>
        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#08131f] border border-white/6 p-2 rounded mt-1 text-white" placeholder="Jane" />
      </div>

      <div>
        <label className="block text-sm text-gray-300">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#08131f] border border-white/6 p-2 rounded mt-1 text-white" placeholder="you@email.com" />
      </div>

      <div>
        <label className="block text-sm text-gray-300">Message</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-[#08131f] border border-white/6 p-2 rounded mt-1 text-white" rows={4} placeholder="How can we help?" />
      </div>

      <div className="text-right">
        <Button primary type="submit">Send Message</Button>
      </div>
    </form>
  );
}
