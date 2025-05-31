import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import type { Articles } from '@/lib/generated/prisma';
import { getURL, yyyymmddToString } from '@/lib/utils';
import * as yup from 'yup';

export default function AddArticleForm({ onArticleAdded }: { onArticleAdded: (article: Articles) => void}) {
	const [thumbnail, setThumbnail] = useState<File | undefined>(undefined); // state for uploaded thumbnail file
	
	const initialValues: Articles = { // initial values for the form
		link: '',
		title: '',
		organization: 'The Amherst Student',
		date: '',
		thumbnail: '',
		thumbnailDescription: ''
	}

	const yupSchema = yup.object({ // validation schema
		link: yup.string().required().url(),
		title: yup.string().required(),
		organization: yup.string().required().oneOf(['The Amherst Student', 'Santa Fe New Mexican', 'LANL']),
		date: yup.string().required(),
		thumbnail: yup.string().required(),
		thumbnailDescription: yup.string()
	});

	// upload thumbnail to supabase and add article to table
	async function handleSubmit(values: Articles, { resetForm, setSubmitting }: { resetForm: () => void, setSubmitting: (isSubmitting: boolean) => void }) {
		// null checking thumbnail so that typescript doesn't whine
		if (!thumbnail) {
			console.error('Thumbnail upload value is undefined.')
			setSubmitting(false); // chanelle cannot submit so form is not submitting
			return;
		}

		try {
			const validName = values.thumbnail.replace(/\s+/gu, '_'); // make name of thumbnail follow S3 naming conventions

			// create form data for thumbnail that the upload endpoint expects
			const thumbnailFormData = new FormData();
			thumbnailFormData.append('file', thumbnail);
			thumbnailFormData.append('fileName', validName);

			// upload thumbnail to Supabase
			const uploadRes = await fetch('/api/supabase/storage', {
				method: 'POST',
				body: thumbnailFormData
			});

			if (!uploadRes.ok) {
				throw new Error(`There was an error uploading thumbnail to storage: ${uploadRes.status}`);
			}

			const uploadResJson = await uploadRes.json(); // parse json response

			// create article data object
			const articleData = {
				link: values.link,
				title: values.title,
				organization: values.organization,
				date: yyyymmddToString(values.date),
				thumbnail: getURL(uploadResJson.url),
				thumbnailDescription: values.thumbnailDescription
			};

			// submit article to API
			await fetch('/api/supabase/articles', {
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
			onArticleAdded(articleData); // optimistically update the article list
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
				validationSchema={yupSchema}
				onSubmit={(values, { resetForm, setSubmitting }) => {
					handleSubmit(values, { resetForm, setSubmitting }); // submit the article
				}}
			>
				{({ isSubmitting, errors, touched, isValid, setFieldTouched, setFieldValue }) => {
					// update image state every time a file is chosen in the image input
					function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
						const file = e.target.files?.[0];

						// check if thumbanil is more than 4mb for Vercel
						if (file && file.size > 4 * 1024 * 1024) {
							e.target.value = ''; // clear input
							alert('Sorry bae, your cover art needs to be smaller than 4mb 💔 You can make it smaller here: https://imagecompressor.com/');
							setThumbnail(undefined);
							setFieldValue('thumbnail', '');
							return;
						}

						setThumbnail(file ?? undefined); // set thumbnail state to uploaded file
						setFieldTouched('thumbnail', true); // tell formik that thumbnail input has been touched
						setFieldValue('thumbnail', file ? file.name : ''); // update Formik's value
					}

					return (
						<div className='flex flex-col'>
							<Form className='relative flex flex-col gap-2 text-2xl'>
								<Field id='title' name='title' placeholder='Title' className='underline focus:outline-none rounded-md' />
								{errors.title && touched.title ? (<p className='absolute text-sm text-red-500 mt-[30px]'>💔 Title is required!</p>) : null}

								<Field id='link' name='link' placeholder='Link' className='underline focus:outline-none mt-5' />
								{errors.link && touched.link ? (<p className='absolute text-sm text-red-500 mt-[90px]'>💔 Link is required! Make sure it's valid!</p>) : null}

								<label htmlFor='organization' className='mt-5'>Organization:</label>
								<Field id='organization' name='organization' as='select' className='focus:outline-none cursor-pointer'>
									<option>The Amherst Student</option>
									<option>Santa Fe New Mexican</option>
									<option>LANL</option>
								</Field>

								<label htmlFor='date' className='mt-3'>Date published:</label>
								<Field id='date' name='date' type='date' className='focus:outline-none cursor-pointer' />
								{errors.date && touched.date ? (<p className='absolute text-sm text-red-500 mt-[280px]'>💔 Date is required!</p>) : null}

								<label htmlFor='thumbnail' className='mt-3'>Cover photo:</label>
								<div className='relative group'>
									<input
										id="thumbnail"
										name="thumbnail"
										type="file"
										accept="image/*"
										disabled={isSubmitting}
										onClick={() => setFieldTouched('thumbnail', true)}
										onChange={handleChange}
										className='bg-blue-400 absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed'
									/>
									<div className={`
										flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg
										${thumbnail ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'}
										group-hover:border-amber-300 group-hover:bg-amber-50 transition-colors
										${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
									`}>
										<svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
										</svg>
										<span className='text-sm'>
											{thumbnail ? thumbnail.name : 'Choose cover photo'}
										</span>
									</div>
								</div>
								{errors.thumbnail && touched.thumbnail ? (<p className='absolute text-sm text-red-500 mt-[390px]'>💔 Cover photo is required!</p>) : null}

								<Field id='thumbnailDescription' name='thumbnailDescription' placeholder='Photo description (optional)' className='text-xl underline focus:outline-none mt-2' />
								
								<div className='absolute left-1/2 -translate-x-1/2 top-[445px] flex justify-center'>
									<button
										type='submit'
										disabled={isSubmitting || (!isValid)}
										className='mt-5 bg-amber-200 hover:bg-amber-300 disabled:bg-gray-300 disabled:cursor-not-allowed py-1 px-2 w-fit rounded-lg'
									>
										{isSubmitting ? 'Adding...' : 'Add'}
									</button>
								</div>
							</Form>
						</div>
					);
				}}
			</Formik>
		</div>
	);
}