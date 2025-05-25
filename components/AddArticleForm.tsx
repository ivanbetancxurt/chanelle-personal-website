import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import type { Articles } from '@/lib/generated/prisma';
import { getURL, supabaseThumbnailUpload, yyyymmddToString } from '@/lib/utils';

export default function AddArticleForm() {
	const [thumbnail, setThumbnail] = useState<File | undefined>(undefined); // state for uploaded thumbnail file

	const initialValues: Articles = { // initial values for the form
		link: '',
		title: '',
		organization: '',
		date: '',
		thumbnail: '',
		thumbnailDescription: ''
	}

	// update image state every time a file is chosen in the image input
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setThumbnail(e.target.files?.[0] ?? undefined);
	}

	// upload thumbnail to supabase and add article to table
	async function handleSubmit(values: Articles, { resetForm, setSubmitting }: { resetForm: () => void, setSubmitting: (isSubmitting: boolean) => void }) {
		if (!thumbnail) { //? needed?
			alert('Sorry bae, please upload some cover art for your article! <3');
			setSubmitting(false); // chanelle cannot submit so form is not submitting
			return;
		}

		try {
			const validName = thumbnail.name.replace(/\s+/gu, '_'); // make name of thumbnail follow S3 naming conventions
			const uploadRes = await supabaseThumbnailUpload('thumbnails', validName, thumbnail); // upload thumbnail to Supabase

			// submitted article object
			const articleData = {
				link: values.link,
				title: values.title,
				organization: values.organization,
				date: yyyymmddToString(values.date),
				thumbnail: getURL('thumbnails', uploadRes.path),
				thumbnailDescription: values.thumbnailDescription
			};

			// submit article to API
			await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(articleData)
			}).then(res => {
				if (!res.ok) throw new Error(`There was an error submitting the article: ${res.status}`);
			}).catch(err => {console.error(err);});

			resetForm(); // reset the form to initial values
			setThumbnail(undefined); // clear thumbnail state
			

			//? what is this?
			// Clear the file input
			const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
			if (fileInput) {
				fileInput.value = '';
			}

			
		} catch (err) {
			console.error('Error creating article:', err);
			alert(`Ah shi, sorry bae this isn't your fault! Take a picture of this for me and I'll try to fix it ASAP! <3 ~~~ ${err}`);
		} finally {
			setSubmitting(false); // form is submitted
		}
	}

	return (
		<div className='absolute bg-gray-100 right-0 w-[260px] top-[100px] p-2 rounded-xl bottom-0'>
			<Formik
				initialValues={initialValues}
				onSubmit={(values, { resetForm, setSubmitting }) => {
					handleSubmit(values, { resetForm, setSubmitting }); // submit the article
				}}
			>
				{({ isSubmitting }) => {
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
							<input
								id="thumbnail"
								name="thumbnail"
								type="file"
								accept="image/*"
								disabled={isSubmitting}
								onChange={handleChange}
								className='text-xl'
							/>

							<Field id='thumbnailDescription' name='thumbnailDescription' placeholder='Photo description (optional)' className='text-xl underline focus:outline-none'></Field>

							<div className='flex justify-center'>
								<button 
									type='submit' 
									disabled={isSubmitting}
									className='mt-5 bg-amber-200 hover:bg-amber-300 disabled:bg-gray-300 disabled:cursor-not-allowed py-1 px-2 w-fit rounded-lg'
								>
									{isSubmitting ? 'Adding...' : 'Add'}
								</button>
							</div>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
}