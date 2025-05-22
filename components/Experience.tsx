'use client'

import React from 'react';
import Image from 'next/image';

export default function Experience() {
	return (
		<div className='lg:flex lg:flex-col lg:flex-1 hidden items-center gap-12'>
			<section className='flex flex-col items-center'>
				<p className='text-2xl h-auto font-bold'>
					Education
				</p>
				<div className='flex justify-evenly py-5 h-auto'>
					<a href='https://www.amherst.edu/' target='_blank' rel='noopener noreferrer'>
						<Image src='/amherst-college-two-line-seal.png' alt='Amherst College logo' width={300} height={100} className='hover:bg-gray-200 rounded-2xl p-2' />
					</a>
					<a href='https://www.atcschool.org/' target='_blank' rel='noopener noreferrer'>
						<Image src='/atc-logo.png' alt='The Academy of Technology and the Classics logo' width={110} height={100} className='hover:bg-gray-200 rounded-2xl p-2' />
					</a>    
				</div> 
			</section>
			
			<section className='flex flex-col w-full items-center'>
				<p className='text-2xl h-auto font-bold'>
					Experience
				</p>
				<div className='flex flex-col flex-1 pt-5 gap-7 items-center'>
					<a href='https://www.lanl.gov/' target='_blank' rel='noopener noreferrer'>
						<Image src='/lanl-logo.png' alt='Los Alamos National Laboratory logo' width={400} height={250} className='hover:bg-gray-200 rounded-2xl p-2' />
					</a>
					<a href='https://amherststudent.com/' target='_blank' rel='noopener noreferrer'>
						<Image src='/the-amherst-student-logo.png' alt='The Amherst Student logo' width={400} height={250} className='hover:bg-gray-200 rounded-2xl p-2' />
					</a>
					<a href='https://www.santafenewmexican.com/' target='_blank' rel='noopener noreferrer'>
						<Image src='/santa-fe-new-mexican-logo.png' alt='The Santa Fe New Mexican logo' width={420} height={250} className='hover:bg-gray-200 rounded-2xl p-2' />
					</a>
				</div>
			</section>
		</div>
	);
}
