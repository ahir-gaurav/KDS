'use client';
import React, { useEffect, useState } from 'react';
import { publicAPI } from '@/lib/api';

const defaultMessages = [
    'FREE DELIVERY ABOVE ₹2000',
    '✦ USE CODE KICK10',
    '✦ NEW DROP SNEAKERS',
    '✦ LIMITED EDITION KICKS',
    '✦ FREE DELIVERY ABOVE ₹2000',
    '✦ USE CODE KICK10',
    '✦ NEW DROP SNEAKERS',
    '✦ LIMITED EDITION KICKS',
];

export default function TickerBar() {
    const [messages, setMessages] = useState(defaultMessages);

    useEffect(() => {
        publicAPI.getTicker()
            .then(({ data }) => {
                if (data.messages?.length > 0) {
                    const msgs = data.messages.map((m: any) => m.message);
                    setMessages([...msgs, ...msgs]); // double for seamless loop
                }
            })
            .catch(() => { });
    }, []);

    const text = messages.join('  ✦  ');

    return (
        <div className="bg-olive text-cream py-2.5 overflow-hidden border-y-4 border-black">
            <div className="flex">
                <div className="animate-marquee whitespace-nowrap flex items-center">
                    <span className="font-bebas text-lg tracking-widest pr-16 inline-block">{text}</span>
                    <span className="font-bebas text-lg tracking-widest pr-16 inline-block" aria-hidden="true">{text}</span>
                </div>
            </div>
        </div>
    );
}
