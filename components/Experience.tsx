'use client'

import React from 'react';
import Image from 'next/image';

export default function Experience() {
	return (
		<div className='pl-8 lg:flex lg:flex-col lg:flex-1 hidden items-center gap-6'>
			<section className='flex flex-col items-center'>
				<p className='text-2xl h-auto font-bold'>
					Education
				</p>
				<div className='flex justify-evenly py-3 h-auto'>
					<a href='https://www.amherst.edu/' target='_blank' rel='noopener noreferrer'>
						<Image 
							src='https://ceksxnfsszwkadypmabe.supabase.co/storage/v1/object/public/thumbnails//amherst-college-two-line-seal.webp' 	
							alt='Amherst College logo' 
							width={300} 
							height={100} 
							className='hover:bg-gray-200 rounded-2xl p-2' 
						/>
					</a>
					<a href='https://www.atcschool.org/' target='_blank' rel='noopener noreferrer'>
						<Image 
							src='https://ceksxnfsszwkadypmabe.supabase.co/storage/v1/object/public/thumbnails//atc-logo.webp' 
							alt='The Academy of Technology and the Classics logo' 
							width={110} 
							height={100} 
							className='hover:bg-gray-200 rounded-2xl p-2' 
						/>
					</a>    
				</div> 
			</section>
			
			<section className='flex flex-col w-full items-center'>
				<p className='text-2xl h-auto font-bold'>
					Experience
				</p>
				<div className='flex flex-col flex-1 gap-2 items-center'>
					<a href='https://www.nm.gov/' target='_blank' rel='noopener noreferrer'>
						<Image
							src='https://ceksxnfsszwkadypmabe.supabase.co/storage/v1/object/public/thumbnails//state-of-new-mexico-seal.png'
							alt='State of New Mexico Seal'
							width={400} 
							height={250}
							className='hover:bg-gray-200 rounded-2xl p-2' 
						/>
					</a>
					<a href='https://www.lanl.gov/' target='_blank' rel='noopener noreferrer'>
						<Image 
							src='https://ceksxnfsszwkadypmabe.supabase.co/storage/v1/object/public/thumbnails//lanl-logo.webp' 
							alt='Los Alamos National Laboratory logo' 
							width={400} 
							height={250} 
							className='hover:bg-gray-200 rounded-2xl p-2' 
						/>
					</a>
					<a href='https://amherststudent.com/' target='_blank' rel='noopener noreferrer'>
						<Image 
							src='https://ceksxnfsszwkadypmabe.supabase.co/storage/v1/object/public/thumbnails//the-amherst-student-logo.webp' 
							alt='The Amherst Student logo' 
							width={400} 
							height={250} 
							className='hover:bg-gray-200 rounded-2xl p-2' 
						/>
					</a>
					<a href='https://www.santafenewmexican.com/' target='_blank' rel='noopener noreferrer'>
						<Image 
							src='https://ceksxnfsszwkadypmabe.supabase.co/storage/v1/object/public/thumbnails//santa-fe-new-mexican-logo.webp' 
							alt='The Santa Fe New Mexican logo' 
							width={420} 
							height={250} 
							className='hover:bg-gray-200 rounded-2xl p-2' 
						/>
					</a>
				</div>
			</section>
		</div>
	);
}
