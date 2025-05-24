import React from 'react';
import { Formik, Form, Field } from 'formik';
import type { Articles } from '@/lib/generated/prisma';

export default function AddArticleForm() {
	const initialValues: Articles = {
		link: '',
		title: '',
		organization: '',
		date: '',
		thumbnail: '',
		thumbnailDescription: ''
	}

	return (
		<div className='absolute bg-gray-100 right-0 w-[260px] top-[100px] p-2 rounded-lg'>
			<Formik
				initialValues={initialValues}
				onSubmit={() => {}}
			>
				{() => {
					return (
						<Form className='flex flex-col gap-2 text-2xl'>
							<Field id='title' name='title' placeholder='Title' className='underline focus:outline-none rounded-md' />
							<Field id='link' name='link' placeholder='Link' className='underline focus:outline-none mt-5' />
							<label htmlFor='organization' className='mt-5'>Organization:</label>
							<Field id='organization' name='organization' as='select' className='focus:outline-none cursor-pointer'>					
								<option>The Amherst Student</option>
								<option>Santa Fe New Mexican</option>
								<option>LANL</option>
							</Field>
							<label htmlFor='date' className='mt-5'>Date published:</label>
							<Field id='date' name='date' type='date' className='focus:outline-none' />
							<label htmlFor='thumbnail' className='mt-5'>Cover photo:</label>
							<input id='thumbnail' name='thumbnail' type='file' className='text-xl'></input>
							<Field id='thumbnailDescription' name='thumbnailDescription' placeholder='Photo description (optional)' className='text-xl underline focus:outline-none'></Field>

							<div className='flex justify-center'>
								<button className='mt-5 bg-amber-200 hover:bg-amber-300 py-1 px-2 w-fit rounded-lg'>
									Add
								</button>
							</div>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
}
