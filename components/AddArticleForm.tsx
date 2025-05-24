import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import type { Articles } from '@/lib/generated/prisma';
import { yyyymmddToString } from '@/lib/utils';

export default function AddArticleForm() {
	const [newArticle, setNewArticle] = useState<Articles>({
		link: '',
		title: '',
		organization: '',
		date: '',
		thumbnail: '',
		thumbnailDescription: ''
	});

	const initialValues: Articles = {
		link: '',
		title: '',
		organization: '',
		date: '',
		thumbnail: '',
		thumbnailDescription: ''
	}

	return (
		<div className='absolute bg-gray-100 right-0 w-[260px] top-[100px] p-2 rounded-xl bottom-0'>
			<Formik
				initialValues={initialValues}
				onSubmit={values => {
					values.date = yyyymmddToString(values.date);
					console.log(values.title, values.organization, values.link, values.thumbnailDescription, values.date);
				}}
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
							<Field id='date' name='date' type='date' className='focus:outline-none cursor-pointer' />

							<label htmlFor='thumbnail' className='mt-5'>Cover photo:</label>
							<input id='thumbnail' name='thumbnail' type='file' accept='image/*' className='text-xl'></input>

							<Field id='thumbnailDescription' name='thumbnailDescription' placeholder='Photo description (optional)' className='text-xl underline focus:outline-none'></Field>

							<div className='flex justify-center'>
								<button type='submit' className='mt-5 bg-amber-200 hover:bg-amber-300 py-1 px-2 w-fit rounded-lg'>
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